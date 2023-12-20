import { SR6ActiveEffect } from "../SR6ActiveEffect.js";
import { SR6Item } from "../items/SR6Item.js";
import { ItemTypes } from "../items/Data.js";
import { SR6CONFIG } from "../config.js";
import * as util from "../util.js";

export class SR6ItemSheet extends ItemSheet {
	_onAddType(event: JQuery.ClickEvent) {
		let target = event.currentTarget as HTMLInputElement;
		let ty_str: string = target.dataset["addType"]!;
		let ty: number = parseInt(ItemTypes.Types[ty_str as any]);

		(this.item as SR6Item).addType(ty);
	}

	_onRemoveType(event: JQuery.ClickEvent) {
		let target = event.currentTarget as HTMLInputElement;
		let ty_str: string = target.dataset["removeType"]!;
		let ty: number = parseInt(ItemTypes.Types[ty_str as any]);

		(this.item as SR6Item).removeType(ty);
	}

	activateListeners(html: JQuery) {
		html.find(".add-type").click(this._onAddType.bind(this));
		html.find(".remove-type").click(this._onRemoveType.bind(this));

		html.find("input[direct-data-array]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			//console.log("SR6ItemSheet::change - ", target.id, target.value);
			let data = (this.item as any).system;
			let array = data[target.id];
			if(target.checked) {
				array.push(target.value);
			} else {
				array = array.filter((v: string) => v !== target.value);
			}
			this.item.update({
				["system." + target.id]: array
			});
		});

		html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			let value = util.directDataValue(target);
			
			this.item.update({
				[target.id]: value
			});
		});
		
		this._activateActiveEffectListeners(html);
	}


	_activateActiveEffectListeners(html: JQuery) {
		html.find(".add-effect").click(async (event: JQuery.ClickEvent) => {
			const activeEffectData = {
				name: "Balls",
				origin: this.item.id,
				duration: {
					rounds: undefined
				},
				flags: {
					sr6: {

					}
				},
				changes: []
	        };

			let effect: SR6ActiveEffect = (await this.item.createEmbeddedDocuments("ActiveEffect", [activeEffectData]) as any)[0] as SR6ActiveEffect;
	
			effect.sheet!.render(true);
		});
		html.find(".edit-effect").click((event: JQuery.ClickEvent) => {
			let effect = this.item.effects.get((event.currentTarget as HTMLInputElement).dataset["effectId"]!)!;
			effect.sheet!.render(true);
		});
		html.find(".remove-effect").click((event: JQuery.ClickEvent) => {
			this.item.deleteEmbeddedDocuments("ActiveEffect", [(event.currentTarget as HTMLInputElement).dataset["effectId"]!]);
		});
		html.find(":input[direct-effect-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			let target_effect_id = target.dataset["effectId"]!;
			let field = target.dataset["field"]!;
			//console.log("SR6CharacterSheet::change - ", target.id, target.value);

			let effect = this.item.effects.get(target_effect_id)!;

			let value: string | number;
			if (target.type == "number") {
				value = parseInt(target.value);
				if (value == undefined) {
					value = 0;
				}
			} else {
				value = target.value;
			}

			effect.update({
				[field]: value
			});
		});


		html.find(".add-effect-change").click((event: JQuery.ClickEvent) => {
			let id: string = (event.currentTarget as HTMLInputElement).dataset["effectId"]!;
			
		});
		html.find(".remove-effect-change").click((event: JQuery.ClickEvent) => {
			let effect_id: string = (event.currentTarget as HTMLInputElement).dataset["effectId"]!;
			let change_idx: number = parseInt((event.currentTarget as HTMLInputElement).dataset["effectId"]!);
			//let effect: ActiveEffect = this.actor.effects.get(effect_id)!;
			//effect.changes.splice(change_idx, 1);
			//effect.update({["changes"]: effect.changes });
		});
	}

	override get template() {
		return "systems/sr6/templates/items/base.html";
	}

	static override get defaultOptions(): ItemSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: ["sr6", "sheet", "item"],
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "basics"
				}
			],
			width: 550
		});
	}

	override getData(options?: ItemSheet.Options): ItemSheet.Data | Promise<ItemSheet.Data> {
		let data = super.getData(options);
		(data as any).config = SR6CONFIG;
		(data as any).user = (game as Game).user!;
		//console.log("SR6ItemSheet::getData", data);
		return data;
	}
}

export class SINSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/sin.html";
	}
}

export class LifestyleSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/lifestyle.html";
	}
}

export class ContactSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/contact.html";
	}
}

export class AugmentationSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/augmentation.html";
	}
}

export class QualitySheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/quality.html";
	}
}

export class SpellSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/spell.html";
	}
}

export class WeaponAccessorySheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/weapon-accessory.html";
	}
}

export class AdeptPowerSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/adept-power.html";
	}
}

export class CredstickSheet extends SR6ItemSheet {
	override get template() {
		return "systems/sr6/templates/items/credstick.html";
	}
}

