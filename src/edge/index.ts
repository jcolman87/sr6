import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import { MonitorType } from '@/actor/data/MonitorsDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Roll from '@/roll/SR6Roll';
import { ActivationPhase } from '@/data';
import EdgeActionDataModel from '@/item/data/feature/EdgeActionDataModel';
import { InitiativeRollData } from '@/roll/InitiativeRoll';
import { ITest } from '@/test';
import { ConstructorOf } from '@/util';

export enum EdgeBoostType {
	Action = 'action',

	// 1 edge
	RerollOne = 'reroll_1_die',
	AddInitiative = 'add_3_initiative',

	// 2 edge
	PlusOneSingleDice = 'plus_1_single',

	// 3 edge
	BuyHit = 'buyhit',
	HealOneStun = 'heal1_s',

	// 4 edge
	AddEdgeExplode = 'explode',
	RerollFailures = 'reroll',
	HealOnePhysical = 'heal1_p',
}
export interface IEdgeBoost {
	type: EdgeBoostType;
	phase: ActivationPhase;
	edgeCost: number;

	get cost(): number;

	prepareInitiative?(data: InitiativeRollData): Promise<void>;

	prepareRoll?(roll: SR6Roll): Promise<void>;
	finishRoll?(roll: SR6Roll): Promise<void>;

	prepareActor?(actor: SR6Actor<BaseActorDataModel>): Promise<void>;
	finishActor?(actor: SR6Actor<BaseActorDataModel>): Promise<void>;

	prepareTest?(test: ITest): Promise<void>;
	finishTest?(test: ITest): Promise<void>;
}

export abstract class BaseEdgeBoost {
	abstract edgeCost: number;

	get cost(): number {
		return this.edgeCost;
	}

	async prepareActor(_actor: SR6Actor<BaseActorDataModel>): Promise<void> {
		// TODO: spend edge
	}
}

export class EdgeActionBoost extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.Action;
	phase: ActivationPhase = ActivationPhase.Any;
	edgeCost: number = 1;

	edgeAction: EdgeActionDataModel | null = null;

	async prepareInitiative(data: InitiativeRollData): Promise<void> {
		await this.edgeAction?.prepareInitiative(data);
	}

	async prepareTest(test: ITest): Promise<void> {
		await this.edgeAction?.prepareTest(test);
	}

	async finishRoll(roll: SR6Roll): Promise<void> {
		await this.edgeAction?.finishRoll(roll);
	}

	override async prepareActor(actor: SR6Actor<BaseActorDataModel>): Promise<void> {
		await super.prepareActor(actor);
		await this.edgeAction?.prepareActor(actor);
	}

	async finishTest(test: ITest): Promise<void> {
		await this.edgeAction?.finishTest(test);
	}

	override get cost(): number {
		return this.edgeAction?.cost || 0;
	}
}

/* 1-Cost Boosts */
export class AddInitiative extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.AddInitiative;
	phase: ActivationPhase = ActivationPhase.Initiative;
	edgeCost: number = 1;

	async prepareInitiative(data: InitiativeRollData): Promise<void> {
		data.score += 3;
	}
}

export class RerollOne extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.RerollOne;
	phase: ActivationPhase = ActivationPhase.PostRoll;
	edgeCost: number = 1;

	async finishRoll?(roll: SR6Roll): Promise<void> {
		await roll.rerollOne();
	}
}

/* 2-Cost Boosts */
export class PlusOneSingleDice extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.PlusOneSingleDice;
	phase: ActivationPhase = ActivationPhase.PostRoll;
	edgeCost: number = 1;

	async finishRoll(roll: SR6Roll): Promise<void> {
		roll.addOne();
	}
}

/* 3-Cost Boosts */
export class BuyHit extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.BuyHit;
	phase: ActivationPhase = ActivationPhase.Any;
	edgeCost: number = 3;

	async finishRoll(roll: SR6Roll): Promise<void> {
		roll.addDie();
	}
}
export class HealOneStun extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.HealOneStun;
	phase: ActivationPhase = ActivationPhase.Any;
	edgeCost: number = 4;

	async finishActor(actor: SR6Actor<BaseActorDataModel>): Promise<void> {
		void actor.systemData.monitors.heal(MonitorType.Physical, 1);
	}
}

/* 4-Cost Boosts */
export class AddEdgeExplode extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.AddEdgeExplode;
	phase: ActivationPhase = ActivationPhase.PreRoll;
	edgeCost: number = 4;

	async prepareTest(test: ITest): Promise<void> {
		test.data.pool! += test.actor.systemData.monitors.edge.max;
	}

	async finishRoll(roll: SR6Roll): Promise<void> {
		await roll.explode();
	}
}

export class RerollFailures extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.RerollFailures;
	phase: ActivationPhase = ActivationPhase.PostRoll;
	edgeCost: number = 4;

	async finishRoll(roll: SR6Roll): Promise<void> {
		await roll.rerollFailed();
	}
}

export class HealOnePhysical extends BaseEdgeBoost implements IEdgeBoost {
	type: EdgeBoostType = EdgeBoostType.HealOnePhysical;
	phase: ActivationPhase = ActivationPhase.Any;
	edgeCost: number = 4;

	async finishActor(actor: SR6Actor<BaseActorDataModel>): Promise<void> {
		await actor.systemData.monitors.heal(MonitorType.Physical, 1);
	}
}

export function config(): Record<string, ConstructorOf<BaseEdgeBoost>> {
	return {
		[EdgeBoostType.Action]: EdgeActionBoost,
		[EdgeBoostType.RerollOne]: RerollOne,
		[EdgeBoostType.AddInitiative]: AddInitiative,
		[EdgeBoostType.PlusOneSingleDice]: PlusOneSingleDice,

		[EdgeBoostType.BuyHit]: BuyHit,
		[EdgeBoostType.HealOneStun]: HealOneStun,

		[EdgeBoostType.AddEdgeExplode]: AddEdgeExplode,
		[EdgeBoostType.RerollFailures]: RerollFailures,
		[EdgeBoostType.HealOnePhysical]: HealOnePhysical,
	};
}

export function getEdgeBoost(type: EdgeBoostType): IEdgeBoost {
	return new (CONFIG.sr6.types.edge[type] as ConstructorOf<IEdgeBoost>)();
}
