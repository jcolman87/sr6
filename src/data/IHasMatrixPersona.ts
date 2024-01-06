import { IHasActor } from '@/data/IHasActor';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';

export default interface IHasMatrixPersona extends IHasActor {
	get matrixPersona(): null | MatrixPersonaDataModel;
}
