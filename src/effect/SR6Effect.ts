/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import SR6Actor from '@/actor/SR6Actor';
import { ConditionalData, conditionsCheck } from '@/effect/conditional';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';
import { getItemSync } from '@/util';

export const EFFECT_MODES = {
	POOL_MODIFIER: 900,
	...CONST.ACTIVE_EFFECT_MODES,
};

export enum EffectType {
	Standard = 'standard',
	OnHit = 'onhit',
	OnUse = 'onuse',
}

interface EffectFlags {
	type: EffectType;
	conditions?: ConditionalData[];
}

export default class SR6Effect extends ActiveEffect {
	declare flags: {
		sr6?: EffectFlags;
	};

	failedCondition?: ConditionalData;

	get systemData(): EffectFlags {
		return this.flags.sr6!;
	}

	get isConditional(): boolean {
		return this.systemData.conditions !== undefined;
	}

	get conditions(): ConditionalData[] | undefined {
		return this.systemData.conditions;
	}

	override prepareData(): void {
		super.prepareData();

		if (!this.flags.sr6) {
			return;
		}
		this.failedCondition = undefined;
		if (this.conditions) {
			const origin = fromUuidSync(this.origin) as ClientDocument | null;
			const result = conditionsCheck(origin!, this.parent, this.conditions);
			if (!result.ok) {
				this.failedCondition = result.error;
				this.disabled = true;
			}
		}
	}

	static defaultFlags(): Record<string, unknown> {
		return {
			type: EffectType.Standard,
		};
	}

	protected override _preCreate(
		data: PreDocumentId<this['_source']>,
		options: DocumentModificationContext,
		user: User,
	): Promise<void> {
		if (data.flags?.sr6) {
			this.updateSource({
				['flags.sr6']: foundry.utils.mergeObject(data.flags.sr6, SR6Effect.defaultFlags(), {
					overwrite: false,
				}),
			});
		} else {
			this.updateSource({
				['flags.sr6']: SR6Effect.defaultFlags(),
			});
		}

		return super._preCreate(data, options, user);
	}

	constructor(data: PreCreate<foundry.data.ActiveEffectSource>, context?: DocumentConstructionContext<ActiveEffect>) {
		super(data, context);

		if (context?.parent) {
			const originDescription =
				context?.parent instanceof SR6Item
					? (context?.parent as SR6Item<BaseItemDataModel>).systemData.description
					: '';
			if (!this.description || this.description === '') {
				this.description = originDescription;
			}
		}
	}

	override get isSuppressed(): boolean {
		return this.disabled;
	}

	override apply(actor: SR6Actor, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
		return this._apply(actor, change);
	}

	override _applyCustom(
		_target: SR6Actor | SR6Item,
		_change: ApplicableChangeData<this>,
		_current: Record<string, unknown>,
		_delta: Record<string, unknown>,
		_changes: Record<string, unknown>,
	): void {}

	_applyPoolModifier(
		_target: SR6Actor | SR6Item,
		_change: ApplicableChangeData<this>,
		_current: Record<string, unknown>,
		_delta: Record<string, unknown>,
		_changes: Record<string, unknown>,
	): void {}

	_apply(document: SR6Actor | SR6Item, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
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
		const changes = {};
		switch (change.mode) {
			case EFFECT_MODES.ADD:
				this._applyAdd(document, change, current, delta, changes);
				break;
			case EFFECT_MODES.MULTIPLY:
				this._applyMultiply(document, change, current, delta, changes);
				break;
			case EFFECT_MODES.OVERRIDE:
				this._applyOverride(document, change, current, delta, changes);
				break;
			case EFFECT_MODES.UPGRADE:
			case EFFECT_MODES.DOWNGRADE:
				this._applyUpgrade(document, change, current, delta, changes);
				break;
			case EFFECT_MODES.CUSTOM:
				this._applyCustom(document, change, current, delta, changes);
				break;
			case EFFECT_MODES.POOL_MODIFIER:
				this._applyPoolModifier(document, change, current, delta, changes);
				break;
		}

		// Apply all changes to the Actor data
		foundry.utils.mergeObject(document, changes);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return changes as any;
	}

	_parseChanges(document: SR6Actor | SR6Item, change: ApplicableChangeData<this>): ApplicableChangeData<this> {
		if (change.value.includes('@')) {
			const uuid = parseUuid(this.origin);

			if (uuid) {
				if (Object.keys(uuid.embedded).length === 0) {
					console.error('TODO');
				} else {
					console.log('solve');
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
