import { EnumAttribute } from '@/actor/data';
import SR6Actor from '@/actor/SR6Actor';
import IHasPreCreate from '@/data/IHasPreCreate';
import * as shared from '@/data/SharedDataModels';

/**s
 *
 * @author jaynus
 * @file Player Character
 */

export default abstract class LifeformDataModel extends foundry.abstract.DataModel implements IHasPreCreate<SR6Actor<LifeformDataModel>> {
	static _enableV10Validation = true;

	get actor(): SR6Actor {
		return (this as any).parent;
	}

	abstract attributes: {
		body: shared.AttributeDataModel;
		agility: shared.AttributeDataModel;
		reaction: shared.AttributeDataModel;
		strength: shared.AttributeDataModel;
		willpower: shared.AttributeDataModel;
		logic: shared.AttributeDataModel;
		intuition: shared.AttributeDataModel;
		charisma: shared.AttributeDataModel;
		magic: shared.AttributeDataModel;
		resonance: shared.AttributeDataModel;
	};

	abstract monitors: {
		physical: shared.ConditionMonitorDataModel;
	};

	attribute(id: EnumAttribute): shared.AttributeDataModel {
		switch (id) {
			case EnumAttribute.body:
				return this.attributes.body;
			case EnumAttribute.agility:
				return this.attributes.agility;
			case EnumAttribute.reaction:
				return this.attributes.reaction;
			case EnumAttribute.strength:
				return this.attributes.strength;
			case EnumAttribute.willpower:
				return this.attributes.willpower;
			case EnumAttribute.logic:
				return this.attributes.logic;
			case EnumAttribute.intuition:
				return this.attributes.intuition;
			case EnumAttribute.charisma:
				return this.attributes.charisma;
			case EnumAttribute.magic:
				return this.attributes.magic;
			case EnumAttribute.resonance:
				return this.attributes.resonance;
		}
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			monitors: new fields.SchemaField({
				physical: new fields.EmbeddedDataField(shared.ConditionMonitorDataModel, { initial: { value: 0, max: 0, formula: '8 + ceil(@body / 2)' }, required: true, nullable: false }),
				overflow: new fields.EmbeddedDataField(shared.ConditionMonitorDataModel, { initial: { value: 0, max: 32, formula: null }, required: true, nullable: false }),
			}),
			attributes: new fields.SchemaField({
				body: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				agility: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				reaction: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				strength: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				willpower: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				logic: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				intuition: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				charisma: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				magic: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
				resonance: new fields.EmbeddedDataField(shared.AttributeDataModel, { initial: { base: 2, value: 2, modifier: 0 }, required: true, nullable: false }),
			}),

			//skills: new fields.SchemaField({
			//	astral: new fields.EmbeddedDataField(SkillDataModel, { initial: new SkillDataModel, required: true  })
			//}),
		};
	}

	async preCreate(actor: SR6Actor<this>, _data: PreDocumentId<any>, _options: DocumentModificationContext<SR6Actor<LifeformDataModel>>, _user: User) {}
}
