import BaseItemDataModel from '@/item/data/BaseItemDataModel';

import { SpellDuration, SpellRangeType, SpellCombatType } from '@/data/magic';

export default abstract class SpellDataModel extends BaseItemDataModel {
	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			drain: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 0, max: 99 }),
			range: new fields.SchemaField(
				{
					type: new fields.StringField({ initial: SpellRangeType.Touch, required: true, nullable: false, blank: false, choices: Object.values(SpellRangeType) }),
					value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
				},
				{ required: true, nullable: false },
			),
			duration: new fields.SchemaField(
				{
					type: new fields.StringField({ initial: SpellDuration.Instantaneous, required: true, nullable: false, blank: false, choices: Object.values(SpellDuration) }),
					value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
				},
				{ required: true, nullable: false },
			),
			damage: new fields.SchemaField(
				{
					combat: new fields.StringField({ initial: SpellCombatType.Direct, required: true, nullable: false, blank: false, choices: Object.values(SpellCombatType) }),
					type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 }),
					form: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 }),
				},
				{ required: true, nullable: true },
			),
		};
	}
}
