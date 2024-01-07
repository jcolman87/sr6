import { IHasActor } from '@/data/IHasActor';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';

export default interface IHasMatrixPersona extends IHasActor {
	get matrixPersona(): null | MatrixPersonaDataModel;
	set matrixPersona(persona: null | MatrixPersonaDataModel);

	activateMatrixPersona(device: SR6Item<GearDataModel> | null): Promise<SR6Item<MatrixPersonaDataModel>>;
	deactivateMatrixPersona(): Promise<boolean>;
}
