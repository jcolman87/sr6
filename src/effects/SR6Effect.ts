/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import ConditionDataModel, { ConditionActiveEffectData } from '@/condition/ConditionDataModel';
import SR6Item from '@/item/SR6Item';
import { getItemSync } from '@/util';

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
		return this.parent instanceof SR6Item && (this.parent as SR6Item).systemData instanceof ConditionDataModel;
	}

	get condition(): ConditionDataModel | null {
		if (this.isCondition) {
			return (this.parent as SR6Item<ConditionDataModel>).systemData;
		}
		return null;
	}

	override get isSuppressed(): boolean {
		return this.disabled;
	}

	async getConditionData(): Promise<ConditionActiveEffectData | null> {
		const data = this.getFlag('sr6', 'ConditionActiveEffectData');
		return data ? (data as ConditionActiveEffectData) : null;
	}

	async setConditionData(data: ConditionActiveEffectData | null): Promise<void> {
		await this.setFlag('sr6', 'ConditionActiveEffectData', data);
	}

	override apply(actor: Actor, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
		return this._apply(actor, change);
	}

	_apply(document: Actor | Item, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
		change = this._parseChanges(document, change);

		// Determine the data type of the target field
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const current: any = foundry.utils.getProperty(document, change.key) ?? null;
		let target = current;
		if (current === null) {
			if (target instanceof Actor) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const model = (game as any).model.Actor[document.type] || {};
				target = foundry.utils.getProperty(model, change.key) ?? null;
			} else if (target instanceof Item) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const model = (game as any).model.Item[document.type] || {};
				target = foundry.utils.getProperty(model, change.key) ?? null;
			}
		}
		const targetType = foundry.utils.getType(target);

		// Cast the effect change value to the correct type
		let delta;
		try {
			if (targetType === 'Array') {
				const innerType = target!.length ? foundry.utils.getType(target[0]) : 'string';
				delta = this._castArray(change.value, innerType);
			} else delta = this._castDelta(change.value, targetType);
		} catch (err) {
			console.warn(
				`Actor [${document.id}] | Unable to parse active effect change for ${change.key}: "${change.value}"`,
			);
			return undefined;
		}

		// const baseActor = actor as SR6Actor<BaseActorDataModel>;
		//  let actor = actor as SR6Actor<CharacterDataModel> as any;
		// const path = change.key.split(':');

		// Apply the change depending on the application mode
		const modes = CONST.ACTIVE_EFFECT_MODES;
		const changes = {};
		switch (change.mode) {
			case modes.ADD:
				this._applyAdd(document, change, current, delta, changes);
				break;
			case modes.MULTIPLY:
				this._applyMultiply(document, change, current, delta, changes);
				break;
			case modes.OVERRIDE:
				this._applyOverride(document, change, current, delta, changes);
				break;
			case modes.UPGRADE:
			case modes.DOWNGRADE:
				this._applyUpgrade(document, change, current, delta, changes);
				break;
			default: // CUSTOM CASE
			/*
				if (path.length > 1) {
					switch (path[0]) {
						case 'matrixPersona': {
							const persona = (actor as SR6Actor<CharacterDataModel>).systemData.matrixPersona;
							if (persona) {
								const value = parseInt(change.value);
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								if (value > (persona.attributes.base as any)[path[1]]) {
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(persona.attributes.base as any)[path[1]] = value;
								}
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

				 */
		}

		// Apply all changes to the Actor data
		foundry.utils.mergeObject(document, changes);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return changes as any;
	}

	_parseChanges(document: Actor | Item, change: ApplicableChangeData<this>): ApplicableChangeData<this> {
		if (change.value.includes('@')) {
			const uuid = parseUuid(this.origin);
			console.log(this, uuid);
			if (uuid) {
				if (Object.keys(uuid.embedded).length === 0) {
					console.error('TODO');
				} else {
					const item = getItemSync(SR6Item, this.origin as ItemUUID);
					if (item) {
						change.value = item.solveFormula(change.value).toString();
					}
				}
			}

			// change.value = item.solveFormula(change.value, document).toString();
		}

		return change;
	}
}
