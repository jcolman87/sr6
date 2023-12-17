import { SR6Actor } from "./SR6Actor.js"
import { SR6CONFIG, Enums, CombatActionDef } from "../config.js";
import { SR6Roll, BaseRollData, WeaponRollData } from "../SR6Roll.js";
import { SR6Item } from "../items/SR6Item.js";
import { ItemTypes } from "../items/Data.js";
import { CharacterActorData, ActorTypes } from "./Data.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";

import * as util from "../util.js";

export class SR6CharacterActor extends SR6Actor {
	get total_nuyen(): number {
		let total: number = 0;
		this.items.forEach((i) => {
			if(i.type == "Credstick") {
				total += (i as any).system.nuyen;
			}
		});

		return total;
	}

	override prepareData() {
		super.prepareData();

		this.prepareMonitors();
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		this.prepareAttributes();
		this.prepareDerivedAttributes();
		this.prepareSkillPools();

	}

	getData(): CharacterActorData {
		//if(this.isCharacter) { TODO
			let data: CharacterActorData = (this as any).system;
			return data;
		//}
	}

	rollWeapon(weapon: SR6Item) {
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

	prepareSkillPools() {
		let skills = this.getData().skills;

		Object.keys(Enums.Skill)
			.filter((v) => isNaN(Number(v)))
			.forEach((key: string) => {
				let skillEnum: Enums.Skill = Enums.Skill[key as keyof typeof Enums.Skill];
				let skillDef = SR6CONFIG.skills.get(skillEnum)!;
				let calcedPool: number = this.solveFormula(skillDef.pool);
				let points: number = (skills as any)[key].points;
				let modifier: number = (skills as any)[key].modifier
				
				let pool: number = calcedPool + points + modifier;

				(skills as any)[key].pool = pool.toString();
			});
	}

	prepareMonitors() {
		let monitors = this.getData().monitors;

		this.prepareMonitor(monitors.physical);
		this.prepareMonitor(monitors.overflow);
		this.prepareMonitor(monitors.stun);
	}
	prepareDerivedAttributes() {
		let derived_attributes = this.getData().derived_attributes;

		this.prepareAttribute(derived_attributes.composure);
		this.prepareAttribute(derived_attributes.judge_intentions);
		this.prepareAttribute(derived_attributes.memory);
		this.prepareAttribute(derived_attributes.lift_carry);
		this.prepareAttribute(derived_attributes.movement);
		this.prepareAttribute(derived_attributes.matrix_perception);
	}

	prepareAttributes() {
		let attributes = this.getData().attributes;

		this.prepareAttribute(attributes.body);
		this.prepareAttribute(attributes.agility);
		this.prepareAttribute(attributes.reaction);
		this.prepareAttribute(attributes.strength);
		this.prepareAttribute(attributes.willpower);
		this.prepareAttribute(attributes.logic);
		this.prepareAttribute(attributes.intuition);
		this.prepareAttribute(attributes.charisma);
	}

	applyCombatAction(action_id: Enums.CombatAction) {
		let action: CombatActionDef = SR6CONFIG.combat_actions.get(action_id)!;

		const activeEffectData = {
			name: Enums.CombatAction[action_id],
			origin: this.id,
			duration: {
				rounds: 1
			},
			changes: action.changes
        };
        console.log("action", action);
	   	console.log("Data", activeEffectData);
		this.createEmbeddedDocuments("ActiveEffect", [activeEffectData]);
	}

}
