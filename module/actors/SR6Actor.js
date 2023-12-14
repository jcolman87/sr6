import { SR6CONFIG, Enums } from "../config.js";
import { SR6Roll } from "../SR6Roll.js";
import { showRollWeaponDialog } from "../dialogs/RollWeaponDialog.js";
export class SR6Actor extends Actor {
    prepareData() {
        super.prepareData();
        let data = this.getData();
        prepareMonitors(this, data);
    }
    prepareDerivedData() {
        super.prepareDerivedData();
        let data = this.getData();
        prepareAttributes(this, data);
        prepareDerivedAttributes(this, data);
        prepareSkillPools(this, data);
    }
    getData() {
        let data = this.system;
        return data;
    }
    solveFormula(formula) {
        let roll = new SR6Roll(formula, { actor: this });
        roll.evaluate({ async: false });
        return roll.total;
    }
    rollFormula(formula) {
        let pool = this.solveFormula(formula);
        let roll = new SR6Roll(pool + "d6", { actor: this });
        roll.evaluate({ async: false });
        roll.toMessage(roll, {
            rollMode: "gmroll"
        });
    }
    async rollWeapon(weapon) {
        showRollWeaponDialog(this, weapon);
    }
    getSkill(ty) {
        let data = this.getData();
        return data.skills[Enums.Skill[ty]];
    }
    updateSkill(ty, points, specialization = undefined, expertise = undefined) {
        let data = this.getData();
        let skill = data.skills[Enums.Skill[ty]];
        skill.points = points;
        skill.specialization = specialization;
        skill.expertise = expertise;
        this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
    }
}
function prepareSkillPools(actor, data) {
    let skills = data.skills;
    Object.keys(Enums.Skill)
        .filter((v) => isNaN(Number(v)))
        .forEach((key) => {
        let skillEnum = Enums.Skill[key];
        let skillDef = SR6CONFIG.skills.get(skillEnum);
        //TODO
        let pool = actor.solveFormula(skillDef.pool) + skills[key].points;
        skills[key].pool = pool.toString();
    });
    actor.update({ ["system.skills"]: skills });
}
function prepareMonitors(actor, data) {
    prepareMonitor(actor, data.monitors.physical);
    prepareMonitor(actor, data.monitors.overflow);
    prepareMonitor(actor, data.monitors.stun);
    prepareMonitor(actor, data.monitors.edge);
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
        formulaSolution = actor.solveFormula(attr.formula);
    }
    attr.base = attr.base + attr.modifier + attr.augment + formulaSolution;
}
