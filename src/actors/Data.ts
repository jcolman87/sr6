import { Enums } from "../config.js";

export class Formula extends String {}

export namespace ActorTypes {
	export class Attribute {
		base: number = 0;
		modifier: number = 0;
		formula: undefined | string = undefined;
		augment: number = 0;

		pool: number = 0;
	}

	export class Skill {
		points: number = 0;
		pool: number = 0;
		specialization: undefined | Enums.Specialization;
		expertise: undefined | Enums.Specialization;
	}

	export class Monitors {
		physical: Attribute = new Attribute();
		overflow: Attribute = new Attribute();
		stun: Attribute = new Attribute();
		edge: Attribute = new Attribute();
	}

	export class DerivedAttributes {
		composure: Attribute = new Attribute();
		judge_intentions: Attribute = new Attribute();
		memory: Attribute = new Attribute();
		lift_carry: Attribute = new Attribute();
		movement: Attribute = new Attribute();
		matrix_perception: Attribute = new Attribute();
	}

	export interface MatrixAttributes {
		a: Formula;
		s: Formula;
		d: Formula;
		f: Formula;
	}

	export interface Matrix {
		current_device: undefined | string;
		base_attributes: MatrixAttributes;
		current_attributes: MatrixAttributes;
		monitor: Attribute;
	}

	export class Attributes {
		body: Attribute = new Attribute();
		agility: Attribute = new Attribute();
		reaction: Attribute = new Attribute();
		strength: Attribute = new Attribute();
		willpower: Attribute = new Attribute();
		logic: Attribute = new Attribute();
		intuition: Attribute = new Attribute();
		charisma: Attribute = new Attribute();
		edge: Attribute = new Attribute();
		magic: Attribute = new Attribute();
		resonance: Attribute = new Attribute();
		essense: Attribute = new Attribute();
	}

	export class Skills {
		astral: Skill = new Skill();
		athletics: Skill = new Skill();
		biotech: Skill = new Skill();
		close_combat: Skill = new Skill();
		con: Skill = new Skill();
		conjuring: Skill = new Skill();
		cracking: Skill = new Skill();
		electronics: Skill = new Skill();
		enchanting: Skill = new Skill();
		engineering: Skill = new Skill();
		exotic_weapons: Skill = new Skill();
		firearms: Skill = new Skill();
		influence: Skill = new Skill();
		outdoors: Skill = new Skill();
		perception: Skill = new Skill();
		piloting: Skill = new Skill();
		sorcery: Skill = new Skill();
		stealth: Skill = new Skill();
		tasking: Skill = new Skill();
	}
}

export class CharacterActorData {
	monitors: ActorTypes.Monitors = new ActorTypes.Monitors();
	attributes: ActorTypes.Attributes = new ActorTypes.Attributes();
	derived_attributes: ActorTypes.DerivedAttributes = new ActorTypes.DerivedAttributes();
	skills: ActorTypes.Skills = new ActorTypes.Skills();
}
