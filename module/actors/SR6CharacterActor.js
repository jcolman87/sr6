import { SR6Actor } from "./SR6Actor.js";
import { SR6CONFIG, Enums } from "../config.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";
export class SR6CharacterActor extends SR6Actor {
    get total_nuyen() {
        let total = 0;
        this.items.forEach((i) => {
            if (i.type == "Credstick") {
                total += i.system.nuyen;
            }
        });
        return total;
    }
    prepareData() {
        super.prepareData();
        this.prepareMonitors();
    }
    prepareDerivedData() {
        super.prepareDerivedData();
        this.prepareAttributes();
        this.prepareDerivedAttributes();
        this.prepareSkillPools();
    }
    getData() {
        //if(this.isCharacter) { TODO
        let data = this.system;
        return data;
        //}
    }
    rollWeapon(weapon) {
        showRollWeaponDialog(this, weapon);
    }
    getSkill(ty) {
        let data = this.getData();
        return data.skills[Enums.Skill[ty]];
    }
    calculateSkillPool(skill_use) {
        let skill = this.getSkill(skill_use.skill_use.skill);
        const skill_name = Enums.Skill[skill_use.skill_use.skill];
        const wound_modifier = this.getWoundModifier();
        const pool = this.solveFormula(`(@actor.system.skills.${skill_name}.pool + ${wound_modifier})`);
        return pool;
    }
    getWoundModifier() {
        let physical_modifier = -Math.floor(this.getData().monitors.physical.pool / 3);
        let stun_modifier = -Math.floor(this.getData().monitors.stun.pool / 3);
        return physical_modifier + stun_modifier;
    }
    updateSkill(ty, points, specialization = undefined, expertise = undefined) {
        let data = this.getData();
        let skill = data.skills[Enums.Skill[ty]];
        skill.points = points;
        skill.specialization = specialization;
        skill.expertise = expertise;
        this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
    }
    prepareSkillPools() {
        let skills = this.getData().skills;
        Object.keys(Enums.Skill)
            .filter((v) => isNaN(Number(v)))
            .forEach((key) => {
            let skillEnum = Enums.Skill[key];
            let skillDef = SR6CONFIG.skills.get(skillEnum);
            let calcedPool = this.solveFormula(skillDef.pool);
            let points = skills[key].points;
            let modifier = skills[key].modifier;
            let pool = calcedPool + points + modifier;
            skills[key].pool = pool.toString();
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
    applyCombatAction(action_id) {
        let action = SR6CONFIG.combat_actions.get(action_id);
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
