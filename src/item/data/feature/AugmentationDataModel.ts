import { DocumentUUIDField } from '@/data/fields';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';

export default abstract class AugmentationDataModel extends QualityDataModel {
	abstract rating: number;
	abstract quality: number;
	abstract essenseCost: number;

	abstract sourceGearIds: ItemUUID[];
	abstract _attachedGearIds: ItemUUID[];

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			rating: this.rating,
			quality: this.quality,
			essenseCost: this.essenseCost,
		};
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			rating: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: true,
				min: 1,
				max: 6,
			}),
			quality: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: true,
				min: 1,
				max: 6,
			}),
			essenseCost: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: false,
				min: 0,
				max: 6,
			}),

			sourceGearIds: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
			_attachedGearIds: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}
