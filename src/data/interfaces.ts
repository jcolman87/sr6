import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';
import { InitiativeType } from '@/data/index';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';
import { RollType } from '@/roll';

export type AvailableActions = {
	major: number;
	minor: number;
};

export interface IHasActor {
	get actor(): SR6Actor | null;
}

export interface IHasSystemData<T extends BaseDataModel = BaseDataModel> {
	getSystemData?(): T;
}

export interface IHasPools extends IHasActor {
	getPool(type: RollType): number;
	get defenseRating(): number;
}

export interface IHasInitiative extends IHasActor, IHasPools {
	getInitiativeFormula(type: InitiativeType): null | string;

	getAvailableActions(type: InitiativeType): AvailableActions;
}

export interface IHasEdge {
	gainEdge?(count: number): boolean;
	spendEdge?(count: number): boolean;
}

export interface IHasMatrixPersona extends IHasActor {
	get matrixPersona(): null | MatrixPersonaDataModel;
	set matrixPersona(persona: null | MatrixPersonaDataModel);

	activateMatrixPersona(device: SR6Item<GearDataModel> | null): Promise<SR6Item<MatrixPersonaDataModel>>;
	deactivateMatrixPersona(): Promise<boolean>;
}

/* Utility Interfaces */

export interface IHasPreCreate<TDocumentType extends foundry.abstract.Document> {
	preCreate?(
		document: TDocumentType,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: PreDocumentId<any>,
		options: DocumentModificationContext<TDocumentType>,
		user: foundry.documents.BaseUser,
	): Promise<void>;
}

export interface IHasPostCreate {
	onPostCreate?(): Promise<void>;
}

export interface IHasOnDelete<DocumentType extends foundry.abstract.Document> {
	onDelete?(document: DocumentType, options: DocumentModificationContext<DocumentType>, userId: string): void;
}

export interface IHasOnUpdate<TDocumentType extends foundry.abstract.Document> {
	onUpdate?(
		changed: DeepPartial<TDocumentType['_source']>,
		options: DocumentUpdateContext<TDocumentType>,
		userId: string,
	): Promise<void>;
}
