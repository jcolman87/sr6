import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums } from "../config.js";
import { SR6Roll, WeaponRollData } from "../SR6Roll.js";

class RollWeaponDialog extends FormApplication {
	actor: SR6Actor;
	weapon: SR6Item;

	constructor(actor: SR6Actor, weapon: SR6Item) {
		super({}, {});

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

	async _updateObject(event: Event, formData: any) {}

	_onComplete(html: JQuery, event: JQuery.ClickEvent) {
		const pool_modifier: number = parseInt(html.find("#pool-modifier").val() as string);
		const distance: Enums.Distance = Enums.Distance[html.find("#distance").val() as keyof typeof Enums.Distance];
		const firemode: Enums.FireMode = Enums.FireMode[html.find("#firemode").val() as keyof typeof Enums.FireMode];

		//console.log("RollWeaponDialog::_onComplete", pool_modifier, Enums.Distance[distance] as string, Enums.FireMode[firemode] as string);

		const data: WeaponRollData = {
			type: Enums.RollType.WeaponAttack,
			actor: this.actor,
			weapon: this.weapon,
			distance: distance,
			firemode: firemode,
			pool_modifier: pool_modifier
		};
		let attack_formula = this.weapon.weapon()!.attack_formula;

		const formula: string = `(${attack_formula} + ${pool_modifier})d6`;

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

export async function showRollWeaponDialog(actor: SR6Actor, weapon: SR6Item) {
	let dialog = new RollWeaponDialog(actor, weapon).render(true);
}
