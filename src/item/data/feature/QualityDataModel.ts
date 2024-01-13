import SR6Actor from '@/actor/SR6Actor';
import { ActivationMode } from '@/data';
import { IHasOnDelete } from '@/data/interfaces';
import { IHasPostCreate } from '@/data/interfaces';
import ConditionDataModel from '@/condition/ConditionDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';

export type AppliedConditionEntry = {
	idx: number;
	itemId: string;
};

export default abstract class QualityDataModel
	extends BaseItemDataModel
	implements IHasOnDelete<SR6Item<QualityDataModel>>, IHasPostCreate
{
	abstract activation: ActivationMode;
	abstract conditions: ConditionDataModel[];

	abstract appliedConditions: AppliedConditionEntry[];

	async clearAppliedConditions(): Promise<void> {
		for (const entry of this.appliedConditions) {
			await this.actor!.items.get(entry.itemId)!.delete();
		}
		this.appliedConditions = [];
	}

	async applyToActor(actor: SR6Actor): Promise<void> {
		const item = (
			await actor.createEmbeddedDocuments('Item', [
				{
					name: this.item!.name,
					type: 'quality',
					system: this,
				},
			])
		)[0] as SR6Item<typeof this>;

		await item.systemData.applyConditions();
	}

	async applyConditions(): Promise<void> {
		if (!this.actor || !this.item) {
			ui.notifications.error('Failed to apply conditions of quality');
			return;
		}

		for (let idx = 0; idx < this.conditions.length; idx++) {
			const condition = this.conditions[idx];
			const conditionItem = await condition.applyToActor(this.actor!);
			this.appliedConditions.push({
				idx: idx,
				itemId: conditionItem.id,
			});
		}

		// let quality = (await getCoreQualities()).find((c) => c.name == 'Built Tough I'); await quality.applyToActor(canvas.tokens.controlled[0].actor);
		await this.item!.update({ ['system.appliedConditions']: this.appliedConditions });
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			activation: new fields.StringField({
				initial: ActivationMode.Always,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ActivationMode),
			}),
			conditions: new fields.ArrayField(new fields.EmbeddedDataField(ConditionDataModel), {
				initial: [],
				required: true,
				nullable: false,
			}),
			appliedConditions: new fields.ArrayField(
				new fields.SchemaField({
					idx: new fields.NumberField({ required: true, nullable: false, integer: true, min: 0 }),
					itemId: new fields.DocumentIdField({ required: true, nullable: false }),
				}),
				{
					initial: [],
					required: true,
					nullable: false,
				},
			),
		};
	}

	async onPostCreate(): Promise<void> {
		await this.applyConditions();
	}

	onDelete(
		_document: SR6Item<QualityDataModel>,
		_options: DocumentModificationContext<SR6Item<QualityDataModel>>,
		_userId: string,
	): void {
		// Clear our conditions before deletion
		// TODO: make this async?
		void this.clearAppliedConditions();
	}
}
