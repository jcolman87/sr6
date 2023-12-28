/**
 *
 * @author jaynus
 * @file Basic data model
 */

import BaseItemDataModel from '@/item/data/BaseItemDataModel';

export default abstract class SkillDataModel extends BaseItemDataModel {
	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			rating: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0 }),
		};
	}
}
