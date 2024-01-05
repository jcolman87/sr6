import { ActivationPeriod } from '@/data';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class EdgeActionDataModel extends BaseItemDataModel {
	abstract edgeCostFormula: string;
	abstract activationPeriod: ActivationPeriod;

	abstract rollDataScript: string | null;
	abstract finishRollScript: string | null;

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			edgeCostFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			activationPeriod: new fields.StringField({
				initial: ActivationPeriod.Any,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ActivationPeriod),
			}),

			rollDataScript: new fields.StringField({ initial: null, nullable: true, blank: false }),
			finishRollScript: new fields.StringField({ initial: null, nullable: true, blank: false }),
		};
	}
}
