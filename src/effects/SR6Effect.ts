/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';
import { getItemSync } from '@/util';

export enum ModifierType {
	Pool = 'pool',
	BonusEdge = 'bonusEdge',
	BlockEdge = 'blockEdge',
}

export enum EffectType {
	Standard = 'standard',
	Roll = 'roll',
}

export interface RollEffectData {
	rollType: RollType[];
	modifierType: ModifierType;
	value: string;
}

type EffectFlags = {
	sr6?: {
		type: EffectType;
		rollEffect?: RollEffectData;
	};
};

export default class SR6Effect extends ActiveEffect {
	declare flags: EffectFlags;

	get type(): EffectType {
		return this.flags.sr6!.type;
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
		if (!data.flags?.sr6) {
			this.updateSource({ ['flags.sr6']: SR6Effect.defaultFlags() });
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

	override apply(actor: Actor, change: ApplicableChangeData<this>): undefined | ApplicableChangeData<this> {
		return this._apply(actor, change);
	}

	override _applyCustom(
		target: Actor | Item,
		change: ApplicableChangeData<this>,
		current: any,
		delta: any,
		changes: any,
	): void {}

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
			case modes.CUSTOM:
				this._applyCustom(document, change, current, delta, changes);
		}

		// Apply all changes to the Actor data
		foundry.utils.mergeObject(document, changes);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return changes as any;
	}

	_parseChanges(document: Actor | Item, change: ApplicableChangeData<this>): ApplicableChangeData<this> {
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
