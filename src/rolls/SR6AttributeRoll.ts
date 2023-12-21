import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { Enums } from "../config.js";
import * as Rules from "../rules.js";

export class SR6AttributeRollData extends SR6RollData {
	attribute: Enums.Attribute;

	constructor(actor: SR6Actor, attribute: Enums.Attribute) {
		super(actor);

		this.attribute = attribute;
		this.pool = Rules.calcAttributePool(this.getActor()!, this.attribute);
	}
}

export class SR6AttributeRoll extends SR6Roll<SR6AttributeRollData> {
	static CHAT_TEMPLATE: string = "systems/sr6/templates/rolls/SR6AttributeRoll.html";

	static make(data: SR6AttributeRollData): SR6AttributeRoll {
		return new SR6AttributeRoll("(@pool)d6", data);
	}
}
