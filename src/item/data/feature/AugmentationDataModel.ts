import { DocumentUUIDField } from '@/data/fields';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import SR6Item from '@/item/SR6Item';
import { getItem, getItemSync } from '@/util';

export default abstract class AugmentationDataModel extends QualityDataModel {
	abstract rating: number;
	abstract quality: number;
	abstract essenceCost: number;

	abstract sourceGearIds: ItemUUID[];
	abstract _attachedGearIds: ItemUUID[];

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			rating: this.rating,
			quality: this.quality,
			essenceCost: this.essenceCost,
		};
	}

	override async onPostCreate(): Promise<void> {
		await super.onPostCreate();

		for (const gearId of this.sourceGearIds) {
			const item = await getItem(SR6Item, gearId);
			if (!item) {
				ui.notifications.error(`Failed to find proxy item for ${this.item!.name} (${gearId})`);
				return;
			}

			const attachedGear = (await this.actor!.createEmbeddedDocuments('Item', [item])) as SR6Item[];
			this._attachedGearIds.push(attachedGear[0].uuid);
		}
		await this.item!.update({ ['system._attachedGearIds']: this._attachedGearIds });
	}

	override onDelete(
		document: SR6Item<QualityDataModel>,
		options: DocumentModificationContext<SR6Item<QualityDataModel>>,
		userId: string,
	): void {
		super.onDelete(document, options, userId);
		this._attachedGearIds.forEach((uuid) => {
			const item = getItemSync(SR6Item, uuid);
			if (item) {
				void item.delete();
			}
		});
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
				min: 1,
				max: 6,
			}),
			quality: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: true,
				min: 1,
				max: 6,
			}),
			essenceCost: new fields.NumberField({
				initial: 1,
				required: true,
				nullable: false,
				integer: false,
				min: 0,
				max: 6,
			}),

			sourceGearIds: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
			_attachedGearIds: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}
