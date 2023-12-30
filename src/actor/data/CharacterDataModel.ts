/**
 *
 * @author jaynus
 * @file Player Character
 */

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import IHasMatrix from '@/data/IHasMatrix';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Actor from '@/actor/SR6Actor';
import { getCoreSkills, getCoreMatrixActions, getCoreGeneralActions } from '@/item/data';

export default abstract class CharacterDataModel extends LifeformDataModel implements IHasMatrix {
	abstract balls: number;

	get matrixPersona(): null | MatrixPersonaDataModel {
		let persona = this.actor!.items.find((i) => i.type == 'matrix_persona')! as SR6Item<MatrixPersonaDataModel>;
		return persona ? persona.systemData : null;
	}

	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			balls: new fields.NumberField({ integer: true, initial: 0 }),
		};
	}

	override async onPostCreate(actor: SR6Actor<LifeformDataModel>, controlled: boolean) {
		await super.onPostCreate(actor, controlled);
		// Only add base skills if none were adding such as an import
		//if (!this.actor!.items.find((i) => i.type == 'skill')) {
		//	await this.actor!.createEmbeddedDocuments('Item', await getCoreSkills());
		//} else {
		//	
		//}
	}

	override getRollData() {
		return super.getRollData();
	}

	async _addCoreSkills() {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreSkills());
	}

	async _addCoreMatrixActions() {
		// Only add base skills if none were adding such as an import
		await this.actor!.createEmbeddedDocuments('Item', await getCoreMatrixActions());
	}
}
