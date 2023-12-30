import { EnumAttribute } from '@/actor/data';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Actor from '@/actor/SR6Actor';
import { SR6Roll, SR6RollData } from '@/roll/SR6Roll';
import { RollType, ROLL_TEMPLATES } from '@/roll';
import { Distance, FireMode, InitiativeType } from '@/data';
import RollPrompt from '@/app/RollPrompt';

import IHasPools from '@/data/IHasPools';
import IHasMatrix from '@/data/IHasMatrix';
import IHasInitiative from '@/data/IHasInitiative';

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import * as util from '@/util';

export const BUGFIX = '';

export type attackData = {
	attackerId: string;
	itemId: string;
	damage: number;
	attackRating: number;

	distance: Distance;
	firemode: null | FireMode;
};

export interface AttributeRollData extends SR6RollData {
	attribute: EnumAttribute;
}

export interface SkillRollData extends SR6RollData {
	skill_id: string;
}

export interface WeaponAttackRollData extends SR6RollData {
	attack: attackData;
}

export interface WeaponDefendRollData extends SR6RollData {
	previous: WeaponAttackRollData;
	attack: attackData;
}

export interface WeaponSoakRollData extends SR6RollData {
	previous: WeaponDefendRollData;
	attack: attackData;
}

export interface MatrixActionRollData extends SR6RollData {
	matrixActionId: string;
}

export function getInitiativeRoll(actor: SR6Actor<IHasInitiative>, formula: string): SR6Roll {
	return new SR6Roll(formula, { ...actor.getRollData(), actor: actor }, { ...SR6Roll.defaultOptions(), template: ROLL_TEMPLATES.get(RollType.Initiative)! });
}

export async function rollAttribute(actor: SR6Actor<LifeformDataModel>, attribute: EnumAttribute) {
	let pool = actor.systemData.attribute(attribute).pool;
	let rollData = await RollPrompt.promptForRoll<AttributeRollData>(actor, { ...SR6Roll.defaultOptions(), pool: pool, template: ROLL_TEMPLATES.get(RollType.Attribute)!, type: RollType.Attribute, attribute: attribute });
	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollSkill(actor: SR6Actor, skill_id: string) {
	let pool = actor.skill(skill_id)!.systemData.pool;
	let rollData = await RollPrompt.promptForRoll<SkillRollData>(actor, { ...SR6Roll.defaultOptions(), pool: pool, template: ROLL_TEMPLATES.get(RollType.Attribute)!, type: RollType.Skill, skill_id: skill_id });
	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

/*
 Weapon Rolls


 */
export async function rollWeaponAttack(actor: SR6Actor, weapon: SR6Item<WeaponDataModel>) {
	let rollType = RollType.WeaponAttack;

	let pool = weapon.systemData.pool + actor.systemData.getPool(rollType);

	let attackData = {
		targetTokenIds: util.getTargetTokenIds(),
		attackerId: util.getTokenOrActorId(actor),
		itemId: weapon.id,
		damage: weapon.systemData.damage,
		attackRating: weapon.systemData.attackRatings.near,
		firemode: weapon.systemData.firemodes ? FireMode.SS : null,
		distance: weapon.systemData.firemodes ? Distance.Close : Distance.Near,
	};

	let rollData = await RollPrompt.promptForRoll<WeaponAttackRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attackData,
	});
	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), item: weapon, actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollWeaponDefend(actor: SR6Actor<IHasPools>, hits: number, previous: WeaponAttackRollData) {
	let rollType = RollType.WeaponDefend;

	let pool = actor.systemData.getPool(rollType);
	let attack = { ...previous.attack, damage: (previous.attack.damage += hits) };

	let rollData = await RollPrompt.promptForRoll<WeaponDefendRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: hits,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollWeaponSoak(actor: SR6Actor<LifeformDataModel>, hits: number, previous: WeaponDefendRollData) {
	let rollType = RollType.WeaponSoak;

	let pool = actor.systemData.getPool(rollType);
	let attack = { ...previous.attack, damage: previous.attack.damage - hits };

	let rollData = await RollPrompt.promptForRoll<WeaponSoakRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: previous.attack.damage,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

//
// Matrix Actions
//
export async function rollMatrixAction(actor: SR6Actor<IHasMatrix>, action: SR6Item<MatrixActionDataModel>) {
	let pool = action.systemData.pool;

	let rollData = await RollPrompt.promptForRoll<MatrixActionRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(RollType.MatrixAction)!,
		type: RollType.MatrixAction,
		matrixActionId: action.id,
	});

	if (rollData) {
		let roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}
