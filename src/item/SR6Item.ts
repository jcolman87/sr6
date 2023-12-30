/**
 *
 * @author jaynus
 * @file Base SR6 Item
 */
import { SR6Roll } from '@/roll/SR6Roll';
import * as util from '@/util';
import SR6Actor from '@/actor/SR6Actor';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import IHasPreCreate from '@/data/IHasPreCreate';

/**
 * Item class used as a base for all SR6 items.
 */
export default class SR6Item<ItemDataModel extends foundry.abstract.DataModel = BaseItemDataModel> extends Item<SR6Actor> {
	get safe_name(): string {
		return util.toSnakeCase(this.name);
	}

	/**
	 * Specialized property for accessing `item.system` in a typed manner.
	 */
	get systemData(): ItemDataModel {
		return <ItemDataModel>this.system;
	}

	solveFormula(formula: string, actor: SR6Actor | null = null): number {
		let roll = new SR6Roll(formula, { ...foundry.utils.mergeObject({ ...this.getRollData() }, { ...actor?.getRollData() }), item: this, actor: actor }, SR6Roll.defaultOptions());
		return roll.evaluate({ async: false }).total;
	}

	override prepareData() {
		super.prepareData();
		this.systemData.prepareData();
	}

	override prepareDerivedData() {
		super.prepareDerivedData();
		this.systemData.prepareDerivedData();
	}

	/**
	 * Override the _preCreate callback to call preCreate from the data model class, if present.
	 * @inheritDoc
	 */
	protected override async _preCreate(data: PreDocumentId<this['_source']>, options: DocumentModificationContext<this>, user: foundry.documents.BaseUser) {
		await (<IHasPreCreate<this>>this.systemData).preCreate?.(this, data, options, user);

		return super._preCreate(data, options, user);
	}

	/**
	 * Override the createDialog callback to include an unique class that identifies the created dialog.
	 * @inheritDoc
	 */
	static override createDialog(data?: { folder?: string | undefined } | undefined, options?: Partial<FormApplicationOptions> | undefined): Promise<ClientDocument<foundry.documents.BaseItem> | undefined> {
		// The 'dialog' class needs to be added explicitly, otherwise it won't be added by the super call.
		const touchedOptions = {
			...options,
			classes: [...(options?.classes ?? []), 'dialog', 'dialog-item-create'],
		};

		return super.createDialog(data, touchedOptions);
	}
}
