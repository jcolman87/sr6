import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class AdeptPowerDataModel extends BaseItemDataModel {
	static override defineSchema() {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
		};
	}
}
