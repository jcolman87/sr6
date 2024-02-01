import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class KnowledgeDataModel extends BaseItemDataModel {
	static override defineSchema(): foundry.data.fields.DataSchema {
		return {
			...super.defineSchema(),
		};
	}
}
