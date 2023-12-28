import * as shared from '@/data/SharedDataModels';

/**s
 *
 * @author jaynus
 * @file Player Character
 */

export default abstract class MatrixICDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	abstract rating: number;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			rating: new fields.NumberField({ initial: 0, min: 0, max: 20, nullable: false, required: true }),
		};
	}
}
