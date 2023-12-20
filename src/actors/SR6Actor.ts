import { SR6Roll, SR6RollData } from "../rolls/Rolls.js";
import { Enums, SkillUse } from "../config.js";
import { ActorTypes, BaseActorData } from "./Data.js";

export class SR6Actor extends Actor {
	get base_data(): BaseActorData {
		return (this as any).system as BaseActorData;
	}

	getData(): BaseActorData {
		//if(this.isCharacter) { TODO
		let data: BaseActorData = (this as any).system;
		return data;
		//}
	}

	constructor(a: any, b: any) {
		super(a, b);
		console.log("SR6Actor::constructor");
	}

	solveFormula(formula: string): number {
		if(formula == undefined || formula == "") {
			return 0;
		}

		let roll = new SR6Roll(formula, new SR6RollData(this));
		roll.evaluate({ async: false });

		return roll.total!;
	}

	getSkill(ty: Enums.Skill): ActorTypes.Skill {
		return new ActorTypes.Skill();
	}

	getAttribute(ty: Enums.Attribute): ActorTypes.Attribute {
		return new ActorTypes.Attribute();
	}

	applyDamage(value: number, type: Enums.DamageType) {
		ui.notifications!.error("applyDamage not implemented on this actor type");
	}
	healDamage(value: number, type: Enums.DamageType) {
		ui.notifications!.error("healDamage not implemented on this actor type");
	}

	////

	get inCombat(): boolean {
		let combat = (game as Game).combat;
		if (combat != undefined) {
			return combat.getCombatantByActor(this.id!) != undefined;
		}
		return false;
	}

	get isCombatTurn(): boolean {
		if (this.inCombat) {
			if ((game as Game).combat!.combatant != undefined) {
				return (game as Game).combat!.combatant!.actor === this;
			}
		}
		return false;
	}

	get wound_modifier(): number {
		return 0;
	}
	get initiatives(): ActorTypes.Initiatives {
		return this.getData().initiatives;
	}

	get actions(): ActorTypes.Actions {
		return this.getData().initiatives.actions;
	}
}
