/**
 *
 * @author jaynus
 * @file Provides typing data for RootContext injected into Vue apps.
 */

import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6ItemSheet from '@/item/SR6ItemSheet';
import SR6ActorSheet from '@/actor/SR6ActorSheet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContextBase = { [key: string]: any };

/**
 * This symbol is used by Vue apps in the system to inject sheet data.
 */
export const RootContext = Symbol('Vue Root Context');

/**
 * Typing for context data injected into Vue sheets.
 */
export interface BaseSheetContext<
	DocumentType extends foundry.abstract.Document = foundry.abstract.Document,
	SheetOptionsType extends DocumentSheetOptions = DocumentSheetOptions,
	SheetType extends DocumentSheet<DocumentType, SheetOptionsType> = DocumentSheet<DocumentType, SheetOptionsType>,
	SheetDataType extends DocumentSheetData<DocumentType> = DocumentSheetData<DocumentType>
> extends ContextBase {
	/**
	 * A reference to the Sheet instance the vue app is rendering.
	 */
	sheet: SheetType;

	/**
	 * Rendering context data retrieved from `getData()`.
	 */
	data: SheetDataType;
}

export interface SR6ActorSheetData<
	ActorDataModel extends foundry.abstract.DataModel = foundry.abstract.DataModel,
	ActorType extends SR6Actor = SR6Actor<ActorDataModel>
> extends ActorSheetData<SR6Actor<ActorDataModel>> {
	actor: ActorType;
}

/**
 * Typing for context data injected into Vue Actor sheets.
 */
export interface ActorSheetContext<
	ActorDataModel extends foundry.abstract.DataModel = foundry.abstract.DataModel,
	ActorType extends SR6Actor = SR6Actor<ActorDataModel>,
	SheetType extends SR6ActorSheet<ActorDataModel> = SR6ActorSheet<ActorDataModel>,
	SheetDataType extends SR6ActorSheetData<ActorDataModel> = SR6ActorSheetData<ActorDataModel, ActorType>
> extends ContextBase {
	/**
	 * A reference to the Sheet instance the vue app is rendering.
	 */
	sheet: SheetType;

	/**
	 * Rendering context data retrieved from `getData()`.
	 */
	data: SheetDataType;

	// Active user
	user: User;
}

export interface SR6ItemSheetData<ItemDataModel extends BaseItemDataModel = BaseItemDataModel>
	extends ItemSheetData<SR6Item<ItemDataModel>> {
	item: SR6Item<ItemDataModel>;
}

/**
 * Typing for context data injected into Vue Item sheets.
 */
export interface ItemSheetContext<
	ItemDataModel extends BaseItemDataModel = BaseItemDataModel,
	SheetType extends SR6ItemSheet<ItemDataModel> = SR6ItemSheet<ItemDataModel>,
	SheetDataType extends SR6ItemSheetData<ItemDataModel> = SR6ItemSheetData<ItemDataModel>
> extends ContextBase {
	/**
	 * A reference to the Sheet instance the vue app is rendering.
	 */
	sheet: SheetType;

	/**
	 * Rendering context data retrieved from `getData()`.
	 */
	data: SheetDataType;
}
