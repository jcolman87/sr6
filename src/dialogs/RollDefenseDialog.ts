import { RollDialog } from "./RollDialog.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums } from "../config.js";
import { SR6Roll, DefenseRollData } from "../SR6Roll.js";

class RollDefenseDialog extends RollDialog {
	actor: SR6Actor;
	attacker: SR6Actor;
	weapon: SR6Item;
	damage: number;

	constructor(actor: SR6Actor, attacker: SR6Actor, weapon: SR6Item, damage: number) {
		super();

		this.actor = actor;
		this.attacker = attacker;
		this.weapon = weapon;
		this.damage = damage;
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sheet"],
			popOut: true,
			width: 400,
			height: 600,
			resizable: true,
			closeOnSubmit: false,
			submitOnClose: true,
			submitOnChange: true,
			template: "systems/sr6/templates/dialogs/RollDefenseDialog.html",
			tabs: []
		});
	}

	getBasePool(): number {
		return this.actor.solveFormula(`@actor.system.attributes.reaction.pool + @actor.system.attributes.intuition.pool`);
	}
	
	getRollData(html: JQuery) : any { 
		const data: DefenseRollData = {
			type: Enums.RollType.Defend,
			actor: this.actor,
			attacker: this.attacker,
			weapon: this.weapon,
			damage: this.damage
		};

		return data;
	}
}

export async function showRollDefenseDialog(actor: SR6Actor, attacker: SR6Actor, weapon: SR6Item, damage: number) {
	let dialog = new RollDefenseDialog(actor, attacker, weapon, damage).render(true);
}
