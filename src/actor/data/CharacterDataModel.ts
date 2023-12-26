/**
  *
 * @author jaynus
 * @file Player Character
 */

import SR6Actor from '@/actor/SR6Actor';
import IHasPreCreate from '@/data/IHasPreCreate';

export enum Attribute {
	body,
	agility,
	reaction,
	strength,
	willpower,
	logic,
	intuition,
	charisma,
	magic,
	resonance,
	essense,
	edge
}

export enum Specialization {
	astral_combat,
	astral_signatures,
	spirit_types,
	climbing,
	escaping,
	flying,
	emotional_states,
	gymnastics,
	sprinting,
	swimming,
	throwing,
	archery,
	biotechnology,
	cybertechnology,
	first_aid,
	medicine,
	blades,
	clubs,
	unarmed,
	acting,
	disguise,
	impersonation,
	performance,
	banishing,
	summoning,
	cybercombat,
	electronic_warfare,
	hacking,
	computer,
	hardware,
	software,
	complex_forms,
	alchemy,
	artificing,
	disenchanting,
	aeronautics_mechanic,
	armorer,
	automotive_mechanic,
	demolitions,
	gunnery,
	industrial_mechanic,
	lockpicking,
	nautical_mechanic,
	tasers,
	holdouts,
	pistols_light,
	pistols_heavy,
	machine_pistols,
	submachine_guns,
	rifles,
	shotguns,
	assault_cannons,
	etiquette,
	instruction,
	intimidation,
	leadership,
	negotiation,
	navigation,
	survival,
	tracking_woods,
	tracking_desert,
	tracking_urban,
	tracking_other,
	visual,
	aural,
	tactile,
	scent,
	taste,
	perception_woods,
	perception_desert,
	perception_urban,
	perception_other,
	ground_craft,
	aircraft,
	watercraft,
	counterspelling,
	ritual_spellcasting,
	spellcasting,
	palming,
	sneaking,
	camouflage,
	compiling,
	decompiling,
	registering
}

export enum Skill {
	astral,
	athletics,
	biotech,
	close_combat,
	con,
	conjuring,
	cracking,
	electronics,
	enchanting,
	engineering,
	exotic_weapons,
	firearms,
	influence,
	outdoors,
	perception,
	piloting,
	sorcery,
	stealth,
	tasking
}

class SkillDataModel extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	declare points: number;
	//declare pool: number;
	//declare modifier: number;

	//declare specialization: Specialization;
	//declare expertise: Specialization;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			points: new fields.NumberField({ initial: 2, required: true, nullable: false, integer: true, min: 0, max: 9 })
		};
	}
}

export default class CharacterDataModel extends foundry.abstract.DataModel implements IHasPreCreate<SR6Actor<CharacterDataModel>> {
	static _enableV10Validation = true;

	declare soak: number;

	async preCreate(actor: SR6Actor<this>, _data: PreDocumentId<any>, _options: DocumentModificationContext<SR6Actor<CharacterDataModel>>, _user: User) {

	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			soak: new fields.NumberField({ integer: true, initial: 0 }),

			skills: new fields.SchemaField({
				astral: new fields.EmbeddedDataField(SkillDataModel, { initial: new SkillDataModel as any, required: true  })
			}),
		};
	}
}
