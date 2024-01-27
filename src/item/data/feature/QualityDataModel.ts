import { IHasPostCreate, IHasPreCreate } from '@/data/interfaces';
import SR6Effect from '@/effect/SR6Effect';
import BaseItemDataModel, { ItemActivationDataModel } from '@/item/data/BaseItemDataModel';
import SR6Item from '@/item/SR6Item';
import { ModifierDataModel } from '@/modifier/ModifierDataModel';

export default abstract class QualityDataModel
	extends BaseItemDataModel
	implements IHasPostCreate, IHasPreCreate<SR6Item<QualityDataModel>>
{
	abstract activation: Maybe<ItemActivationDataModel>;
	abstract modifiers: ModifierDataModel[];

	async toggleActive(): Promise<boolean> {
		if (!this.activation) {
			ui.notification.error('Toggling activation on something that doesnt have it');
			return false;
		}

		const status = !this.activation!.status;
		await this.item!.update({ ['system.activation.status']: status });

		if (status) {
			// activating, switch on our effects
			await this.item!.toggleAllEffects(true);
		} else {
			// deactivating, switch off our effects
			await this.item!.toggleAllEffects(false);
		}

		return this.activation!.status;
	}

	getEffect(): SR6Effect {
		// Either create our effect or find it
		const effect: Maybe<SR6Effect> = this.item!.effects.getName(this.item!.name) as SR6Effect | undefined;
		if (!effect) {
			ui.notifications.error('Wtf we dont have an effect?');
			throw 'error';
		} else {
			console.log('ok now we do?');
			return effect!;
		}
	}

	async createModifiers(): Promise<void> {
		const effect = this.getEffect();
		if (effect) {
			this.modifiers.forEach((modifierDataModel) => {
				const modifier = modifierDataModel.create(effect, this.item!);
				if (modifier.ok) {
					effect.modifiers.all.push(modifier.val);
				}
			});
			await effect.modifiers.save();
		}
	}

	async preCreate(
		document: SR6Item<QualityDataModel>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		_data: PreDocumentId<any>,
		_options: DocumentModificationContext<SR6Item<QualityDataModel>>,
		_user: foundry.documents.BaseUser,
	): Promise<void> {
		const effect: Maybe<SR6Effect> = document.effects.getName(this.item!.name) as SR6Effect | undefined;
		if (!effect) {
			document.updateSource({
				['effects']: [
					{
						name: document.name,
						origin: this.item!.uuid,
						disabled: true,
						transfers: true,
					},
				],
			});
		}
	}

	async onPostCreate(): Promise<void> {
		await this.createModifiers();
	}

	override prepareBaseData(): void {
		this.activation?.prepareBaseData();
	}

	override prepareData(): void {
		this.activation?.prepareData();
	}

	override prepareDerivedData(): void {
		this.activation?.prepareDerivedData();
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			activation: new fields.EmbeddedDataField(ItemActivationDataModel, {
				initial: null,
				required: false,
				nullable: true,
			}),

			modifiers: new fields.ArrayField(new fields.EmbeddedDataField(ModifierDataModel), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}
