import { SR6Item } from "../items/SR6Item.js";
import { ItemTypes } from "../items/Data.js";
import { SR6CONFIG } from "../config.js";

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

		html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			//console.log("SR6ItemSheet::change - ", target.id, target.value);

			let value: string | number;
			if (target.type == "number") {
				value = parseInt(target.value);
				if (value == undefined) {
					value = 0;
				}
			} else {
				value = target.value;
			}
			
			this.item.update({
				[target.id]: value
			});
		});
	}

	override get template() {
		return "systems/sr6/templates/items/base.html";
	}

	static override get defaultOptions(): ItemSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: ["shadowrun6", "sheet", "item"],
			width: 550
		});
	}

	override getData(options?: ItemSheet.Options): ItemSheet.Data | Promise<ItemSheet.Data> {
		let data = super.getData(options);
		(data as any).config = SR6CONFIG;
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
