import SR6Actor from '@/actor/SR6Actor';
import RollPrompt from '@/app/RollPrompt2';
import { SR6ChatMessage } from '@/chat/SR6ChatMessage';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import { ITest, RollDataDelta, TestType } from '@/roll/test/index';
import { SR6Roll } from '@/roll/v2/SR6Roll';

export interface BaseTestData {
	pool?: number;
	actorId?: ActorUUID;
	itemId?: ItemUUID;

	threshold?: number;

	autoHits?: number;
	explode?: true;
	parameters?: { glitch: number[]; success: number[] };
}

export interface BaseTestMessageData {
	type: string;
	modifiers: IModifier[];
	baseData: BaseTestData;
	actor: SR6Actor;

	delta?: RollDataDelta;
	item?: SR6Item;
	roll?: RollJSON;
}

export default abstract class BaseTest<
	TData extends BaseTestData = BaseTestData,
	TModifier extends IModifier = IModifier,
> implements ITest<TData, TModifier>
{
	type: TestType = TestType.Unknown;

	protected baseData: TData;
	protected delta: undefined | RollDataDelta;

	modifiers: TModifier[];
	actor: SR6Actor;

	item?: SR6Item;
	roll?: SR6Roll;

	get isOwner(): boolean {
		return this.actor.isOwner;
	}

	get data(): TData {
		if (this.delta) {
			return foundry.utils.mergeObject(this.baseData, this.delta, { inplace: false });
		} else {
			return this.baseData;
		}
	}

	set data(roll: TData) {
		this.delta = foundry.utils.diffObject(this.baseData, roll);
	}

	async execute(): Promise<Result<null, null>> {
		// Add our modifiers to the roll delta
		this.prepareModifiers();

		const configuredData = await this.prompt();
		if (configuredData.ok) {
			this.roll = new SR6Roll(
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

			this.roll = await this.roll.evaluate({ async: true });
			this.finishModifiers();
			if (this.roll.options.explode) {
				await this.roll.explode();
			}

			const _message = await this.toMessage();
		}

		return Ok(null);
	}

	async prompt(): Promise<Result<RollDataDelta, null>> {
		const configuredRoll = await RollPrompt.prompt<TData, this>(this.actor, this);
		if (!configuredRoll) {
			return Err(null);
		}
		this.delta = foundry.utils.diffObject(this.baseData, configuredRoll);

		return Ok(this.delta);
	}

	reset(): void {
		this.delta = undefined;
	}

	prepareModifiers(): void {
		this.modifiers.forEach((modifier) => {
			modifier.prepareTest(this);
		});
	}

	finishModifiers(): void {
		this.modifiers.forEach((modifier) => {
			modifier.finishTest(this);
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
			roll: this.roll,
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
		this.modifiers = [];
		this.delta = delta;
		this.baseData = data;
		this.actor = actor;
		this.item = item;
		this.roll = roll;

		this.baseData.actorId = actor.uuid;
		this.baseData.itemId = item ? item.uuid : undefined;
	}
}
