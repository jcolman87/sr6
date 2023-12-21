import { SkillUse as ConfigSkillUse, Enums } from "../config.js";
import { ActorTypes } from "../actors/Data.js";

export class Formula extends String {}

export class ItemFormula extends Formula {}

export interface ItemBaseData {
	description: string;
	rating: ItemFormula;
}

export interface GearBaseData extends ItemBaseData {
	size: ItemFormula;
	category: {
		type: string;
		subtype: string;
	};
}

export namespace GearTypes {
	export class Condition extends ActorTypes.Attribute {}

	export class Cost {
		cost: ItemFormula = "0";
		availability: ItemFormula = "1";
		illegal: boolean = false;
	}

	export class Capacity {
		capacity: ItemFormula = "0";
	}

	export class Matrix {
		matrix_active: boolean = false;
		matrix_attributes: {
			a: ItemFormula;
			s: ItemFormula;
			d: ItemFormula;
			f: ItemFormula;
		} = {
			a: "0",
			s: "0",
			d: "0",
			f: "0"
		};

		program_slots: ItemFormula = "0";
	}

	export class Defense {
		dr: ItemFormula = "0";
	}

	export class Explosive {
		dv_gz: ItemFormula = "0";
		dv_close: ItemFormula = "0";
		dv_near: ItemFormula = "0";
		blast: ItemFormula = "0";
	}

	export class Weapon {
		attack_ratings: {
			close: ItemFormula;
			near: ItemFormula;
			medium: ItemFormula;
			far: ItemFormula;
			extreme: ItemFormula;
		} = {
			close: "0",
			near: "0",
			medium: "0",
			far: "0",
			extreme: "0"
		};
		damage: ItemFormula = "0";
		damage_type: Enums.DamageType = Enums.DamageType.Physical;
		damage_form: Enums.DamageType = Enums.DamageType.Physical;
	}

	export class Firearm {
		firemodes: Enums.FireMode[] = [Enums.FireMode.SS];
		mount_locations: Enums.WeaponAccessoryLocation[] = [];
	}

	export class Mountable {
		locations: Enums.WeaponAccessoryLocation[] = [];
	}

	export enum Types {
		Base = 0,
		Cost = 1 << 1,
		Capacity = 1 << 2,
		Defense = 1 << 3,
		Matrix = 1 << 4,
		Explosive = 1 << 5,
		Weapon = 1 << 6,
		Firearm = 1 << 7,
		Mountable = 1 << 8,
		SkillUse = 1 << 9,
		Condition = 1 << 10
	}
}

export class GearData implements GearBaseData {
	description: string = "";
	rating: ItemFormula = "1";
	size: ItemFormula = "3";

	types: number = 0;

	category: {
		type: string;
		subtype: string;
	} = {
		type: "",
		subtype: ""
	};
}

export namespace Spell {
	export interface Spell {
		description: string;
		drain: number;
		range: {
			type: Enums.SpellRangeType;
			value: number;
		},
		duration: {
			type: Enums.SpellDurationType;
			value: number;
		};
	}
}

export class MatrixPersona implements ItemBaseData {
	description: string = "";
	rating: ItemFormula = "1";
}
