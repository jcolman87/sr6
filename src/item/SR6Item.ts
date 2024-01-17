/**
 *
 * @author jaynus
 * @file Base SR6 Item
 */
import BaseDataModel from '@/data/BaseDataModel';
import {
	IHasOnUpdate,
	IHasPostCreate,
	IHasSystemData,
	IHasPreCreate,
	IHasModifiers,
	IHasOnDelete,
} from '@/data/interfaces';
import { Modifiers, ModifiersData } from '@/modifier';
import { SR6Roll } from '@/roll/SR6Roll';
import * as util from '@/util';
import SR6Actor from '@/actor/SR6Actor';

export interface SR6ItemFlags {
	modifiers?: ModifiersData;
}

/**
 * Item class used as a base for all SR6 items.
 */
export default class SR6Item<ItemDataModel extends BaseDataModel = BaseDataModel>
	extends Item<SR6Actor>
	implements IHasSystemData, IHasModifiers
{
	modifiers: Modifiers<SR6Item<ItemDataModel>> = new Modifiers(this);

	get systemFlags(): undefined | SR6ItemFlags {
		return this.flags['sr6'] as SR6ItemFlags;
	}

	get safe_name(): string {
		return util.toSnakeCase(this.name);
	}

	getSystemData(): BaseDataModel {
		return this.systemData;
	}

	/**
	 * Specialized property for accessing `item.system` in a typed manner.
	 */
	get systemData(): ItemDataModel {
		return <ItemDataModel>this.system;
	}

	solveFormula(formula: string, actor: SR6Actor | null = null, data: Record<string, unknown> = {}): number {
		const finalData = {
			...this.getRollData(),
			...actor?.getRollData(),
			...data,
			item: this.getRollData(),
			actor: actor,
		};

		const roll = new SR6Roll(formula, finalData, SR6Roll.defaultOptions());

		return roll.evaluate({ async: false }).total;
	}

	override prepareEmbeddedDocuments(): void {
		super.prepareEmbeddedDocuments();
		this.systemData.prepareEmbeddedDocuments();
	}

	override prepareBaseData(): void {
		super.prepareBaseData();
		this.systemData.prepareBaseData();
	}

	override prepareData(): void {
		super.prepareData();
		this.systemData.prepareData();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.systemData.prepareDerivedData();
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			...this.systemData.getRollData(),
		};
	}

	/**
	 * Override the _preCreate callback to call preCreate from the data model class, if present.
	 * @inheritDoc
	 */
	protected override async _preCreate(
		data: PreDocumentId<this['_source']>,
		options: DocumentModificationContext<this>,
		user: foundry.documents.BaseUser,
	): Promise<void> {
		await (<IHasPreCreate<this>>this.systemData).preCreate?.(this, data, options, user);
		return super._preCreate(data, options, user);
	}

	protected override _onDelete(options: DocumentModificationContext<this>, userId: string): void {
		(<IHasOnDelete<this>>this.systemData).onDelete?.(this, options, userId);

		super._onDelete(options, userId);
	}

	async _onPostCreate(): Promise<void> {
		await (<IHasPostCreate>this.systemData).onPostCreate?.();
	}

	override async _onUpdate(
		changed: DeepPartial<this['_source']>,
		options: DocumentUpdateContext<this>,
		userId: string,
	): Promise<void> {
		await (<IHasOnUpdate<this>>this.systemData).onUpdate?.(changed, options, userId);
		super._onUpdate(changed, options, userId);

		if (changed.flags?.sr6?.modifiers) {
			this.modifiers.updateSource(this.systemFlags!.modifiers!);
		}
	}

	/**
	 * Override the createDialog callback to include an unique class that identifies the created dialog.
	 * @inheritDoc
	 */
	static override createDialog(
		data?: { folder?: string | undefined } | undefined,
		options?: Partial<FormApplicationOptions> | undefined,
	): Promise<ClientDocument<foundry.documents.BaseItem> | undefined> {
		// The 'dialog' class needs to be added explicitly, otherwise it won't be added by the super call.
		const touchedOptions = {
			...options,
			classes: [...(options?.classes ?? []), 'dialog', 'dialog-item-create'],
		};

		return super.createDialog(data, touchedOptions);
	}
}
