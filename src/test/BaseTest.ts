import SR6Actor from '@/actor/SR6Actor';
import RollPrompt from '@/test/RollPrompt';
import { SR6ChatMessage } from '@/chat/SR6ChatMessage';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import { ITest, RollDataDelta, TestType } from '@/test/index';
import SR6Roll from '@/roll/SR6Roll';
import { Result, Ok, Err } from 'ts-results';

export interface BaseTestData {
	pool?: number;
	actorId?: ActorUUID;
	itemId?: ItemUUID;

	threshold?: number;

	autoHits?: number;
	explode?: true;
	parameters?: { glitch: number[]; success: number[] };
}

export interface TestConstructorData<TData extends BaseTestData> {
	type: string;
	modifiers: IModifier[];
	baseData: TData;
	actor: SR6Actor;

	delta?: RollDataDelta;
	item?: SR6Item;
	roll?: RollJSON;
}

export default abstract class BaseTest<TData extends BaseTestData = BaseTestData> implements ITest<TData, IModifier> {
	abstract type: TestType;

	protected baseData: TData;
	protected delta: RollDataDelta;

	modifiers: IModifier[];
	actor: SR6Actor;

	item?: SR6Item;
	roll?: SR6Roll;

	get isOwner(): boolean {
		return this.actor.isOwner;
	}

	// We use a proxy here for any changes to be applied to the delta
	get data(): TData {
		return new Proxy(foundry.utils.mergeObject(this.baseData, this.delta, { inplace: false }), {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			set: (diff: any, property: string, value: any) => {
				this.delta[property] = value;
				return true;
			},
		});
	}

	async performRoll(): Promise<Result<null, string>> {
		if (this.roll) {
			this.roll = await this.roll?.evaluate({ async: true });
			if (this.roll.options.explode) {
				await this.roll.explode();
			}

			return Ok(null);
		}

		return Err('Roll was undefined');
	}

	createRoll(): SR6Roll {
		return new SR6Roll(
			this.data.pool!,
			{
				actor: this.actor.getRollData(),
				item: this.item?.getRollData(),
			},
			{
				threshold: this.data.threshold,
				parameters: this.data.parameters,
			},
		);
	}

	async execute(): Promise<Result<null, null>> {
		console.log('BaseTest::execute', this);
		// Add our modifiers to the roll delta
		this.prepareModifiers();

		const configuredData = await this.prompt();
		if (configuredData.ok) {
			this.roll = this.createRoll();

			const res = await this.performRoll();
			if (res.ok) {
				this.finishModifiers();

				await this.toMessage();
				return Ok(null);
			}
		}

		return Err(null);
	}

	async prompt(): Promise<Result<RollDataDelta, null>> {
		const configuredRoll = await RollPrompt.prompt<TData, this>(this.actor, this);
		if (!configuredRoll) {
			return Err(null);
		}

		return Ok(this.delta);
	}

	reset(): void {
		this.delta = {};
	}

	prepareModifiers(): void {
		this.modifiers.forEach((modifier) => {
			modifier.prepareTest?.(this);
		});
	}

	finishModifiers(): void {
		this.modifiers.forEach((modifier) => {
			modifier.finishTest?.(this);
		});
	}

	async toMessage(): Promise<SR6ChatMessage | undefined> {
		let speaker = undefined;
		if (this.actor.isToken) {
			speaker = ChatMessage._getSpeakerFromToken({ token: this.actor.getActiveTokens()[0] });
		} else {
			speaker = ChatMessage._getSpeakerFromActor({ actor: this.actor });
		}

		return await SR6ChatMessage.create({
			user: game.user?.id,
			type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			speaker,
			roll: this.roll?.toJSON(),
			content: '',
			flags: {
				['sr6']: { testData: this.toJSON() },
				'core.canPopout': true,
			},
			sound: CONFIG.sounds.dice,
		});
	}

	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			baseData: this.baseData,
			delta: this.delta,
			modifiers: this.modifiers,
			roll: this.roll?.toJSON(),
		};
	}

	protected constructor({
		actor,
		item,
		data,
		delta,
		roll,
	}: {
		actor: SR6Actor;
		item?: SR6Item;
		data: TData;
		delta?: RollDataDelta;
		roll?: SR6Roll;
	}) {
		this.delta = delta ? delta : {};
		this.baseData = data;
		this.actor = actor;
		this.item = item;
		this.roll = roll;

		this.baseData.actorId = actor.uuid;
		this.baseData.itemId = item ? item.uuid : undefined;

		// copy applicable modifiers off the actor
		this.modifiers = actor.modifiers.applicable;
	}
}
