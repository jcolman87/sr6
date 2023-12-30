import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';
import SR6Effect from '@/effects/SR6Effect';
import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';
import fields = foundry.data.fields;
import EffectChangeSource = foundry.data.EffectChangeSource;

export enum ConditionActivation {
	Always = 'always',
	OnUse = 'onuse',
	OnHit = 'onhit',
}

export enum ConditionTarget {
	Self = 'self',
	Target = 'target',
}

export enum ConditionSituation {
	Any = 'any',
	Roll = 'roll',
}

export type ConditionDuration = {
	turns: number | null;
	rounds: number | null;
};

export type ConditionEffectChangeData = {
	key: string;
	value: string;
};

export type ConditionActiveEffectData = {
	turnCreated: number | null;
	sourceConditionId: string | null;
	sourceActorId: string | null;
};

export default abstract class ConditionDataModel extends BaseDataModel {
	abstract name: string;

	abstract activation: ConditionActivation;
	abstract situation: ConditionSituation;
	abstract duration: ConditionDuration;

	abstract icon: string | undefined;

	abstract poolModifiers: ConditionEffectChangeData[];
	abstract activeEffectChanges: ConditionEffectChangeData[];

	abstract script: string | null;

	getPoolModifier(type: RollType): number {
		let pool = 0;

		this.poolModifiers.forEach((modifier) => {
			if (modifier.key == RollType[type]) {
				pool += this.actor!.solveFormula(modifier.value);
			}
		});

		return pool;
	}

	//game.actors.getName("test1").items.getName("Take Aim").system.conditions[0].apply(game.actors.getName("test1"));
	// game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) => i.delete());
	//game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) =>
	async apply(actor: SR6Actor) {
		let item = (
			await actor.createEmbeddedDocuments('Item', [
				{
					name: this.name,
					type: 'condition',
					system: this,
				},
			])
		)[0] as SR6Item<ConditionDataModel>;

		let changes: EffectChangeSource[] = this.activeEffectChanges.map((effect) => {
			return {
				key: effect.key,
				value: effect.value,
				priority: 0,
				mode: CONST.ACTIVE_EFFECT_MODES.ADD,
			};
		});

		let effect = (
			await this.item!.createEmbeddedDocuments('ActiveEffect', [
				{
					name: this.name,
					icon: this.icon,
					transfers: true,
					duration: {
						turns: this.duration.turns,
						rounds: this.duration.rounds,
						startTurn: game.combat ? game.combat!.turn : 0,
					},
				},
			])
		)[0] as SR6Effect;
		await effect.setFlag('sr6', 'ConditionActiveEffectData', {
			sourceItemId: this.item! ? this.item!.id : null,
			sourceActorId: this.actor! ? this.actor!.id : null,
			turnCreated: game.combat ? game.combat!.turn : null,
		});
	}

	static defineSchema() {
		return {
			name: new fields.StringField({ initial: 'Condition!', required: true, nullable: false, blank: false }),
			description: new fields.StringField({ initial: '', required: true, nullable: false, blank: true }),

			activation: new fields.StringField({ initial: ConditionActivation.OnUse, required: true, nullable: false, blank: false, choices: Object.values(ConditionActivation) }),
			situation: new fields.StringField({ initial: ConditionSituation.Any, required: true, nullable: false, blank: false, choices: Object.values(ConditionSituation) }),

			target: new fields.StringField({ initial: ConditionTarget.Self, required: true, nullable: false, blank: false, choices: Object.values(ConditionTarget) }),
			duration: new fields.SchemaField(
				{
					turns: new fields.NumberField({ initial: null, required: true, nullable: true, integer: true, min: 1 }),
					rounds: new fields.NumberField({ initial: null, required: true, nullable: true, integer: true, min: 1 }),
				},
				{ required: true, nullable: false },
			),
			icon: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
			poolModifiers: new fields.ArrayField(
				new fields.SchemaField({
					key: new fields.StringField({ required: true, nullable: false, blank: false, choices: Object.keys(RollType) }),
					value: new fields.StringField({ required: true, nullable: false, blank: false }),
				}),
				{ initial: [], required: true, nullable: false },
			),
			activeEffectChanges: new fields.ArrayField(
				new fields.SchemaField({
					key: new fields.StringField({ required: true, nullable: false, blank: false }),
					value: new fields.StringField({ required: true, nullable: false, blank: false }),
				}),
				{ initial: [], required: true, nullable: false },
			),
			script: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
		};
	}
}
