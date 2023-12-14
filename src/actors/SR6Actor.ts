import { SR6CONFIG, Enums } from "../config.js";
import { SR6Roll, BaseRollData, WeaponRollData } from "../SR6Roll.js";
import { SR6Item } from "../items/SR6Item.js";
import { CharacterActorData, ActorTypes } from "./Data.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";

import * as util from "../util.js";

export class SR6Actor extends Actor {
	override prepareData() {
		super.prepareData();

		let data: CharacterActorData = this.getData();

		prepareMonitors(this, data);
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		let data: CharacterActorData = this.getData();
		prepareAttributes(this, data);
		prepareDerivedAttributes(this, data);
		prepareSkillPools(this, data);
	}

	getData(): CharacterActorData {
		let data: CharacterActorData = (this as any).system;
		return data;
	}

	solveFormula(formula: string): number {
		let roll = new SR6Roll(formula, { actor: this });
		roll.evaluate({ async: false });

		return roll.total!;
	}

	rollFormula(formula: string) {
		let pool = this.solveFormula(formula);
		let roll = new SR6Roll(pool + "d6", { actor: this });

		roll.evaluate({ async: false });

		roll.toMessage(roll, {
			rollMode: "gmroll"
		});
	}

	async rollWeapon(weapon: SR6Item) {
		showRollWeaponDialog(this, weapon);
	}

	getSkill(ty: Enums.Skill): ActorTypes.Skill {
		let data = this.getData();
		return (data.skills as any)[Enums.Skill[ty]];
	}

	updateSkill(ty: Enums.Skill, points: number, specialization: undefined | Enums.Specialization = undefined, expertise: undefined | Enums.Specialization = undefined) {
		let data = this.getData();
		let skill = (data.skills as any)[Enums.Skill[ty]];
		skill.points = points;
		skill.specialization = specialization;
		skill.expertise = expertise;
		this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
	}
}

function prepareSkillPools(actor: SR6Actor, data: CharacterActorData) {
	let skills = data.skills;

	Object.keys(Enums.Skill)
		.filter((v) => isNaN(Number(v)))
		.forEach((key: string) => {
			let skillEnum: Enums.Skill = Enums.Skill[key as keyof typeof Enums.Skill];
			let skillDef = SR6CONFIG.skills.get(skillEnum)!;
			//TODO
			let pool: number = actor.solveFormula(skillDef.pool) + (skills as any)[key].points;

			(skills as any)[key].pool = pool.toString();
		});
	actor.update({ ["system.skills"]: skills });
}

function prepareMonitors(actor: SR6Actor, data: CharacterActorData) {
	prepareMonitor(actor, data.monitors.physical);
	prepareMonitor(actor, data.monitors.overflow);
	prepareMonitor(actor, data.monitors.stun);

	prepareMonitor(actor, data.monitors.edge);
}
function prepareDerivedAttributes(actor: SR6Actor, data: CharacterActorData) {
	prepareAttribute(actor, data.derived_attributes.composure);
	prepareAttribute(actor, data.derived_attributes.judge_intentions);
	prepareAttribute(actor, data.derived_attributes.memory);
	prepareAttribute(actor, data.derived_attributes.lift_carry);
	prepareAttribute(actor, data.derived_attributes.movement);
	prepareAttribute(actor, data.derived_attributes.matrix_perception);
}

function prepareAttributes(actor: SR6Actor, data: CharacterActorData) {
	prepareAttribute(actor, data.attributes.body);
	prepareAttribute(actor, data.attributes.agility);
	prepareAttribute(actor, data.attributes.reaction);
	prepareAttribute(actor, data.attributes.strength);
	prepareAttribute(actor, data.attributes.willpower);
	prepareAttribute(actor, data.attributes.logic);
	prepareAttribute(actor, data.attributes.intuition);
	prepareAttribute(actor, data.attributes.charisma);
}

function prepareAttribute(actor: SR6Actor, attr: ActorTypes.Attribute) {
	let formulaSolution: number = 0;
	if (attr.formula) {
		formulaSolution = actor.solveFormula(attr.formula);
	}
	attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
}

function prepareMonitor(actor: SR6Actor, attr: ActorTypes.Attribute) {
	let formulaSolution: number = 0;
	if (attr.formula) {
		formulaSolution = actor.solveFormula(attr.formula);
	}
	attr.base = attr.base + attr.modifier + attr.augment + formulaSolution;
}
