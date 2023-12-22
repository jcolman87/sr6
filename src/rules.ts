import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6CharacterActor } from "./actors/SR6CharacterActor.js";
import { SR6Gear } from "./items/SR6Gear.js";
import { SR6Spell } from "./items/SR6Spell.js";
import * as Rolls from "./rolls/Rolls.js";

import { SR6CONFIG, EffectChangeData, EffectChangeMode, Enums, SkillUse } from "./config.js";

export function getGlobalPoolModifier(actor: SR6Actor): number {
	return +actor.wound_modifier+ +actor.getData().effect_modifiers.global_pool;
}


export namespace EdgeBoosts {
	export namespace buy_auto_hit {
		export async function prepareData(roll: Rolls.SR6RollData) {
			roll.auto_hits = 1;
		}
		export async function apply(roll: Rolls.SR6Roll) {
			return prepareData(roll.data);
		}
	}

	export namespace plus_1_roll {
		export async function apply(roll: Rolls.SR6Roll) {
			await roll.addOne();
		}
	}

	export namespace reroll_one {
		export async function apply(roll: Rolls.SR6Roll) {
			await roll.rerollOne();
		}
	}

	export namespace add_edge_pool {
		export async function prepareData(roll: Rolls.SR6RollData) {
			roll.pool += roll.actor!.getAttribute(Enums.Attribute.edge).pool;
			roll.explode = true;
		}
		export async function apply(roll: Rolls.SR6Roll) {
			console.log("Rules::EdgeBoosts::apply::apply");
		}
	}

	export namespace reroll_failed {
		export async function apply(roll: Rolls.SR6Roll) {
			await roll.rerollFailed();
		}
	}
}

export namespace Magic {
	export function calcSpellAttackPool(actor: SR6Actor, spell: SR6Spell, apply_modifiers: boolean = true) : number {
		let special: number = 0;
		if(actor.getSkill(Enums.Skill.sorcery).specialization == Enums.Specialization.spellcasting) {
			special = 2;
		} else if(actor.getSkill(Enums.Skill.sorcery).expertise == Enums.Specialization.spellcasting) {
			special = 3;
		}
		return +special + +actor.getSkill(Enums.Skill.sorcery).pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
	}
	export function calcSpellDrainPool(actor: SR6Actor, spell: SR6Spell, apply_modifiers: boolean = true) : number {
		// TODO: school of magic
		return +actor.getAttribute(Enums.Attribute.logic).pool + +actor.getAttribute(Enums.Attribute.willpower).pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
	}
	export function calcSpellDefensePool(actor: SR6Actor, spell: SR6Spell, apply_modifiers: boolean = true) : number {
		if(spell.damage == null) {
			return 0;
		}

		let damage: number = 0;
		switch(spell.damage.combat) {
			case Enums.SpellCombatType.Direct: {
				damage = (actor.getAttribute(Enums.Attribute.willpower).pool + actor.getAttribute(Enums.Attribute.intuition).pool);
				break;
			}
			case Enums.SpellCombatType.Indirect: {
				damage = (actor.getAttribute(Enums.Attribute.reaction).pool + actor.getAttribute(Enums.Attribute.willpower).pool);
				break;
			}
		}

		return +damage + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
	}

	export function calcSpellStartingDamage(actor: SR6Actor, spell: SR6Spell) : number {
		if(spell.damage == null) {
			return 0;
		}

		switch(spell.damage.combat) {
			case Enums.SpellCombatType.Direct: {
				return 0;
				break;
			}
			case Enums.SpellCombatType.Indirect: {
				return Math.ceil(actor.getAttribute(Enums.Attribute.magic).pool / 2);
				break;
			}
		}

		return 0;
	}
}


export function calcMatrixDefensePool(actor: SR6Actor, matrix_action: Enums.MatrixAction, apply_modifiers: boolean = true): number {
	let action = SR6CONFIG.matrix_actions.get(matrix_action)!;
	let pool: number = actor.solveFormula(action.defendAgainstFormula!);

	return +pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}


export function calcWeaponPool(actor: SR6Actor, item: SR6Gear): number {
	let skill_use = item.skill_use;

	if (!skill_use) return 0;

	let pool = calcSkillPool(actor, skill_use);
	pool += +actor.getData().effect_modifiers.attack_pool;

	return pool;
}

export function calcWeaponDamage(actor: SR6Actor, weapon: SR6Gear, apply_modifiers: boolean = true): number {
	let modifiers: number = 0;
	if (apply_modifiers) {
		modifiers += +actor.getData().effect_modifiers.damage;
	}

	return +weapon.damage + +modifiers;
}

export function calcDefensePool(actor: SR6Actor, apply_modifiers: boolean = true): number {
	let reaction = actor.getAttribute(Enums.Attribute.reaction);
	let intuition = actor.getAttribute(Enums.Attribute.intuition);

	let modifiers: number = 0;
	if (apply_modifiers) {
		modifiers += getGlobalPoolModifier(actor);
		modifiers += +actor.getData().effect_modifiers.defense;
	}

	return +reaction.pool + +intuition.pool + +modifiers;
}

export function calcSoakPool(actor: SR6Actor, apply_modifiers: boolean = true): number {
	let body = actor.getAttribute(Enums.Attribute.body);

	return +body.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}

export function getFiremodeModifiers(firemode: Enums.FireMode): EffectChangeData[] {
	switch (firemode) {
		case Enums.FireMode.SS:
			return [];
		case Enums.FireMode.SA:
			return [
				{ key: "damage", mode: EffectChangeMode.ADD, value: "1" },
				{ key: "attack_rating", mode: EffectChangeMode.ADD, value: "-2" }
			];
		case Enums.FireMode.BF_narrow:
			return [
				{ key: "damage", mode: EffectChangeMode.ADD, value: "2" },
				{ key: "attack_rating", mode: EffectChangeMode.ADD, value: "-4" }
			];
		case Enums.FireMode.FA:
			return [{ key: "attack_rating", mode: EffectChangeMode.ADD, value: "-6" }];
	}

	return [];
}

export function calcSkillPool(actor: SR6Actor, skill_use: SkillUse, apply_modifiers: boolean = true): number {
	let modifiers: number = 0;
	let skill = actor.getSkill(skill_use.skill!);

	if (skill_use.specialization) {
		if (skill.specialization == skill_use.specialization) {
			modifiers = 2;
		} else if (skill.expertise == skill_use.specialization) {
			modifiers = 3;
		}
	}

	return +skill.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}

export function calcAttributePool(actor: SR6Actor, attr_id: Enums.Attribute, apply_modifiers: boolean = true): number {
	let modifiers: number = 0;

	let attribute = actor.getAttribute(attr_id);

	return +attribute.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}
