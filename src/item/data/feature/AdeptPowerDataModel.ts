import { ActivationType } from '@/data';
import QualityDataModel from '@/item/data/feature/QualityDataModel';

export default abstract class AdeptPowerDataModel extends QualityDataModel {
	abstract level: number;
	abstract powerCost: number;
	abstract activationType: ActivationType;

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			level: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: true,
				min: 1,
				max: 6,
			}),
			powerCost: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: false,
				min: 0,
				max: 6,
			}),
			activationType: new fields.StringField({
				initial: ActivationType.Passive,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ActivationType),
			}),
		};
	}
}
