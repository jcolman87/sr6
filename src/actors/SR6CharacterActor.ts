import { SR6Actor } from "./SR6Actor.js";
import { SR6CONFIG, Enums, CombatActionDef, SkillUse } from "../config.js";
import * as Rolls from "../rolls/Rolls.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { GearTypes } from "../items/Data.js";
import { CharacterActorData, ActorTypes } from "./Data.js";

import { SR6RollDialog } from "../dialogs/SR6RollDialog.js";
import { SR6WeaponRollDialog } from "../dialogs/SR6WeaponRollDialog.js";
import { SR6MatrixRollDialog } from "../dialogs/SR6MatrixRollDialog.js";

import * as util from "../util.js";

export class SR6CharacterActor extends SR6Actor {
	get total_nuyen(): number {
		let total: number = 0;
		this.items.forEach((i) => {
			if (i.type == "Credstick") {
				total += (i as any).system.nuyen;
			}
		});

		return total;
	}


	get wound_modifier(): number {
		let physical_modifier = -Math.floor(this.getData().monitors.physical.pool / 3);
		let stun_modifier = -Math.floor(this.getData().monitors.stun.pool / 3);

		return physical_modifier + stun_modifier;
	}


	get matrix_persona(): null | ActorTypes.MatrixPersona {
		return this.getData().matrix.persona;
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

		this.prepareInitiatives();
	}

	getData(): CharacterActorData {
		//if(this.isCharacter) { TODO
		let data: CharacterActorData = (this as any).system;
		return data;
		//}
	}

	rollWeapon(weapon: SR6Gear) {
		new SR6WeaponRollDialog(this, weapon).render(true);
	}

	rollSkill(skill: Enums.Skill) {
		new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: skill, specialization: undefined })).render(true);
	}
	rollSpecialization(special: Enums.Specialization) {
		new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: SR6CONFIG.getSkillOfSpecialization(special), specialization: special })).render(true);
	}

	rollAttribute(attribute: Enums.Attribute) {
		new SR6RollDialog(Rolls.SR6AttributeRoll.make, new Rolls.SR6AttributeRollData(this, attribute)).render(true);
	}

	rollMatrixAction(action: Enums.MatrixAction) {
		new SR6MatrixRollDialog(this, action).render(true);
	}

	getSkill(ty: Enums.Skill | Enums.Specialization): ActorTypes.Skill {
		return (this.getData().skills as any)[Enums.Skill[ty]];
	}
	getSpecializationSkill(ty: Enums.Specialization): ActorTypes.Skill {
		return (this.getData().skills as any)[SR6CONFIG.getSkillOfSpecialization(ty)];
	}

	getAttribute(ty: Enums.Attribute): ActorTypes.Attribute {
		let data = this.getData();
		return (data.attributes as any)[Enums.Attribute[ty]];
	}

	////

	applyDamage(value: number, type: Enums.DamageType) {
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
				ui.notifications!.error("Matrix damage unsupported");
			}
			case Enums.DamageType.Astral: {
				ui.notifications!.error("Astral damage unsupported");
			}
		}
	}

	healDamage(value: number, type: Enums.DamageType) {
		ui.notifications!.error("Healing isnt implemented");
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

	updateSkill(ty: Enums.Skill, points: number, specialization: undefined | Enums.Specialization = undefined, expertise: undefined | Enums.Specialization = undefined) {
		let data = this.getData();
		let skill = (data.skills as any)[Enums.Skill[ty]];
		skill.points = points;
		skill.specialization = specialization;
		skill.expertise = expertise;
		this.update({ ["system.skills." + Enums.Skill[ty]]: skill });
	}

	//////

	prepareAttribute(attr: ActorTypes.Attribute) {
		let formulaSolution: number = 0;
		if (attr.formula) {
			formulaSolution = this.solveFormula(attr.formula);
		}
		attr.pool = attr.base + attr.modifier + attr.augment + formulaSolution;
	}

	prepareMonitor(attr: ActorTypes.Attribute) {
		let formulaSolution: number = 0;
		if (attr.formula) {
			formulaSolution = Math.ceil(this.solveFormula(attr.formula));
		}

		attr.base = attr.modifier + attr.augment + formulaSolution;
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
				let modifier: number = (skills as any)[key].modifier;

				let pool: number = calcedPool + points + modifier;

				(skills as any)[key].pool = pool.toString();
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
