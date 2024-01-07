/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel, { ConditionActiveEffectData } from '@/condition/ConditionDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';
import { getItem } from '@/util';

export default class SR6Effect extends ActiveEffect {
	constructor(data: PreCreate<foundry.data.ActiveEffectSource>, context?: DocumentConstructionContext<ActiveEffect>) {
		super(data, context);
	}

	// Ghetto hack, determine if we are a condition by our name
	get isStatusEffectCondition(): boolean {
		const parent = this.parent as SR6Item<ConditionDataModel>;
		if (parent.systemData.statusEffectId) {
			return true;
		}

		return false;
	}

	get isCondition(): boolean {
		return this.parent instanceof SR6Item<ConditionDataModel>;
	}

	get condition(): ConditionDataModel | null {
		if (this.isCondition) {
			return (this.parent as SR6Item<ConditionDataModel>).systemData;
		}
		return null;
	}

	async getConditionData(): Promise<ConditionActiveEffectData | null> {
		const data = this.getFlag('sr6', 'ConditionActiveEffectData');
		return data ? (data as ConditionActiveEffectData) : null;
	}

	async setConditionData(data: ConditionActiveEffectData | null): Promise<void> {
		await this.setFlag('sr6', 'ConditionActiveEffectData', data);
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
	}

	override get isSuppressed(): boolean {
		return this.disabled;
	}

	override apply(actor: Actor, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
		change = this._parseChanges(actor, change);

		// Determine the data type of the target field
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const current: any = foundry.utils.getProperty(actor, change.key) ?? null;
		let target = current;
		if (current === null) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const model = (game as any).model.Actor[actor.type] || {};
			target = foundry.utils.getProperty(model, change.key) ?? null;
		}
		let targetType = foundry.utils.getType(target);

		// Cast the effect change value to the correct type
		let delta;
		try {
			if (targetType === 'Array') {
				const innerType = target!.length ? foundry.utils.getType(target[0]) : 'string';
				delta = this._castArray(change.value, innerType);
			} else delta = this._castDelta(change.value, targetType);
		} catch (err) {
			console.warn(
				`Actor [${actor.id}] | Unable to parse active effect change for ${change.key}: "${change.value}"`
			);
			return undefined;
		}

		// Apply the change depending on the application mode
		const modes = CONST.ACTIVE_EFFECT_MODES;
		const changes = {};
		switch (change.mode) {
			case modes.ADD:
				this._applyAdd(actor, change, current, delta, changes);
				break;
			case modes.MULTIPLY:
				this._applyMultiply(actor, change, current, delta, changes);
				break;
			case modes.OVERRIDE:
				this._applyOverride(actor, change, current, delta, changes);
				break;
			case modes.UPGRADE:
			case modes.DOWNGRADE:
				this._applyUpgrade(actor, change, current, delta, changes);
				break;
			default: // CUSTOM CASE
				const baseActor = actor as SR6Actor<BaseActorDataModel>;
				//  let actor = actor as SR6Actor<CharacterDataModel> as any;
				let path = change.key.split(':');
				if (path.length > 1) {
					switch (path[0]) {
						case 'matrixPersona': {
							let persona = (actor as SR6Actor<CharacterDataModel>).systemData.matrixPersona;
							if (persona) {
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								(persona.attributes.base as any)[path[1]] = change.value;
							}
							break;
						}
						default: {
							change.key = path[1];
							change.mode = CONST.ACTIVE_EFFECT_MODES.OVERRIDE;
							this._applyOverride(actor, change, current, delta, changes);
						}
					}
				} else {
					change.mode = CONST.ACTIVE_EFFECT_MODES.ADD;
					this._applyAdd(actor, change, current, delta, changes);
				}
				break;
		}

		// Apply all changes to the Actor data
		foundry.utils.mergeObject(actor, changes);
		return changes as any;
	}

	_parseChanges(actor: Actor, change: ApplicableChangeData<this>): ApplicableChangeData<this> {
		if (change.mode != CONST.ACTIVE_EFFECT_MODES.CUSTOM && !change.key.includes('system.')) {
			change.key = `system.${change.key}`;
		}

		if (change.value.includes('@')) {
			// BUG: we cant use get by UUID here because it causes an infinite loop from preparing data.
			let origin = actor.items.find((i) => i.uuid == (this.origin as ItemUUID)) as SR6Item<BaseItemDataModel>; //getItem(SR6Item<BaseItemDataModel>, this.origin as ItemUUID);

			if (origin) {
				change.value = origin.solveFormula(change.value, actor as SR6Actor<BaseActorDataModel>).toString();
			} else {
				change.value = (actor as SR6Actor<BaseActorDataModel>).solveFormula(change.value).toString();
			}
			//
		}

		return change;
	}
}
