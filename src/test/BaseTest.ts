import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { getClass } from '@/data/serialize';
import { EdgeBoostType, getEdgeBoost, IEdgeBoost } from '@/edge';
import BaseModifier from '@/modifier/BaseModifier';
import TestRollPrompt from '@/roll/TestRollPrompt';
import { SR6ChatMessage } from '@/chat/SR6ChatMessage';
import SR6Item from '@/item/SR6Item';
import { IModifier, ModifierSourceData } from '@/modifier';
import { ITest, RollDataDelta, TestType } from '@/test/index';
import SR6Roll from '@/roll/SR6Roll';
import { ConstructorOf, getActorSync, getItemSync } from '@/util';
import { Result, Ok, Err } from 'ts-results';

export interface BaseTestData {
	pool?: number;
	actorId?: ActorUUID;
	itemId?: ItemUUID;

	threshold?: number;

	autoHits?: number;
	explode?: true;
	parameters?: { glitch: number[]; success: number[] };

	edgeSpent?: EdgeBoostType;
}

export interface TestConstructorData<
	TData extends BaseTestData,
	TActorDataModel extends BaseActorDataModel = BaseActorDataModel,
> {
	actor: SR6Actor<TActorDataModel>;
	data: TData;
	modifiers?: IModifier[];
	item?: SR6Item;
	delta?: RollDataDelta;
	roll?: SR6Roll;
}

export interface TestSourceData<TData extends BaseTestData> {
	type: string;
	modifiers: ModifierSourceData[];
	baseData: TData;
	actor: SR6Actor;

	delta?: RollDataDelta;
	item?: SR6Item;
	roll?: RollJSON;
}

export default abstract class BaseTest<TData extends BaseTestData = BaseTestData> implements ITest<TData> {
	protected baseData: TData;
	protected delta: RollDataDelta;

	modifiers: IModifier[];
	actor: SR6Actor;

	item?: SR6Item;
	roll?: SR6Roll;

	edgeBoost?: IEdgeBoost;

	get type(): TestType {
		return TestType.INVALID;
	}

	get isOwner(): boolean {
		return this.actor.isOwner;
	}

	is(type: ConstructorOf<BaseTest>): boolean {
		console.log(type);
		throw 'lol';
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
		return SR6Roll.createRoll(
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

	applyEdgeBoost(boost: IEdgeBoost): boolean {
		if (this.data.edgeSpent) {
			return false;
		}
		this.data.edgeSpent = boost.type;
		this.edgeBoost = boost;

		// Are we applying post-roll? If so just call the post roll application
		if (this.roll) {
			this.edgeBoost.finishRoll?.(this.roll);
			this.edgeBoost.finishTest?.(this);
			this.edgeBoost.finishActor?.(this.actor);
		}

		return true;
	}

	async execute(): Promise<Result<null, null>> {
		// Add our modifiers to the roll delta
		await this.prepareModifiers();

		const configuredData = await this.prompt();
		if (configuredData.ok) {
			if (this.edgeBoost) {
				this.edgeBoost.prepareTest?.(this);
				this.edgeBoost.prepareActor?.(this.actor);
			}
			this.roll = this.createRoll();

			const res = await this.performRoll();
			if (res.ok) {
				await this.finishModifiers();

				await this.toMessage();
				return Ok(null);
			}
		}

		return Err(null);
	}

	async prompt(): Promise<Result<RollDataDelta, null>> {
		const configuredRoll = await TestRollPrompt.prompt<TData, this>(this.actor, this);
		if (!configuredRoll) {
			return Err(null);
		}

		return Ok(this.delta);
	}

	reset(): void {
		this.delta = {};
	}

	async prepareModifiers(): Promise<void> {
		for (const modifier of this.modifiers) {
			await modifier.prepareTest?.(this);
		}
	}

	async finishModifiers(): Promise<void> {
		for (const modifier of this.modifiers) {
			await modifier.finishTest?.(this);
		}

		if (this.edgeBoost) {
			if (this.roll) {
				this.edgeBoost.finishRoll?.(this.roll);
			}
			this.edgeBoost.finishTest?.(this);
		}
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
			modifiers: this.modifiers.map((modifier) => modifier.toJSON()),
			roll: this.roll?.toJSON(),
		};
	}

	protected constructor(args: TestConstructorData<TData>) {
		this.delta = args.delta || {};
		this.baseData = args.data;
		this.actor = args.actor;
		this.item = args.item;
		this.roll = args.roll;
		this.modifiers = args.modifiers || [];

		this.baseData.actorId = args.actor.uuid;
		this.baseData.itemId = args.item ? args.item.uuid : undefined;

		if (this.data.edgeSpent) {
			this.edgeBoost = getEdgeBoost(this.data.edgeSpent);
		}

		// copy applicable modifiers off the actor
		this.modifiers = this.actor.modifiers.getApplicable(this);
	}

	static fromData<TTest extends BaseTest = BaseTest, TData extends BaseTestData = BaseTestData>(
		msgData: TestSourceData<TData>,
	): Result<TTest, string> {
		const actor = getActorSync(SR6Actor, msgData.baseData.actorId!);
		const item = msgData.baseData.itemId ? getItemSync(SR6Item, msgData.baseData.itemId) : null;
		const modifiers = msgData.modifiers.map((modifierData) => BaseModifier.fromData(modifierData));

		const cls = getClass<ConstructorOf<BaseTest>>(CONFIG.sr6.types.tests, { class: msgData.type });
		if (cls.ok) {
			const test = new cls.val({
				actor,
				item,
				data: msgData.baseData,
				delta: msgData.delta,
				roll: msgData.roll ? SR6Roll.fromData(msgData.roll) : undefined,
				modifiers,
			}) as TTest;
			return Ok(test);
		}
		return Err(cls.val);
	}
}
