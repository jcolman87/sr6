import BaseDataModel from '@/data/BaseDataModel';

/**s
 *
 * @author jaynus
 * @file Player Character
 */

export default abstract class MatrixICDataModel extends BaseDataModel {
	abstract rating: number;

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			rating: new fields.NumberField({ initial: 0, min: 0, max: 20, nullable: false, required: true }),
		};
	}
}
