import { EnumAttribute } from '@/actor/data';
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SpellDataModel, { SpellAdjustmentType } from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';
import SR6Actor from '@/actor/SR6Actor';
import { SR6Roll, SR6RollData } from '@/roll/SR6Roll';
import { RollType, ROLL_TEMPLATES } from '@/roll';
import { Distance, FireMode } from '@/data';
import RollPrompt from '@/app/RollPrompt';

import { IHasPools } from '@/data/interfaces';
import { IHasMatrixPersona } from '@/data/interfaces';
import { IHasInitiative } from '@/data/interfaces';

import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { getActor, getActorSync, getItem, getItemSync, getTargetActorIds } from '@/util';

export const BUGFIX = '';

export enum EdgeGainedTarget {
	None = 0,
	Attacker = 'attacker',
	Defender = 'defender',
}

export type BaseAttackData = {
	attackerId: ActorUUID;
	itemId: ItemUUID;
	targetIds?: ActorUUID[];
	damage?: number;
	attackRating?: number;
	edgeGained?: EdgeGainedTarget;
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

export interface SpellResistDrainRollData extends SR6RollData {
	previous: SpellCastRollData;
	attack: SpellAttackData;
}
export interface SpellDefendRollData extends SR6RollData {
	previous: SpellCastRollData;
	attack: SpellAttackData;
}
export interface SpellSoakRollData extends SR6RollData {
	previous: SpellDefendRollData;
	attack: SpellAttackData;
}

export function createBaseAttackData({
	attackerId,
	itemId,
	targetIds = [],
	damage = 0,
	attackRating = 0,
	edgeGained = EdgeGainedTarget.None,
}: BaseAttackData): BaseAttackData {
	return {
		attackerId: attackerId,
		itemId: itemId,
		targetIds: targetIds,
		damage: damage,
		attackRating: attackRating,
		edgeGained: edgeGained,
	};
}

async function finishRoll<T extends SR6RollData>(roller: SR6Actor, data: Record<string, unknown>, options: T) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const roll = new SR6Roll(`${options.pool}d6`, data, options as any);
	const evaluated = await roll.evaluate({ async: true });
	// await evaluated.finish();

	// Apply post-roll effects

	// Apply edge gain to target if any
	if (Object.hasOwnProperty.call(options, 'attack')) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const attack = (options as any)['attack'] as BaseAttackData;
		if (attack.edgeGained !== EdgeGainedTarget.None) {
			const attacker = (await getActor(SR6Actor<LifeformDataModel>, attack.attackerId))!;
			const targets = attack.targetIds
				? attack.targetIds!.map((target) => getActorSync(SR6Actor<LifeformDataModel>, target)!)
				: [];
			switch (attack.edgeGained) {
				case EdgeGainedTarget.Attacker:
					attacker.systemData.gainEdge(1);
					break;
				case EdgeGainedTarget.Defender:
					targets.forEach((defender) => defender.systemData.gainEdge(1));
			}
		}
	}

	await evaluated.toMessage();
}

export function preRoll<TRollData extends SR6RollData>(
	roller: SR6Actor<BaseActorDataModel>,
	rollData: TRollData,
): TRollData {
	return rollData;
}

export function getInitiativeRoll(systemData: IHasInitiative, formula: string): SR6Roll {
	const poolModifier = systemData.getPool(RollType.Initiative);
	return new SR6Roll(
		`(${formula}) + ${poolModifier}`,
		{ ...systemData.actor!.getRollData(), actor: systemData.actor! },
		{ ...SR6Roll.defaultOptions(), template: ROLL_TEMPLATES.get(RollType.Initiative)! },
	);
}

export async function rollAttribute(actor: SR6Actor<LifeformDataModel>, attribute: EnumAttribute): Promise<void> {
	const rollType = RollType.Attribute;

	const configuredData = await RollPrompt.promptForRoll<AttributeRollData>(
		actor,
		preRoll(actor, {
			...SR6Roll.defaultOptions(),
			pool: actor.systemData.attribute(attribute).pool + actor.systemData.getPool(rollType),
			template: ROLL_TEMPLATES.get(rollType)!,
			type: rollType,
			attribute: attribute,
		}),
	);
	if (configuredData) {
		await finishRoll(actor, { ...actor.getRollData(), actor: actor }, configuredData);
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
		await finishRoll(actor, { ...actor.getRollData(), actor: actor }, rollData);
	}
}

/*
 Weapon Rolls


 */
