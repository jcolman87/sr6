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
	Once = 'once',
}

export enum ConditionTarget {
	Self = 'self',
	Target = 'target',
}

export enum ConditionSituation {
	Always = 'always',
	Roll = 'roll',
	Combat = 'combat',
}

export enum ConditionModifierType {
	AddEdge = 'addEdge',
	Pool = 'pool',
	AttackRating = 'ar',
	Damage = 'damage',
	MatrixAttributes = 'matrixAttributes',
	ActiveEffect = 'activeEffect',
	Opposed = 'opposed',
	PreventActions = 'prevent',
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
	abstract target: ConditionTarget;

	abstract icon: string | undefined;

	abstract modifiers: ConditionEffectChangeData[];

	abstract source: string;

	async getEffect(): Promise<null | SR6Effect> {
		if (!this.item) {
			return null;
		}

		for (const ef of this.item!.effects) {
			const e = ef as SR6Effect;
			const data = await e.getConditionData();
			if (data && data.sourceConditionId === this.item!.id) {
				return e;
			}
		}
		return null;
	}

	getModifiers(
		type: ConditionModifierType,
		situation: ConditionSituation = ConditionSituation.Always,
		activation: ConditionActivation = ConditionActivation.Always
	): ConditionEffectChangeData[] {
		return this.modifiers.filter(
			(modifier) =>
				modifier.situation === situation ||
				(modifier.situation == ConditionSituation.Always &&
					(modifier.activation === ConditionActivation.Always || modifier.activation === activation))
		);
	}

	getModifiersForRoll(
		type: RollType,
		situation: ConditionSituation = ConditionSituation.Roll
	): ConditionEffectChangeData[] {
		return this.getModifiers(ConditionModifierType.Pool, situation).filter((modifier) => {
			if (modifier.type == 'pool') {
				const path = modifier.key.split('.');
				if (path.length === 1) {
					if (modifier.key === RollType[type]) {
						return true;
					}
				} else {
					switch (path[0]) {
						case 'category':
							if (getRollCategory(path[1]).includes(type)) {
								return true;
							}
							break;
						default:
							ui.notifications.error(
								`Invalid category for modification ${type}: ${modifier.key} - ${path}`
							);
							throw 'ERR';
					}
				}
			} else {
				return false;
			}
		});
	}

	getPoolModifier(type: RollType): number {
		let pool: number = 0;

		this.getModifiersForRoll(type).forEach((modifier) => {
			pool += this.item!.solveFormula(modifier.value, this.actor);
		});

		return pool;
	}

	async applyActiveEffects(actor: SR6Actor, item: SR6Item<ConditionDataModel>): Promise<boolean> {
		const changes: EffectChangeSource[] = this.getModifiers(ConditionModifierType.ActiveEffect).map((effect) => {
			return {
				key: effect.key,
				value: effect.value,
				priority: 0,
				mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
			};
		});

		const effect = (
			await item.createEmbeddedDocuments('ActiveEffect', [
				{
					name: this.name,
					description: this.description,
					icon: this.icon,
					transfer: true,
					origin: this.item!.uuid,
					disabled: false,
					changes: changes,
					statuses: this.statusEffectId ? [this.statusEffectId] : [],
					duration: {
						turns: this.duration.turns,
						rounds: this.duration.rounds,
						startRound: game.combat ? game.combat!.round : 0,
						startTurn: game.combat ? game.combat!.turn : 0,
					},
				},
			])
		)[0] as SR6Effect;
		await effect.setFlag('sr6', 'ConditionActiveEffectData', {
			sourceItemId: this.item!.uuid,
			sourceActorId: actor.uuid,
			turnCreated: game.combat ? game.combat!.turn : null,
		});

		return true;
	}

	// game.actors.getName("test1").items.getName("Take Aim").system.conditions[0].apply(game.actors.getName("test1"));
	// game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) => i.delete());
	// game.actors.getName("test1").items.filter((i) => i.type == 'condition').forEach((i) =>
	async applyToActor(actor: SR6Actor): Promise<SR6Item<ConditionDataModel>> {
		const item = (
			await actor.createEmbeddedDocuments('Item', [
				{
					name: this.name,
					type: 'condition',
					system: { ...this, source: this.item! },
				},
			])
		)[0] as SR6Item<typeof this>;

		await this.applyActiveEffects(actor, item);

		return item;
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
			source: new fields.DocumentIdField({ initial: null, required: true, nullable: true }),
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
						// choices: [
						//	...Object.keys(RollType),
						//	...Array.from(ROLL_CATEGORIES.keys()).map((k: string) => `category.${k}`),
						// ],
					}),
					value: new fields.StringField({ required: true, nullable: false, blank: false }),
				}),
				{ initial: [], required: true, nullable: true }
			),
		};
	}
}
