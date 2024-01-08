import { EnumAttribute } from '@/actor/data';
import { MAGIC_TRADITION_ATTRIBUTE } from '@/data/magic';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SpellDataModel, { SpellAdjustmentType } from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Actor from '@/actor/SR6Actor';
import { SR6Roll, SR6RollData } from '@/roll/SR6Roll';
import { RollType, ROLL_TEMPLATES } from '@/roll';
import { Distance, FireMode, InitiativeType } from '@/data';
import RollPrompt from '@/app/RollPrompt';

import IHasPools from '@/data/IHasPools';
import IHasMatrixPersona from '@/data/IHasMatrixPersona';
import IHasInitiative from '@/data/IHasInitiative';

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { getItemSync, getTargetActorIds } from '@/util';
import * as util from '@/util';

export const BUGFIX = '';

export type BaseAttackData = {
	attackerId: ActorUUID;
	targetIds: ActorUUID[];
	itemId: ItemUUID;
	damage: number;
	attackRating: number;
};

export type WeaponAttackData = {
	distance: Distance;
	firemode: null | FireMode;
} & BaseAttackData;

export type MatrixAttackData = {} & BaseAttackData;

export type SpellAttackData = {} & BaseAttackData;

export interface AttributeRollData extends SR6RollData {
	attribute: EnumAttribute;
}

export interface SkillRollData extends SR6RollData {
	skillId: string;
}

export interface WeaponAttackRollData extends SR6RollData {
	attack: WeaponAttackData;
}

export interface WeaponDefendRollData extends SR6RollData {
	previous: WeaponAttackRollData;
	attack: WeaponAttackData;
}

export interface WeaponSoakRollData extends SR6RollData {
	previous: WeaponDefendRollData;
	attack: WeaponAttackData;
}

export interface MatrixActionRollData extends SR6RollData {
	attack: MatrixAttackData;
}

export interface MatrixDefenseRollData extends SR6RollData {
	previous: MatrixActionRollData;
	attack: MatrixAttackData;
}

export interface SpellCastRollData extends SR6RollData {
	attack: SpellAttackData;
	adjustments: SpellAdjustmentType[];
	drain: number;
}

export function getInitiativeRoll(systemData: IHasInitiative, formula: string): SR6Roll {
	const poolModifier = systemData.getPool(RollType.Initiative);
	return new SR6Roll(
		`(${formula}) + ${poolModifier}`,
		{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
		{ ...SR6Roll.defaultOptions(), template: ROLL_TEMPLATES.get(RollType.Initiative)! }
	);
}

export async function rollAttribute(actor: SR6Actor<LifeformDataModel>, attribute: EnumAttribute): Promise<void> {
	const rollType = RollType.Attribute;
	const pool = actor.systemData.attribute(attribute).pool + actor.systemData.getPool(rollType);

	const rollData = await RollPrompt.promptForRoll<AttributeRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attribute: attribute,
	});
	if (rollData) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollSkill(actor: SR6Actor, skillId: string, special: string | null = null): Promise<void> {
	const rollType = RollType.Skill;
	const pool = actor.skill(skillId)!.systemData.getPool(special) + actor.systemData.getPool(rollType);

	const rollData = await RollPrompt.promptForRoll<SkillRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		skillId: skillId,
	});
	if (rollData) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

/*
 Weapon Rolls


 */
