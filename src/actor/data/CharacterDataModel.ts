/**
  *
 * @author jaynus
 * @file Player Character
 */

import LifeformDataModel from "@/actor/data/LifeformDataModel";
import SR6Actor from '@/actor/SR6Actor';
import IHasPreCreate from '@/data/IHasPreCreate';

export default class CharacterDataModel extends LifeformDataModel implements IHasPreCreate<SR6Actor<CharacterDataModel>> {
	declare balls: number;

	static override defineSchema() {
		const fields = foundry.data.fields;

		return foundry.utils.mergeObject(super.defineSchema(), {
			balls: new fields.NumberField({ integer: true, initial: 0 })
		});
	}

	async preCreate(actor: SR6Actor<this>, _data: PreDocumentId<any>, _options: DocumentModificationContext<SR6Actor<CharacterDataModel>>, _user: User) {

	}
}
