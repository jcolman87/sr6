import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';
import SR6Effect from '@/effects/SR6Effect';
import SR6Item from '@/item/SR6Item';
import { getRollCategory, ROLL_CATEGORIES, RollType } from '@/roll';
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
	Always = 'always',
	Roll = 'roll',
}

export enum ConditionModifierType {
	Pool = 'pool',
	ActiveEffect = 'activeEffect',
}

export type ConditionDuration = {
	turns: number | null;
	rounds: number | null;
	rolls: number | null;
};

export type ConditionEffectChangeData = {
	type: ConditionModifierType;
	situation: ConditionSituation;
	activation: ConditionActivation;
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
	abstract description: string;
	abstract statusEffectId: string | null;

	abstract activation: ConditionActivation;
	abstract activationSituation: ConditionSituation;
	abstract duration: ConditionDuration;

	abstract icon: string | undefined;

	abstract modifiers: ConditionEffectChangeData[];

	get activeEffectModifiers(): ConditionEffectChangeData[] {
		return this.modifiers.filter((modifier) => modifier.type === ConditionModifierType.ActiveEffect);
	}

	get poolModifiers(): ConditionEffectChangeData[] {
		return this.modifiers.filter((modifier) => modifier.type === ConditionModifierType.Pool);
	}

	getModifiersForSituation(
		situation: ConditionSituation,
		activation: ConditionActivation = ConditionActivation.Always
	): ConditionEffectChangeData[] {
		return this.modifiers.filter(
			(modifier) =>
				modifier.situation === situation &&
				(modifier.activation === ConditionActivation.Always || modifier.activation === activation)
		);
	}

	getModifiersForRoll(type: RollType): ConditionEffectChangeData[] {
		return this.poolModifiers.filter((modifier) => {
			const path = modifier.key.split('.');
			if (path.length === 1) {
				if (modifier.key === RollType[type]) {
					return true;
				}
			} else {
				switch (path[0]) {
					case 'category':
						if (getRollCategory(path[0]).includes(type)) {
							return true;
						}
						break;
					default:
						ui.notifications.error(`Invalid category for modification ${path[0]}`);
						throw 'ERR';
				}
			}
		});
	}

	getPoolModifier(type: RollType): number {
		let pool = 0;

		this.getModifiersForRoll(type).forEach((modifier) => {
			pool += this.item!.solveFormula(modifier.value, this.actor);
		});

		return pool;
	}

	// game.actors.getName("test1").items.getName("Take Aim").system.conditions[0].apply(game.actors.getName("test1"));
	// game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) => i.delete());
	// game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) =>
	async apply(actor: SR6Actor): Promise<void> {
		const item = (
			await actor.createEmbeddedDocuments('Item', [
				{
					name: this.name,
					type: 'condition',
					system: this,
				},
			])
		)[0] as SR6Item<ConditionDataModel>;

		const changes: EffectChangeSource[] = this.activeEffectModifiers.map((effect) => {
			return {
				key: effect.key,
				value: effect.value,
				priority: 0,
				mode: CONST.ACTIVE_EFFECT_MODES.ADD,
			};
		});

		const effect = (
			await item.createEmbeddedDocuments('ActiveEffect', [
				{
					name: this.name,
					descriont: this.description,
					icon: this.icon,
					transfer: true,
					origin: item.id,
					disabled: false,
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

	override prepareDerivedData(): void {
		// If we are part of a condition item, set the icon to the item image
		if (this.item) {
			if (this.item!.type === 'condition') {
				this.icon = this.item!.img;
			}
		}
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		return {
			name: new fields.StringField({ initial: 'Condition!', required: true, nullable: false, blank: false }),
			statusEffectId: new fields.StringField({ required: true, nullable: true, blank: false }),
			description: new fields.StringField({ initial: '', required: true, nullable: false, blank: true }),

			activation: new fields.StringField({
				initial: ConditionActivation.Always,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ConditionActivation),
			}),
			activationSituation: new fields.StringField({
				initial: ConditionSituation.Always,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ConditionSituation),
			}),

			target: new fields.StringField({
				initial: ConditionTarget.Self,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ConditionTarget),
			}),
			duration: new fields.SchemaField(
				{
					turns: new fields.NumberField({
						initial: null,
						required: true,
						nullable: true,
						integer: true,
						min: 1,
					}),
					rounds: new fields.NumberField({
						initial: null,
						required: true,
						nullable: true,
						integer: true,
						min: 1,
					}),
					rolls: new fields.NumberField({
						initial: null,
						required: true,
						nullable: true,
						integer: true,
						min: 1,
					}),
				},
				{ required: true, nullable: false }
			),
			icon: new fields.StringField({
				initial: 'icons/svg/item-bag.svg',
				required: true,
				nullable: false,
				blank: false,
			}),
			modifiers: new fields.ArrayField(
				new fields.SchemaField({
					type: new fields.StringField({
						initial: ConditionModifierType.Pool,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(ConditionModifierType),
					}),
					situation: new fields.StringField({
						initial: ConditionSituation.Always,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(ConditionSituation),
					}),
					activation: new fields.StringField({
						initial: ConditionActivation.Always,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(ConditionActivation),
					}),
					key: new fields.StringField({
						required: true,
						nullable: false,
						blank: false,
						choices: [
							...Object.keys(RollType),
							...Array.from(ROLL_CATEGORIES.keys()).map((k: string) => `category.${k}`),
						],
					}),
					value: new fields.StringField({ required: true, nullable: false, blank: false }),
				}),
				{ initial: [], required: true, nullable: true }
			),
		};
	}
}
