import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
export default interface IHasMatrix {
	get matrixPersona(): null | MatrixPersonaDataModel;
}
