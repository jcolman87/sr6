/**
 *
 * @author jaynus
 * @file Basic data model
 */

import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';

/**
 * Base data model shared by all Item documents.
 *
 * This class (and all subclasses) should be made abstract to deal with the way Foundry handles populating data for the schema.
 * By marking the class as abstract, TypeScript won't try to define the properties - which means Foundry is free to do as it wishes.
 * In this way, we can safely define the value types (to allow for typed access) on the data model. This works only because we never
 * have reason to instantiate any of the DataModel classes ourselves.
 */
export default abstract class BaseItemDataModel extends BaseDataModel {
	abstract description: string;
	abstract source: string;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			description: new fields.HTMLField(),
			source: new fields.StringField(),
		};
	}
}
