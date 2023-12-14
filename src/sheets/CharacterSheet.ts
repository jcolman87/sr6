import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import { SR6CONFIG } from "../config.js";

export class SR6CharacterSheet extends ActorSheet {
	_onRollFormula(event: JQuery.ClickEvent) {
		let target: HTMLInputElement = event.currentTarget;
		let formula: string = target.dataset["pool"]!;

		(this.actor as SR6Actor).rollFormula(formula);
	}

	_onRollWeapon(event: JQuery.ClickEvent) {
		let target: HTMLInputElement = event.currentTarget;
		let item_id: string = target.dataset["itemId"]!;
		let item: SR6Item = this.actor.items.get(item_id)! as SR6Item;

		(this.actor as SR6Actor).rollWeapon(item);
	}

	activateListeners(html: JQuery) {
		html.find(".roll-weapon").click(this._onRollWeapon.bind(this));
		html.find(".roll-formula").click(this._onRollFormula.bind(this));

		html.find(":input[direct-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			//console.log("SR6CharacterSheet::change - ", target.id, target.value);

			let value: string | number;
			if (target.type == "number") {
				value = parseInt(target.value);
				if (value == undefined) {
					value = 0;
				}
			} else {
				value = target.value;
			}

			this.actor.update({
				[target.id]: value
			});
		});
	}

	get template() {
		return "systems/sr6/templates/actors/character.html";
	}

	static override get defaultOptions(): ActorSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: ["shadowrun6", "sheet", "actor"],
			template: "systems/sr6/templates/actors/character.html",
			width: 700,
			height: 800,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "basics"
				}
			],
			scrollY: [],
			dragDrop: [
				{
					dragSelector: ".item-list .item",
					dropSelector: null
				}
			]
		});
	}

	override getData(options?: ActorSheet.Options): ActorSheet.Data | Promise<ActorSheet.Data> {
		let data = super.getData(options);
		(data as any).config = SR6CONFIG;
		//console.log("SR6CharacterSheet::getData", data);
		return data;
	}
}
