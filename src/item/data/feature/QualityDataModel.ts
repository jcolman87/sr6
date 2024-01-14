import { IHasOnDelete, IHasPostCreate } from '@/data/interfaces';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';

export default abstract class QualityDataModel
	extends BaseItemDataModel
	implements IHasPostCreate, IHasOnDelete<SR6Item<QualityDataModel>>
{
	async onPostCreate(): Promise<void> {}

	onDelete(
		document: SR6Item<QualityDataModel>,
		options: DocumentModificationContext<SR6Item<QualityDataModel>>,
		userId: string,
	): void {}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
		};
	}
}
