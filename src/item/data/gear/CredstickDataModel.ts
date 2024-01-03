import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { LifestyleRating } from '@/item/data/feature/LifestyleDataModel';

export enum CredstickRating {
	Standard = 1,
	Silver = 2,
	Gold = 3,
	Platinum = 4,
	Ebony = 5,
}

export enum CredstickCapacity {
	Standard = 5000,
	Silver = 20000,
	Gold = 100000,
	Platinum = 500000,
	Ebony = 1000000,
}

export default abstract class CredstickDataModel extends BaseItemDataModel {
	abstract rating: number;
	abstract nuyen: number;

	get capacity(): number {
		return Object.values(CredstickCapacity)[this.rating] as number;
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
				min: CredstickRating.Standard,
				max: CredstickRating.Ebony,
			}),
			nuyen: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
		};
	}
}
