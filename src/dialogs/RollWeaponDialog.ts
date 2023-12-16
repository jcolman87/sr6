import { RollDialog } from "./RollDialog.js";
import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums } from "../config.js";
import { SR6Roll, WeaponRollData } from "../SR6Roll.js";

class RollWeaponDialog extends RollDialog {
	actor: SR6CharacterActor;
	weapon: SR6Item;

	constructor(actor: SR6CharacterActor, weapon: SR6Item) {
		super();

		this.actor = actor;
		this.weapon = weapon;
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
			template: "systems/sr6/templates/dialogs/RollWeaponDialog.html",
			tabs: []
		});
	}

	getBasePool(): number {
		return this.actor.calculateSkillPool(this.weapon.skill_use()!);
	}

	getRollData(html: JQuery) : any { 
		const distance: Enums.Distance = Enums.Distance[html.find("#distance").val() as keyof typeof Enums.Distance];
		const firemode: Enums.FireMode = Enums.FireMode[html.find("#firemode").val() as keyof typeof Enums.FireMode];

		let data: WeaponRollData = {
			type: Enums.RollType.WeaponAttack,
			actor: this.actor,
			weapon: this.weapon,
			distance: distance,
			firemode: firemode
		};

		return data;
	}
}

export async function showRollWeaponDialog(actor: SR6CharacterActor, weapon: SR6Item) {
	let dialog = new RollWeaponDialog(actor, weapon).render(true);
}
