import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums } from "../config.js";
import { SR6Roll, DefenseRollData } from "../SR6Roll.js";

class RollSoakDialog extends FormApplication {
	actor: SR6Actor;
	attacker: SR6Actor;
	weapon: SR6Item;
	threshold: number;

	constructor(actor: SR6Actor, attacker: SR6Actor, weapon: SR6Item, threshold: number) {
		super({}, {});

		this.actor = actor;
		this.attacker = attacker;
		this.weapon = weapon;
		this.threshold = threshold;
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
			template: "systems/sr6/templates/dialogs/RollSoakDialog.html",
			tabs: []
		});
	}

	async _updateObject(event: Event, formData: any) {}

	_onComplete(html: JQuery, event: JQuery.ClickEvent) {
		const pool_modifier: number = parseInt(html.find("#pool-modifier").val() as string);

		const data: DefenseRollData = {
			type: Enums.RollType.SoakDamage,
			actor: this.actor,
			attacker: this.attacker,
			weapon: this.weapon,
			threshold: this.threshold,
			pool_modifier: pool_modifier
		};
		//let attack_formula = this.weapon.weapon()!.attack_formula;
		//console.log("RollDefense");
		const formula: string = `(@actor.system.attributes.body.pool + ${pool_modifier})d6`;
		//console.log("formual = ", formula);
		//const formula: string = `(${attack_formula} + ${pool_modifier})d6`

		let roll = new SR6Roll(formula, data);

		roll.evaluate({ async: false });
		roll.toMessage(roll, {});

		this.close({});
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);

		html.find("#do-roll").click(this._onComplete.bind(this, html));
	}

	getData(options: any) {
		let data = super.getData(options);
		(data as any).actor = this.actor;
		(data as any).weapon = this.weapon;

		return data;
	}

	close(options: any): Promise<void> {
		return super.close();
	}
}

export async function showRollSoakDialog(actor: SR6Actor, attacker: SR6Actor, weapon: SR6Item, threshold: number) {
	let dialog = new RollSoakDialog(actor, attacker, weapon, threshold).render(true);
}
