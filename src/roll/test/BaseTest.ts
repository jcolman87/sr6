import SR6Actor from '@/actor/SR6Actor';
import RollPrompt from '@/app/RollPrompt2';
import { SR6ChatMessage } from '@/chat/SR6ChatMessage';
import SR6Item from '@/item/SR6Item';
import { IModifier } from '@/modifier';
import { ITest, RollDataDelta } from '@/roll/test/index';
import { SR6Roll } from '@/roll/v2/SR6Roll';

export interface BaseTestData {
	pool: number;
	actorId: ActorUUID;
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
	delta: null | RollDataDelta;
	actor: SR6Actor;
	item: SR6Item | undefined;
}

export default abstract class BaseTest<
	TData extends BaseTestData = BaseTestData,
	TModifier extends IModifier = IModifier,
> implements ITest<TData, TModifier>
{
	type: string = 'BaseTest';

	protected baseData: TData;
	protected delta: null | RollDataDelta;

	modifiers: TModifier[];
	actor: SR6Actor;
	item: SR6Item | undefined;

	roll: null | SR6Roll;

	get template(): string {
		return 'systems/sr6/templates/chat/tests/BaseTest.hbs';
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
		console.log('BaseTest::execute', this);

		// Add our modifiers to the roll delta
		this.prepareModifiers();

		const configuredData = await this.prompt();
		if (configuredData.ok) {
			console.log('BaseTest::configuredData', this.data, this);

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
			// TODO: await this.roll.explode();

			console.log('BaseTest::Rolled', this);

			const message = await this.toMessage();
			console.log('BaseTest::toMessage', message!.id, message);
		}

		return Ok(null);
	}

	async prompt(): Promise<Result<RollDataDelta, null>> {
		console.log('BaseTest::prompt', this);
		const configuredRoll = await RollPrompt.prompt<TData, this>(this.actor, this);
		if (!configuredRoll) {
			return Err(null);
		}
		this.delta = foundry.utils.diffObject(this.baseData, configuredRoll);

		return Ok(this.delta);
	}

	reset(): void {
		this.delta = null;
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
		/*
		const content = await renderTemplate(this.template, {
			test: this,
			roll: this.roll,
			item: this.item,
			actor: this.actor,
			speaker: {
				actor: this.actor,
			},
		});
		*/

		return await SR6ChatMessage.create({
			user: game.user?.id,
			type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			speaker: {
				actor: this.actor.id,
				alias: game.user?.name,
			},
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

	protected constructor({ actor, item, data }: { actor: SR6Actor; item?: SR6Item; data: TData }) {
		this.modifiers = [];
		this.delta = null;
		this.baseData = data;
		this.actor = actor;
		this.item = item;
		this.roll = null;

		this.baseData.actorId = actor.uuid;
	}
}
