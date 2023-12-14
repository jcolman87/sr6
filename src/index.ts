import { SR6CONFIG } from "./config.js";
import { SR6Roll } from "./SR6Roll.js";
import { SR6ChatMessage, SR6RenderChatMessage } from "./SR6ChatMessage.js";
import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6Item } from "./items/SR6Item.js";
import { SR6CharacterSheet } from "./sheets/CharacterSheet.js";
import * as ItemSheets from "./sheets/ItemSheets.js";

import { preloadHandlebarsTemplates } from "./templates.js";
import { defineHandlebarHelpers } from "./handlebars.js";

import * as DataModels  from "./items/DataModels.js";

declare var game: Game;

function registerSheets() {
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("sr6", SR6CharacterSheet, {
		types: ["Player"],
		makeDefault: true
	});

	Items.registerSheet("shadowrun6-eden", ItemSheets.SR6ItemSheet, {types: ["Gear"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.SINSheet, {types: ["SIN"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.ContactSheet, {types: ["Contact"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.LifestyleSheet, {types: ["Lifestyle"], makeDefault: true});
}

Hooks.once("init", async function () {
	CONFIG.debug.hooks = false;
	CONFIG.debug.dice = false;
	(CONFIG as any).SR6 = SR6CONFIG;

	CONFIG.Actor.documentClass = SR6Actor;
	CONFIG.Item.documentClass = SR6Item;
	CONFIG.Dice.rolls = [SR6Roll];
	CONFIG.ChatMessage.documentClass = SR6ChatMessage;

	(CONFIG.Item as any).systemDataModels.SIN = DataModels.SIN;
	(CONFIG.Item as any).systemDataModels.Lifestyle = DataModels.Lifestyle;
	(CONFIG.Item as any).systemDataModels.Contact = DataModels.Contact;

	registerSheets();

	preloadHandlebarsTemplates();
	defineHandlebarHelpers();
});

Hooks.on("renderChatMessage", function (app: ChatMessage, html: JQuery, data: any) {
	SR6RenderChatMessage(app, html, data);
});

Hooks.on("dropActorSheetData", (dragTarget: Actor, sheet: ActorSheet, data: any) => {
	//console.log("dropActorSheetData", dragTarget, sheet, data);
});
