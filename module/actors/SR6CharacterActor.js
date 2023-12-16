import { SR6Actor } from "./SR6Actor.js";
import { SR6CONFIG, Enums } from "../config.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";
export class SR6CharacterActor extends SR6Actor {
    get isCharacter() {
        return this.type == "Player" || this.type == "NPC";
    }
    get isMatrix() {
        return this.type == "MatrixIC" || this.type == "MatrixHost";
    }
    prepareData() {
        super.prepareData();
        console.log("SR6CharacterActor::prepareData");
        if (this.isCharacter) {
            let data = this.getData();
            prepareCharacterMonitors(this, data);
        }
        else if (this.isMatrix) {
            //prepareMonitor(this, (this as any).system.monitors.matrix);
        }
    }
    prepareDerivedData() {
        super.prepareDerivedData();
        console.log("SR6CharacterActor::prepareDerivedData");
        if (this.isCharacter) {
            let data = this.getData();
            prepareAttributes(this, data);
            prepareDerivedAttributes(this, data);
            prepareSkillPools(this, data);
            // Check matrix item usage
        }
        else if (this.isMatrix) {
            // Set matrix derived shit from host
        }
    }
    getData() {
        //if(this.isCharacter) { TODO
        let data = this.system;
        return data;
        //}
    }
    async rollWeapon(weapon) {
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
    get total_nuyen() {
        let total = 0;
        this.items.forEach((i) => {
            if (i.type == "Credstick") {
                total += i.system.nuyen;
            }
        });
        return total;
    }
}
function prepareSkillPools(actor, data) {
    let skills = data.skills;
    Object.keys(Enums.Skill)
        .filter((v) => isNaN(Number(v)))
        .forEach((key) => {
        let skillEnum = Enums.Skill[key];
        let skillDef = SR6CONFIG.skills.get(skillEnum);
        let calcedPool = actor.solveFormula(skillDef.pool);
        let points = skills[key].points;
        let modifier = skills[key].modifier;
        let pool = calcedPool + points + modifier;
        skills[key].pool = pool.toString();
    });
}
function prepareCharacterMonitors(actor, data) {
    prepareMonitor(actor, data.monitors.physical);
    prepareMonitor(actor, data.monitors.overflow);
    prepareMonitor(actor, data.monitors.stun);
}
function prepareDerivedAttributes(actor, data) {
    prepareAttribute(actor, data.derived_attributes.composure);
    prepareAttribute(actor, data.derived_attributes.judge_intentions);
    prepareAttribute(actor, data.derived_attributes.memory);
    prepareAttribute(actor, data.derived_attributes.lift_carry);
    prepareAttribute(actor, data.derived_attributes.movement);
    prepareAttribute(actor, data.derived_attributes.matrix_perception);
}
function prepareAttributes(actor, data) {
    prepareAttribute(actor, data.attributes.body);
    prepareAttribute(actor, data.attributes.agility);
    prepareAttribute(actor, data.attributes.reaction);
    prepareAttribute(actor, data.attributes.strength);
    prepareAttribute(actor, data.attributes.willpower);
    prepareAttribute(actor, data.attributes.logic);
    prepareAttribute(actor, data.attributes.intuition);
    prepareAttribute(actor, data.attributes.charisma);
}
function prepareAttribute(actor, attr) {
    let formulaSolution = 0;
    if (attr.formula) {
        formulaSolution = actor.solveFormula(attr.formula);
    }
    attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
}
function prepareMonitor(actor, attr) {
    let formulaSolution = 0;
    if (attr.formula) {
        formulaSolution = Math.ceil(actor.solveFormula(attr.formula));
    }
    attr.base = attr.modifier + attr.augment + formulaSolution;
}
