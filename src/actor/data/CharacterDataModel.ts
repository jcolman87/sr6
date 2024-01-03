/**
 *
 * @author jaynus
 * @file Player Character
 */

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import IHasMatrix from '@/data/IHasMatrix';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Actor from '@/actor/SR6Actor';
import { getCoreSkills, getCoreMatrixActions, getCoreGeneralActions } from '@/item/data';

export default abstract class CharacterDataModel extends LifeformDataModel implements IHasMatrix {
	abstract balls: number;

	//
	// Matrix Stuff
	//

	get matrixPersona(): null | MatrixPersonaDataModel {
		const persona = this.actor!.items.find((i) => i.type === 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
		return persona ? persona.systemData : null;
	}

	toggleMatrixPersona(model: MatrixPersonaDataModel): boolean {
		if (this.matrixPersona) {
			ui.notifications.error('Cannot activate when a persona already exists');
			return false;
		}

		return true;
	}

	/// /

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			balls: new fields.NumberField({ integer: true, initial: 0 }),
		};
	}

	override async onPostCreate(actor: SR6Actor<LifeformDataModel>, controlled: boolean): Promise<void> {
		return await super.onPostCreate(actor, controlled);
		// Only add base skills if none were adding such as an import
		// if (!this.actor!.items.find((i) => i.type == 'skill')) {
		//	await this.actor!.createEmbeddedDocuments('Item', await getCoreSkills());
		// } else {
		//
		// }
	}

	override getRollData(): Record<string, unknown> {
		return super.getRollData();
	}

	async _addCoreSkills(): Promise<void> {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreSkills());
	}

	async _addCoreMatrixActions(): Promise<void> {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreMatrixActions());
	}
}
