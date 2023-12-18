import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6CharacterActor } from "./actors/SR6CharacterActor.js";
import { SR6Item } from "./items/SR6Item.js";

import { EffectChangeData, EffectChangeMode, Enums, SkillUse } from "./config.js";

export function calcWeaponPool(actor: SR6Actor, item: SR6Item): number {
	let skill_use = item.skill_use;
	
	if(!skill_use) return 0;

	let pool = calcSkillPool(actor, skill_use);
	pool += +actor.getData().effect_modifiers.attack_pool;

	return pool;
}

export function calcWeaponDamage(actor: SR6Actor, weapon: SR6Item, apply_modifiers: boolean = true): number {
	let modifiers: number = 0;
	if(apply_modifiers) {
		modifiers += +actor.getData().effect_modifiers.damage;
	}

	return +weapon.damage + +modifiers;
}

export function calcDefensePool(actor: SR6Actor, apply_modifiers: boolean = true): number {
	let reaction = actor.getAttribute(Enums.Attribute.reaction);
	let intuition = actor.getAttribute(Enums.Attribute.intuition);
	
	let modifiers: number = 0;
	if(apply_modifiers) {
		modifiers += +actor.wound_modifier;
		modifiers += +actor.getData().effect_modifiers.global_pool;
		modifiers += +actor.getData().effect_modifiers.defense;
	}

	return +reaction.pool + +intuition.pool + +modifiers;
}


export function calcSoakPool(actor: SR6Actor, apply_modifiers: boolean = true): number {
	let body = actor.getAttribute(Enums.Attribute.body);
	
	let modifiers: number = 0;
	if(apply_modifiers) {
		modifiers += +actor.wound_modifier;
		modifiers += +actor.getData().effect_modifiers.global_pool;
	}

	return +body.pool + +modifiers;
}

export function getFiremodeModifiers(firemode: Enums.FireMode) : EffectChangeData[] {
	switch(firemode) {
		case Enums.FireMode.SS: return [];
		case Enums.FireMode.SA: return [
			{ key: "damage", mode: EffectChangeMode.ADD, value: "1", },
			{ key: "attack_rating", mode: EffectChangeMode.ADD,value: "-2", }];
		case Enums.FireMode.BF_narrow: return [
			{ key: "damage", mode: EffectChangeMode.ADD, value: "2", },
			{ key: "attack_rating", mode: EffectChangeMode.ADD,value: "-4", }];
		case Enums.FireMode.FA: return [
			{ key: "attack_rating", mode: EffectChangeMode.ADD,value: "-6", }];
	}

	return [];
}


export function calcSkillPool(actor: SR6Actor, skill_use: SkillUse, apply_modifiers: boolean = true): number {
	let modifiers: number = 0;
	let skill = actor.getSkill(skill_use.skill!);

	if(skill_use.specialization) {	
		if(skill.specialization == skill_use.specialization) {
			modifiers = 2;
		} else if(skill.expertise == skill_use.specialization) {
			modifiers = 3;
		}
	}

	if(apply_modifiers) {
		modifiers += +actor.wound_modifier;
		modifiers += +actor.getData().effect_modifiers.global_pool;
	}

	return +skill.pool + +modifiers;
}

export function calcAttributePool(actor: SR6Actor, attr_id: Enums.Attribute, apply_modifiers: boolean = true ) : number {
	let modifiers: number = 0;

	let attribute = actor.getAttribute(attr_id);

	if(apply_modifiers) {
		modifiers += +actor.wound_modifier;
		modifiers += +actor.getData().effect_modifiers.global_pool;
	}

	return +attribute.pool + +modifiers;
}