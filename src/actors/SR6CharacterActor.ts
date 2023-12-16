import { SR6Actor } from "./SR6Actor.js"
import { SR6CONFIG, Enums } from "../config.js";
import { SR6Roll, BaseRollData, WeaponRollData } from "../SR6Roll.js";
import { SR6Item } from "../items/SR6Item.js";
import { ItemTypes } from "../items/Data.js";
import { CharacterActorData, ActorTypes } from "./Data.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";

import * as util from "../util.js";

export class SR6CharacterActor extends SR6Actor {
	get isCharacter() {
		return this.type == "Player" || this.type == "NPC";
	}
	get isMatrix() {
		return this.type == "MatrixIC" || this.type == "MatrixHost";
	}

	override prepareData() {
		super.prepareData();
		console.log("SR6CharacterActor::prepareData");

		if(this.isCharacter) {
			let data: CharacterActorData = this.getData();
			prepareCharacterMonitors(this, data);
		} else if(this.isMatrix) {
			//prepareMonitor(this, (this as any).system.monitors.matrix);
		}
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		console.log("SR6CharacterActor::prepareDerivedData");

		if(this.isCharacter) {
			let data: CharacterActorData = this.getData();
			prepareAttributes(this, data);
			prepareDerivedAttributes(this, data);
			prepareSkillPools(this, data);

			// Check matrix item usage
		} else if(this.isMatrix) {
			// Set matrix derived shit from host
		}
	}

	getData(): CharacterActorData {
		//if(this.isCharacter) { TODO
			let data: CharacterActorData = (this as any).system;
			return data;
		//}
	}

	async rollWeapon(weapon: SR6Item) {
		showRollWeaponDialog(this, weapon);
	}

	getSkill(ty: Enums.Skill): ActorTypes.Skill {
		let data = this.getData();
		return (data.skills as any)[Enums.Skill[ty]];
	}

	calculateSkillPool(skill_use: ItemTypes.SkillUse): number  {
		let skill = this.getSkill(skill_use.skill_use.skill);
		const skill_name: string = Enums.Skill[skill_use.skill_use.skill];
		const wound_modifier: number = this.getWoundModifier();

		const pool: number = this.solveFormula(`(@actor.system.skills.${skill_name}.pool + ${wound_modifier})`);

		return pool;
	}

	getWoundModifier(): number {
		let physical_modifier = -Math.floor(this.getData().monitors.physical.pool / 3);
		let stun_modifier = -Math.floor(this.getData().monitors.stun.pool / 3);
		
		return physical_modifier + stun_modifier;
	}

	updateSkill(ty: Enums.Skill, points: number, specialization: undefined | Enums.Specialization = undefined, expertise: undefined | Enums.Specialization = undefined) {
		let data = this.getData();
		let skill = (data.skills as any)[Enums.Skill[ty]];
		skill.points = points;
		skill.specialization = specialization;
		skill.expertise = expertise;
		this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
	}

	get total_nuyen(): number {
		let total: number = 0;
		this.items.forEach((i) => {
			if(i.type == "Credstick") {
				total += (i as any).system.nuyen;
			}
		});

		return total;
	}
}

function prepareSkillPools(actor: SR6CharacterActor, data: CharacterActorData) {
	let skills = data.skills;

	Object.keys(Enums.Skill)
		.filter((v) => isNaN(Number(v)))
		.forEach((key: string) => {
			let skillEnum: Enums.Skill = Enums.Skill[key as keyof typeof Enums.Skill];
			let skillDef = SR6CONFIG.skills.get(skillEnum)!;
			let calcedPool: number = actor.solveFormula(skillDef.pool);
			let points: number = (skills as any)[key].points;
			let modifier: number = (skills as any)[key].modifier
			
			let pool: number = calcedPool + points + modifier;

			(skills as any)[key].pool = pool.toString();
		});
}

function prepareCharacterMonitors(actor: SR6CharacterActor, data: CharacterActorData) {
	prepareMonitor(actor, data.monitors.physical);
	prepareMonitor(actor, data.monitors.overflow);
	prepareMonitor(actor, data.monitors.stun);
}
function prepareDerivedAttributes(actor: SR6CharacterActor, data: CharacterActorData) {
	prepareAttribute(actor, data.derived_attributes.composure);
	prepareAttribute(actor, data.derived_attributes.judge_intentions);
	prepareAttribute(actor, data.derived_attributes.memory);
	prepareAttribute(actor, data.derived_attributes.lift_carry);
	prepareAttribute(actor, data.derived_attributes.movement);
	prepareAttribute(actor, data.derived_attributes.matrix_perception);
}

function prepareAttributes(actor: SR6CharacterActor, data: CharacterActorData) {
	prepareAttribute(actor, data.attributes.body);
	prepareAttribute(actor, data.attributes.agility);
	prepareAttribute(actor, data.attributes.reaction);
	prepareAttribute(actor, data.attributes.strength);
	prepareAttribute(actor, data.attributes.willpower);
	prepareAttribute(actor, data.attributes.logic);
	prepareAttribute(actor, data.attributes.intuition);
	prepareAttribute(actor, data.attributes.charisma);
}

function prepareAttribute(actor: SR6CharacterActor, attr: ActorTypes.Attribute) {
	let formulaSolution: number = 0;
	if (attr.formula) {
		formulaSolution = actor.solveFormula(attr.formula);
	}
	attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
}

function prepareMonitor(actor: SR6CharacterActor, attr: ActorTypes.Attribute) {
	let formulaSolution: number = 0;
	if (attr.formula) {
		formulaSolution = Math.ceil(actor.solveFormula(attr.formula));
	}
	
	attr.base = attr.modifier + attr.augment + formulaSolution;
}