export async function rollWeaponAttack(systemData: IHasPools, weapon: SR6Item<WeaponDataModel>): Promise<void> {
	const rollType = RollType.WeaponAttack;

	const pool = weapon.systemData.pool + systemData.actor!.systemData.getPool(rollType);

	const attackData = {
		attackerId: systemData.actor!.uuid,
		targetIds: getTargetActorIds(),
		itemId: weapon.uuid,
		damage: weapon.systemData.damage,
		attackRating: weapon.systemData.attackRatings.near,
		firemode: weapon.systemData.firemodes ? FireMode.SS : null,
		distance: weapon.systemData.firemodes ? Distance.Close : Distance.Near,
	};

	const rollData = await RollPrompt.promptForRoll<WeaponAttackRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attackData,
	});
	if (rollData) {
		const roll = new SR6Roll(
			`${rollData.pool}d6`,
			{ ...systemData.actor!.getRollData(), item: weapon, actor: systemData.actor! },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			rollData as any
		);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollWeaponDefend(
	systemData: IHasPools,
	hits: number,
	previous: WeaponAttackRollData
): Promise<void> {
	const rollType = RollType.WeaponDefend;

	const pool = systemData.actor!.systemData.getPool(rollType);
	const attack = { ...previous.attack, damage: (previous.attack.damage += hits) };

	const rollData = await RollPrompt.promptForRoll<WeaponDefendRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: hits,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		const roll = new SR6Roll(
			`${rollData.pool}d6`,
			{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			rollData as any
		);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollWeaponSoak(
	systemData: IHasPools,
	hits: number,
	previous: WeaponDefendRollData
): Promise<void> {
	const rollType = RollType.WeaponSoak;

	const pool = systemData.actor!.systemData.getPool(rollType);
	const attack = { ...previous.attack, damage: previous.attack.damage - hits };

	const rollData = await RollPrompt.promptForRoll<WeaponSoakRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: previous.attack.damage,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		const roll = new SR6Roll(
			`${rollData.pool}d6`,
			{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			rollData as any
		);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

//
// Matrix Actions
//
export async function rollMatrixAction(
	systemData: IHasMatrixPersona,
	action: SR6Item<MatrixActionDataModel>
): Promise<void> {
	if (!systemData.matrixPersona) {
		ui.notifications.error('You cannot roll a matrix action without activating your persona');
		return;
	}

	const rollType = RollType.MatrixAction;

	const pool = systemData.actor!.systemData.getPool(rollType) + action.systemData.pool;

	const attackData = {
		attackerId: systemData.actor!.uuid,
		targetIds: getTargetActorIds(),
		itemId: action.uuid,
		attackRating: systemData.matrixPersona!.attackRating,
		damage: action.systemData.damage,
	};

	const rollData = await RollPrompt.promptForRoll<MatrixActionRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attackData,
	});

	if (rollData) {
		const roll = new SR6Roll(
			`${rollData.pool}d6`,
			{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			rollData as any
		);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

export async function rollMatrixDefense(
	systemData: IHasMatrixPersona,
	hits: number,
	previous: MatrixActionRollData
): Promise<void> {
	const rollType = RollType.MatrixActionDefend;

	const action = getItemSync(SR6Item<MatrixActionDataModel>, previous.attack.itemId)!;
	const defendPool = action.systemData.defendAgainstPool(systemData.actor!);

	const pool = systemData.actor!.systemData.getPool(rollType) + defendPool;
	const attack = { ...previous.attack, damage: (previous.attack.damage += hits) };

	const rollData = await RollPrompt.promptForRoll<MatrixDefenseRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: hits,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		const roll = new SR6Roll(
			`${rollData.pool}d6`,
			{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			rollData as any
		);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}

//
// Magic
//
export async function rollSpellCast<TDataModel extends LifeformDataModel = LifeformDataModel>(
	actor: SR6Actor<TDataModel>,
	spell: SR6Item<SpellDataModel>
): Promise<void> {
	const rollType = RollType.SpellCast;
	const pool = spell.systemData.pool;

	console.log(
		'formula',
		actor.systemData.magicTradition,
		`@magic + @${MAGIC_TRADITION_ATTRIBUTE[actor.systemData.magicTradition]}`
	);

	const attackData = {
		attackerId: actor.uuid,
		targetIds: getTargetActorIds(),
		itemId: spell.uuid,
		attackRating: actor.solveFormula(`@magic + @${MAGIC_TRADITION_ATTRIBUTE[actor.systemData.magicTradition]}`),
		damage: spell.systemData.baseDamage,
	};

	const rollData = await RollPrompt.promptForRoll<SpellCastRollData>(actor, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attackData,
		adjustments: [],
		drain: spell.systemData.drain,
	});

	if (rollData) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const roll = new SR6Roll(`${rollData.pool}d6`, { ...actor.getRollData(), actor: actor }, rollData as any);
		await (await roll.evaluate({ async: true })).toMessage();
	}
}
