import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class AugmentationDataModel extends BaseItemDataModel {
	abstract rating: number;
	abstract quality: number;
	abstract essenseCost: number;

	static override defineSchema() {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 6 }),
			quality: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 6 }),
			essenseCost: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: false, min: 0, max: 6 }),
		};
	}
}
