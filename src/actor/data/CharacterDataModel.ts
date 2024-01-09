/**
 *
 * @author jaynus
 * @file Player Character
 */

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { MonitorType, WoundModifierData } from '@/actor/data/MonitorsDataModel';
import { IHasMatrixPersona } from '@/data/interfaces';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';
import { getCoreSkills, getCoreMatrixActions, getCoreGeneralActions } from '@/item/data';

export default abstract class CharacterDataModel extends LifeformDataModel implements IHasMatrixPersona {
	abstract karma: number;

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
	get matrixPersona(): null | MatrixPersonaDataModel {
		return this._matrixPersona;
	}

	set matrixPersona(persona: null | MatrixPersonaDataModel) {
		this._matrixPersona = persona;
	}

	async activateMatrixPersona(
		device: SR6Item<GearDataModel> | null = null
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
		return {
			...super.getRollData(),
			persona: this.matrixPersona ? this.matrixPersona.getRollData() : null,
		};
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
		};
	}
}
