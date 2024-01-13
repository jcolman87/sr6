import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class ComplexFormDataModel extends BaseItemDataModel {
	static override defineSchema(): foundry.data.fields.DataSchema {
		return {
			...super.defineSchema(),
		};
	}
}
