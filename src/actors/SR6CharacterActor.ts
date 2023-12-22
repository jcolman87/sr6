import { SR6Actor } from "./SR6Actor.js";
import { SR6CONFIG, Enums, CombatActionDef, SkillUse } from "../config.js";
import * as Rolls from "../rolls/Rolls.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { SR6Spell } from "../items/SR6Spell.js";
import { GearTypes } from "../items/Data.js";
import { CharacterActorData, ActorTypes } from "./Data.js";

import { SR6RollDialog } from "../dialogs/SR6RollDialog.js";
import { SR6WeaponRollDialog } from "../dialogs/SR6WeaponRollDialog.js";
import { SR6MatrixRollDialog } from "../dialogs/SR6MatrixRollDialog.js";
import { SR6SpellRollDialog } from "../dialogs/SR6SpellRollDialog.js";

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

	get skills(): ActorTypes.Skills {
		return this.getData().skills;
	}

	get attributes(): ActorTypes.Attributes {
		return this.getData().attributes;
	}

	get wound_modifier(): number {
		let physical_modifier = -Math.floor(this.getData().monitors.physical.pool / 3);
		let stun_modifier = -Math.floor(this.getData().monitors.stun.pool / 3);

		return physical_modifier + stun_modifier;
	}

	get jacked_in(): boolean {
		if(this.matrix_persona) {
			return this.matrix_persona.active;
		}

		return false;
	}

	get matrix_persona(): null | ActorTypes.MatrixPersona {
		return this.getData().matrix.persona;
	}

	override prepareData() {
		super.prepareData();

		this.prepareMonitors();

		this.prepareMatrixPersona();
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		this.prepareAttributes();
		this.prepareDerivedAttributes();
		this.prepareSkillPools();

		this.prepareInitiatives();
	}

	prepareMatrixPersona() {
		if(this.matrix_persona != null && this.matrix_persona!.active) {
			if(this.matrix_persona.device != null) {
				let device: SR6Gear = this.items.get(this.matrix_persona.device) as SR6Gear;
				if(device == undefined) {
					this.deactivateMatrix();
				} else {
					let attributes = {
							a: device.solveFormulaWithActor(this, device!.matrix!.matrix_attributes.a),
							s: device.solveFormulaWithActor(this, device!.matrix!.matrix_attributes.s),
							d: device.solveFormulaWithActor(this, device!.matrix!.matrix_attributes.d),
							f: device.solveFormulaWithActor(this, device!.matrix!.matrix_attributes.f),
						};
					let persona = {
						device: device.id,
						base_attributes: attributes,
						attributes: attributes,
						vr_type: Enums.VRType.AR
					};

					this.update({
						["system.matrix.persona"]: persona,
					});
				}
			}
		} else {
			if(this.matrix_persona) {
				this.matrix_persona.active = false;
			}
		}
	}


	activateMatrix(device: null | SR6Gear = null): boolean {
		if(this.getData().magic.type == Enums.MagicType.Technomancer) {
			let living_attributes = {
				a: this.getAttribute(Enums.Attribute.charisma).pool,
				s: this.getAttribute(Enums.Attribute.intuition).pool,
				d: this.getAttribute(Enums.Attribute.logic).pool,
				f: this.getAttribute(Enums.Attribute.willpower).pool,
			};
			let persona = {
				active: true,
				device: null,
				base_attributes: living_attributes,
				attributes: living_attributes,
				vr_type: Enums.VRType.Cold
			};

			this.update({
				["system.matrix.persona"]: persona,
			});
		} else {
			// Are there any active devices? If not, error.
			let activeMatrixItems = this.items.filter((i) => {
				let item = (i as SR6Gear);
				if(item.type != "Gear") {
					return false;
				}
				return item.has(GearTypes.Types.Matrix) && item.matrix!.matrix_active;
			});
			if(activeMatrixItems.length < 1) {
				ui.notifications!.warn("No active matrix item to jack in to!");
				return false; 
			}

			let device = (activeMatrixItems[0] as SR6Gear);
			let persona = {
				active: true,
				device: device.id
			};

			this.update({
				["system.matrix.persona"]: persona,
			});
		}

		return true;
	}

	deactivateMatrix() {
		this.update({["system.matrix.persona"]: {active: false}});
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
		new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: skill, specialization: undefined }),
			"Roll Skill",
			(game as Game).i18n.localize(`skill.${Enums.Skill[skill]}.name`)).render(true);
	}
	rollSpecialization(special: Enums.Specialization) {
		new SR6RollDialog(Rolls.SR6SkillRoll.make, new Rolls.SR6SkillRollData(this, { skill: SR6CONFIG.getSkillOfSpecialization(special), specialization: special }),
			"Roll Skill",
			(game as Game).i18n.localize(`specialization.${Enums.Specialization[special]}.name`)).render(true);
	}

	rollAttribute(attribute: Enums.Attribute) {
		new SR6RollDialog(Rolls.SR6AttributeRoll.make, new Rolls.SR6AttributeRollData(this, attribute),
			"Roll Attribute",
			Enums.Attribute[attribute]).render(true);
	}

	rollMatrixAction(action: Enums.MatrixAction) {
		if(!this.jacked_in) {
			ui.notifications!.warn("You cannot perform a matrix action because you're not jacked in!");
			return;
		}
		new SR6MatrixRollDialog(this, action).render(true);
	}

	rollSpell(spell: SR6Spell) {
		new SR6SpellRollDialog(this, spell).render(true);
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
