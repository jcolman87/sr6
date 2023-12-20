import { SR6Actor } from "./SR6Actor.js";
import { SR6CONFIG, Enums } from "../config.js";
import * as Rolls from "../rolls/Rolls.js";
import { SR6RollDialog } from "../dialogs/SR6RollDialog.js";
import { SR6WeaponRollDialog } from "../dialogs/SR6WeaponRollDialog.js";
import { SR6MatrixRollDialog } from "../dialogs/SR6MatrixRollDialog.js";
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
    get wound_modifier() {
        let physical_modifier = -Math.floor(this.getData().monitors.physical.pool / 3);
        let stun_modifier = -Math.floor(this.getData().monitors.stun.pool / 3);
        return physical_modifier + stun_modifier;
    }
    get matrix_persona() {
        return this.getData().matrix.persona;
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
        this.prepareInitiatives();
    }
    getData() {
        //if(this.isCharacter) { TODO
        let data = this.system;
        return data;
        //}
    }
    rollWeapon(weapon) {
        new SR6WeaponRollDialog(this, weapon).render(true);
    }
    rollSkill(skill) {
        new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: skill, specialization: undefined })).render(true);
    }
    rollSpecialization(special) {
        new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: SR6CONFIG.getSkillOfSpecialization(special), specialization: special })).render(true);
    }
    rollAttribute(attribute) {
        new SR6RollDialog(Rolls.SR6AttributeRoll.make, new Rolls.SR6AttributeRollData(this, attribute)).render(true);
    }
    rollMatrixAction(action) {
        new SR6MatrixRollDialog(this, action).render(true);
    }
    getSkill(ty) {
        return this.getData().skills[Enums.Skill[ty]];
    }
    getSpecializationSkill(ty) {
        return this.getData().skills[SR6CONFIG.getSkillOfSpecialization(ty)];
    }
    getAttribute(ty) {
        let data = this.getData();
        return data.attributes[Enums.Attribute[ty]];
    }
    ////
    applyDamage(value, type) {
        let monitors = this.getData().monitors;
        switch (type) {
            case Enums.DamageType.Physical: {
                // If it overflows, dump it in overflow
                monitors.physical.pool += value;
                if (monitors.physical.pool > monitors.physical.base) {
                    // Overflow damage
                    monitors.overflow.pool += monitors.physical.pool - monitors.physical.base;
                    monitors.physical.pool = monitors.physical.base;
                }
                this.update({ ["system.monitors"]: monitors });
                break;
            }
            case Enums.DamageType.Stun: {
                monitors.stun.pool += value;
                if (monitors.stun.pool > monitors.stun.base) {
                    // Overflow damage
                    // Recursively apply physical damage if we are overflowing
                    this.applyDamage(monitors.stun.pool - monitors.stun.base, Enums.DamageType.Physical);
                    monitors.stun.pool = monitors.stun.base;
                }
                break;
            }
            case Enums.DamageType.Matrix: {
                ui.notifications.error("Matrix damage unsupported");
            }
            case Enums.DamageType.Astral: {
                ui.notifications.error("Astral damage unsupported");
            }
        }
    }
    healDamage(value, type) {
        ui.notifications.error("Healing isnt implemented");
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
    updateSkill(ty, points, specialization = undefined, expertise = undefined) {
        let data = this.getData();
        let skill = data.skills[Enums.Skill[ty]];
        skill.points = points;
        skill.specialization = specialization;
        skill.expertise = expertise;
        this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
    }
    //////
    prepareAttribute(attr) {
        let formulaSolution = 0;
        if (attr.formula) {
            formulaSolution = this.solveFormula(attr.formula);
        }
        attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
    }
    prepareMonitor(attr) {
        let formulaSolution = 0;
        if (attr.formula) {
            formulaSolution = Math.ceil(this.solveFormula(attr.formula));
        }
        attr.base = attr.modifier + attr.augment + formulaSolution;
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
        this.prepareMonitor(monitors.edge);
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
        this.prepareAttribute(attributes.edge);
        this.prepareAttribute(attributes.resonance);
        this.prepareAttribute(attributes.magic);
        this.prepareAttribute(attributes.essense);
    }
    prepareInitiatives() {
        this.initiatives.actions.minor = 1 + this.initiatives.die.physical;
    }
}
