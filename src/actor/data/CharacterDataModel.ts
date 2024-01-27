/**
 *
 * @author jaynus
 * @file Player Character
 */

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { MonitorType, WoundModifierData } from '@/actor/data/MonitorsDataModel';
import BaseDataModel from '@/data/BaseDataModel';
import { DocumentUUIDField } from '@/data/fields';
import { IHasMatrixPersona } from '@/data/interfaces';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import WearableDataModel from '@/item/data/gear/WearableDataModel';
import SR6Item from '@/item/SR6Item';
import { getCoreSkills, getCoreMatrixActions, getCoreGeneralActions } from '@/item/data';
import { getItemSync } from '@/util';

export abstract class CharacterEquippedDataModel extends BaseDataModel {
	abstract _weapon: ItemUUID | undefined | null;
	abstract _clothes: ItemUUID | undefined | null;
	abstract _armor: ItemUUID | undefined | null;
	abstract _head: ItemUUID | undefined | null;

	get weapon(): null | SR6Item<WeaponDataModel> {
		return this._weapon ? getItemSync(SR6Item<WeaponDataModel>, this._weapon!) : null;
	}

	set weapon(value: null | SR6Item<GearDataModel>) {
		this._weapon = value?.uuid;
		void this.actor!.update({ ['system.equipped._weapon']: value?.uuid });
	}

	get clothes(): null | SR6Item<WearableDataModel> {
		return this._clothes ? getItemSync(SR6Item<WearableDataModel>, this._clothes!) : null;
	}

	set clothes(value: null | SR6Item<WearableDataModel>) {
		this._clothes = value?.uuid;
		void this.actor!.update({ ['system.equipped._clothes']: value?.uuid });
	}

	get armor(): null | SR6Item<WearableDataModel> {
		return this._armor ? getItemSync(SR6Item<WearableDataModel>, this._armor!) : null;
	}

	set armor(value: null | SR6Item<WearableDataModel>) {
		this._armor = value?.uuid;
		void this.actor!.update({ ['system.equipped._armor']: value?.uuid });
	}

	get head(): null | SR6Item<WearableDataModel> {
		return this._head ? getItemSync(SR6Item<WearableDataModel>, this._head!) : null;
	}

	set head(value: null | SR6Item<WearableDataModel>) {
		this._head = value?.uuid;
		void this.actor!.update({ ['system.equipped._head']: value?.uuid });
	}

	get defenseRating(): number {
		let rating = 0;
		const armor = this.armor;
		const head = this.head;
		const weapon = this.weapon;
		if (armor) {
			rating += armor.systemData.defenseRating;
		}
		if (head) {
			rating += head.systemData.defenseRating;
		}
		if (weapon) {
			rating += weapon.systemData.defenseRating;
		}

		return rating;
	}

	isEquipped(item: SR6Item<GearDataModel>): boolean {
		return (
			item.uuid === this._weapon ||
			item.uuid === this._clothes ||
			item.uuid === this._armor ||
			item.uuid === this._head
		);
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		return {
			_weapon: new DocumentUUIDField({ nullable: true }),
			_clothes: new DocumentUUIDField({ nullable: true }),
			_armor: new DocumentUUIDField({ nullable: true }),
			_head: new DocumentUUIDField({ nullable: true }),
		};
	}
}

export default abstract class CharacterDataModel extends LifeformDataModel implements IHasMatrixPersona {
	abstract karma: number;
	abstract equipped: CharacterEquippedDataModel;

	override get woundModifiers(): WoundModifierData {
		const modifiers = super.woundModifiers;
		if (this.matrixPersona) {
			modifiers[MonitorType.Matrix] = this.matrixPersona.woundModifier;
		}

		return modifiers;
	}

	//
	// IHasMatrixPersona
	//

	async activateMatrixPersona(
		device: SR6Item<GearDataModel> | null = null,
	): Promise<SR6Item<MatrixPersonaDataModel>> {
		return this._activateMatrixPersona(device);
	}

	async deactivateMatrixPersona(): Promise<boolean> {
		const persona = this.actor!.items.find((item) => item.type === 'matrix_persona');
		if (persona) {
			await persona.delete();
			return true;
		}
		return false;
	}

	override getRollData(): Record<string, unknown> {
		if (this.matrixPersona) {
			return {
				...super.getRollData(),
				...this.matrixPersona.getRollData(),
			};
		} else {
			return {
				...super.getRollData(),
				persona: null,
			};
		}
	}

	async _addCoreSkills(): Promise<void> {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreSkills());
	}

	async _addCoreMatrixActions(): Promise<void> {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreMatrixActions());
	}

	async _addCoreGeneralActions(): Promise<void> {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreGeneralActions());
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			karma: new fields.NumberField({ integer: true, required: true, nullable: false, initial: 0 }),
			equipped: new fields.EmbeddedDataField(CharacterEquippedDataModel, { required: true, nullable: false }),
		};
	}
}
