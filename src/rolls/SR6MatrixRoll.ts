import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6CONFIG, Enums, MatrixActionDef } from "../config.js";
import * as Rules from "../rules.js";

export class SR6MatrixRollData extends SR6RollData {
	matrix_action: Enums.MatrixAction;
	damage: null | number = null;

	constructor(actor: SR6Actor, matrix_action: Enums.MatrixAction) {
		super(actor);

		let action = SR6CONFIG.matrix_actions.get(matrix_action)!;

		this.matrix_action = matrix_action;
		this.pool = actor.solveFormula(action.formula!);

		if(action.damageFormula) {
			this.damage = actor.solveFormula(action.damageFormula!);
		}

	}
}

export class SR6MatrixRoll extends SR6Roll<SR6MatrixRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6MatrixRoll.html";

	static make(data: SR6MatrixRollData): SR6MatrixRoll {
		return new SR6MatrixRoll("(@pool)d6", data);
	}

	get damage(): null | number {
		if(this.data.damage != null) {
			return this.data.damage + this.hits;
		} else {
			return null;
		}
	}

	get matrix_action(): MatrixActionDef {
		return SR6CONFIG.matrix_actions.get(this.matrix_action_id)!
	}

	get matrix_action_id(): Enums.MatrixAction {
		return this.data.matrix_action;
	}
}