export async function rollWeaponAttack(systemData: IHasPools, weapon: SR6Item<WeaponDataModel>): Promise<void> {
	const rollType = RollType.WeaponAttack;

	const pool = weapon.systemData.pool + systemData.actor!.systemData.getPool(rollType);

	const attackData = {
		...createBaseAttackData({
			attackerId: systemData.actor!.uuid,
			targetIds: getTargetActorIds(),
			itemId: weapon.uuid,
			damage: weapon.systemData.damage,
			attackRating: weapon.systemData.attackRatings.near,
		}),

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
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

export async function rollWeaponDefend(
	systemData: IHasPools,
	hits: number,
	previous: WeaponAttackRollData,
): Promise<void> {
	const rollType = RollType.WeaponDefend;

	const pool = systemData.actor!.systemData.getPool(rollType);
	const attack = { ...previous.attack, damage: (previous.attack.damage! += hits) };

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
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

export async function rollWeaponSoak(
	systemData: IHasPools,
	hits: number,
	previous: WeaponDefendRollData,
): Promise<void> {
	const rollType = RollType.WeaponSoak;

	const pool = systemData.actor!.systemData.getPool(rollType);
	const attack = { ...previous.attack, damage: previous.attack.damage! - hits };

	const rollData = await RollPrompt.promptForRoll<WeaponSoakRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: attack.damage,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

//
// Matrix Actions
//
export async function rollMatrixAction(
	systemData: IHasMatrixPersona,
	action: SR6Item<MatrixActionDataModel>,
): Promise<void> {
	if (!systemData.matrixPersona) {
		ui.notifications.error('You cannot roll a matrix action without activating your persona');
		return;
	}

	const rollType = RollType.MatrixAction;

	const pool = systemData.actor!.systemData.getPool(rollType) + action.systemData.pool;

	const attackData = createBaseAttackData({
		attackerId: systemData.actor!.uuid,
		targetIds: getTargetActorIds(),
		itemId: action.uuid,
		damage: action.systemData.damage,
		attackRating: systemData.matrixPersona!.attackRating,
	});

	const rollData = await RollPrompt.promptForRoll<MatrixActionRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attackData,
	});

	if (rollData) {
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

export async function rollMatrixDefense(
	systemData: IHasMatrixPersona,
	hits: number,
	previous: MatrixActionRollData,
): Promise<void> {
	const rollType = RollType.MatrixActionDefend;

	const action = getItemSync(SR6Item<MatrixActionDataModel>, previous.attack.itemId)!;
	const defendPool = action.systemData.defendAgainstPool(systemData.actor!);

	const pool = systemData.actor!.systemData.getPool(rollType) + defendPool;
	const attack = { ...previous.attack, damage: (previous.attack.damage! += hits) };

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
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

//
// Magic
//
export async function rollSpellCast<TDataModel extends LifeformDataModel = LifeformDataModel>(
	actor: SR6Actor<TDataModel>,
	spell: SR6Item<SpellDataModel>,
): Promise<void> {
	const rollType = RollType.SpellCast;
	const pool = spell.systemData.pool;

	const attackData = createBaseAttackData({
		attackerId: actor.uuid,
		targetIds: getTargetActorIds(),
		itemId: spell.uuid,
		attackRating: actor.systemData.spellAttackRating,
		damage: spell.systemData.baseDamage,
	});

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
		await finishRoll(actor, { ...actor.getRollData(), actor: actor }, rollData);
	}
}

export async function rollSpellResistDrain<TDataModel extends LifeformDataModel = LifeformDataModel>(
	systemData: TDataModel,
	hits: number,
	previous: SpellCastRollData,
): Promise<void> {
	const rollType = RollType.SpellDrain;

	const pool = systemData.actor!.systemData.getPool(rollType) + systemData.spellResistDrain;
	const attack = { ...previous.attack, damage: previous.drain };

	const rollData = await RollPrompt.promptForRoll<SpellResistDrainRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: previous.drain,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

export async function rollSpellDefend<TDataModel extends LifeformDataModel = LifeformDataModel>(
	systemData: TDataModel,
	hits: number,
	previous: SpellCastRollData,
): Promise<void> {
	const rollType = RollType.SpellDefend;

	// const attacker = await getActor(SR6Actor<LifeformDataModel>, previous.attack.attackerId);
	const defender = systemData.actor! as SR6Actor<LifeformDataModel>;
	const spell = (await getItem(SR6Item<SpellDataModel>, previous.attack.itemId))!;

	const pool = defender.systemData.getPool(rollType) + spell.systemData.getDefensePool(defender);
	const attack = { ...previous.attack, damage: previous.attack.damage! + hits };

	const rollData = await RollPrompt.promptForRoll<SpellDefendRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: hits,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}

export async function rollSpellSoak(systemData: IHasPools, hits: number, previous: SpellDefendRollData): Promise<void> {
	const rollType = RollType.SpellSoak;

	const pool = systemData.actor!.systemData.getPool(rollType);
	const attack = { ...previous.attack, damage: previous.attack.damage! - hits };

	const rollData = await RollPrompt.promptForRoll<SpellSoakRollData>(systemData.actor!, {
		...SR6Roll.defaultOptions(),
		pool: pool,
		threshold: previous.attack.damage,
		template: ROLL_TEMPLATES.get(rollType)!,
		type: rollType,
		attack: attack,
		previous: previous,
	});
	if (rollData) {
		await finishRoll(systemData.actor!, { ...systemData.actor!.getRollData(), actor: systemData.actor! }, rollData);
	}
}
