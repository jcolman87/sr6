import { SR6CharacterActor } from "../actors/SR6CharacterActor.js";
import { SR6Item } from "../items/SR6Item.js";
import { SR6ActiveEffect } from "../SR6ActiveEffect.js";
import { ActorTypes } from "../actors/Data.js";
import * as util from "../util.js";

import { SR6CONFIG, Enums } from "../config.js";

export class SR6CharacterSheet extends ActorSheet {
	get character() : SR6CharacterActor {
		return (this.actor as SR6CharacterActor);
	}

	_onRollAttribute(event: JQuery.ClickEvent) {
		let target: HTMLInputElement = event.currentTarget;
		let attribute: Enums.Attribute = Enums.Attribute[target.dataset["attribute"]! as keyof typeof Enums.Attribute];

		this.character.rollAttribute(attribute);
	}
	_onRollSkill(event: JQuery.ClickEvent) {
		let target: HTMLInputElement = event.currentTarget;
		let skill: Enums.Skill = Enums.Skill[target.dataset["skill"]! as keyof typeof Enums.Skill];
		
		this.character.rollSkill(skill);
	}

	_onRollWeapon(event: JQuery.ClickEvent) {
		let target: HTMLInputElement = event.currentTarget;
		let item_id: string = target.dataset["itemId"]!;
		let item: SR6Item = this.actor.items.get(item_id)! as SR6Item;

		this.character.rollWeapon(item);
	}

	activateListeners(html: JQuery) {
		console.log("SR6CharacterSheet::activateListeners");
		html.find(".roll-weapon").click(this._onRollWeapon.bind(this));
		html.find(".roll-skill").click(this._onRollSkill.bind(this));
		html.find(".roll-attribute").click(this._onRollAttribute.bind(this));

		html.find(":input[direct-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			let value = util.directDataValue(target);

			this.actor.update({
				[target.id]: value
			});
		});
		html.find(":input[direct-item-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			let field = target.dataset["field"]!;
	
			let item = this.actor.items.get(target.dataset["itemId"]!)!;

			let value: string | number;
			if (target.type == "number") {
				value = parseInt(target.value);
				if (isNaN(value)) {
					value = 0;
				}
			} else {
				value = target.value;
			}
			console.log("asdf", item, field, value);
			item.update({
				[field]: value
			});
		});

		this._activeItemListeners(html);	
		this._activateActiveEffectListeners(html);

		this._drawMonitorBar(html.find(".physical-bar") as JQuery<HTMLDivElement>, this.character.getData().monitors.physical);
		this._drawMonitorBar(html.find(".stun-bar") as JQuery<HTMLDivElement>, this.character.getData().monitors.stun)
	}

	_drawMonitorBar(div: JQuery<HTMLDivElement>, attr: ActorTypes.Attribute) {
		let table = document.createElement("table");

		let width = (300 - 32) / (attr.base);

		// img
		let imgUrl = "systems/sr6/icons/heart.svg";
		if(div.attr("id") == "stun-bar") {
			imgUrl = "systems/sr6/icons/brain.svg";
		}
		let point = document.createElement("td");
		point.setAttribute("style", `font-weight: bold; width: 32px; background-repeat: no-repeat; background-image: url("${imgUrl}"); text-align: center; border-left: solid black 1px;`);
		let text = document.createTextNode(`${attr.base - attr.pool}`);
		point.append(text);
		table.append(point);

		// Create bars
		for (let i = 0; i < attr.base; i++) {
			let point = document.createElement("td");

			if(i < attr.pool) {
				point.setAttribute("style", `text-align: center; border-left: solid black 1px; width: ${width}px; background: #FFCCCB`);
			} else {
				point.setAttribute("style", `text-align: center; border-left: solid black 1px; width: ${width}px;`);
			}

			if ((i+1) % 3 == 0) {
					let minus: number = -((i+1) / 3);
					let text = document.createTextNode(`${minus}`);
					point.append(text);
			}
			point.addEventListener("click", this._setDamage.bind(this, div, attr, i+1));
			table.append(point);
		}
		div.append(table);
	}

	_setDamage(div: JQuery<HTMLDivElement>, attr: ActorTypes.Attribute, index: number) {
		//console.log("SR6CharacterSheet::_setDamage", div.attr("id"), attr, index);
		let newValue: number = 0;
		if(attr.pool == index) {
			newValue = 0;
		} else {
			newValue = index;
		}
		let field = "system.monitors.physical.pool";
		if(div.attr("id") == "stun-bar") {
			field = "system.monitors.stun.pool";
		}
		this.actor.update({ [field] : newValue});
	}

	_activeItemListeners(html: JQuery) {
		html.find(".add-item").click(async (event: JQuery.ClickEvent) => {
			let type: string = (event.currentTarget as HTMLInputElement).dataset["type"]!;
			let item: SR6Item = (await this.actor.createEmbeddedDocuments("Item", [{name: "New " + type, type: type}]) as any)[0] as SR6Item;
			//effect.sheet!.render(true);
		});
		html.find(".edit-item").click(async (event: JQuery.ClickEvent) => {
			const item = this.actor.items.get((event.currentTarget as HTMLInputElement).dataset["id"]!)!;
			item.sheet!.render(true);
		});
		html.find(".remove-item").click(async (event: JQuery.ClickEvent) => {
			this.actor.deleteEmbeddedDocuments("Item", [(event.currentTarget as HTMLInputElement).dataset["id"]!]);
		});
	}

	_activateActiveEffectListeners(html: JQuery) {
		html.find(".add-effect").click(async (event: JQuery.ClickEvent) => {
			const activeEffectData = {
				name: "Balls",
				origin: this.actor.id,
				duration: {
					rounds: undefined
				},
				flags: {
					sr6: {

					}
				},
				changes: []
	        };

			const effect: SR6ActiveEffect = (await this.actor.createEmbeddedDocuments("ActiveEffect", [activeEffectData]) as any)[0] as SR6ActiveEffect;
			
			effect.sheet!.render(true);
		});
		html.find(".edit-effect").click((event: JQuery.ClickEvent) => {
			const effect = this.actor.effects.get((event.currentTarget as HTMLInputElement).dataset["effectId"]!)!;
			effect.sheet!.render(true);
		});
		html.find(".remove-effect").click((event: JQuery.ClickEvent) => {
			this.actor.deleteEmbeddedDocuments("ActiveEffect", [(event.currentTarget as HTMLInputElement).dataset["effectId"]!]);
		});
		html.find(":input[direct-effect-data]").change((event) => {
			const target = event.currentTarget as HTMLInputElement;
			const field = target.dataset["field"]!;
			
			const effect = this.actor.effects.get(target.dataset["effectId"]!)!;

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
		html.find(".transfer-effect").click((event: JQuery.ClickEvent) => {
			this.actor.applyActiveEffects();
		});
	}

	get template() {
		return "systems/sr6/templates/actors/character.html";
	}

	static override get defaultOptions(): ActorSheet.Options {
		return mergeObject(super.defaultOptions, {
			classes: ["sr6", "sheet", "actor"],
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
		(data as any).user = (game as Game).user!;
		//console.log("SR6CharacterSheet::getData", data);
		return data;
	}
}
