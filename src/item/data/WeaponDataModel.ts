/**
 *
 * @author jaynus
 * @file Player Character
 */

import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { SkillUseDataModel } from '@/data/SharedDataModels';

export default abstract class CharacterDataModel extends BaseItemDataModel {
	abstract balls: number;

	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			skillUse: new fields.EmbeddedDataField(SkillUseDataModel, { required: true, nullable: false }),
		};
	}
}
