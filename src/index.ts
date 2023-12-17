import { SR6CONFIG } from "./config.js";
import { SR6Roll } from "./SR6Roll.js";
import { SR6ChatMessage, SR6RenderChatMessage } from "./SR6ChatMessage.js";
import { SR6ActorProxy } from "./actors/SR6ActorProxy.js";
import { SR6Item } from "./items/SR6Item.js";
import { SR6ActiveEffect } from "./SR6ActiveEffect.js";

import { SR6Combat } from "./combat/SR6Combat.js";
import { SR6Combatant } from "./combat/SR6Combatant.js";

import { SR6CharacterSheet } from "./sheets/CharacterSheet.js";
import * as ItemSheets from "./sheets/ItemSheets.js";

import { preloadHandlebarsTemplates } from "./templates.js";
import { defineHandlebarHelpers } from "./handlebars.js";

import * as ActorDataModels  from "./actors/DataModels.js";
import * as ItemDataModels  from "./items/DataModels.js";

import { addImportButton } from "./import/ImportDialog.js";

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
	Items.registerSheet("shadowrun6-eden", ItemSheets.SpellSheet, {types: ["Spell"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.AugmentationSheet, {types: ["Augmentation"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.QualitySheet, {types: ["Quality"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.WeaponAccessorySheet, {types: ["WeaponAccessory"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.AdeptPowerSheet, {types: ["AdeptPower"], makeDefault: true});
	Items.registerSheet("shadowrun6-eden", ItemSheets.CredstickSheet, {types: ["Credstick"], makeDefault: true});
}

Hooks.once("init", async function () {
	CONFIG.debug.hooks = false;
	CONFIG.debug.dice = false;
	(CONFIG.ActiveEffect as any).legacyTransferral = false;
	(CONFIG as any).SR6 = SR6CONFIG;

	(CONFIG.Actor.documentClass as any) = SR6ActorProxy;
	CONFIG.Item.documentClass = SR6Item;
	CONFIG.Dice.rolls = [SR6Roll];
	CONFIG.ActiveEffect.documentClass = SR6ActiveEffect;
	CONFIG.ChatMessage.documentClass = SR6ChatMessage; 

	(CONFIG.Actor as any).dataModels.Player = ActorDataModels.Character;
	(CONFIG.Actor as any).dataModels.MatrixHost = ActorDataModels.MatrixHost;
	(CONFIG.Actor as any).dataModels.MatrixIC = ActorDataModels.MatrixIC;

	(CONFIG.Item as any).dataModels.SIN = ItemDataModels.SIN;
	(CONFIG.Item as any).dataModels.Lifestyle = ItemDataModels.Lifestyle;
	(CONFIG.Item as any).dataModels.Contact = ItemDataModels.Contact;
	(CONFIG.Item as any).dataModels.WeaponAccessory = ItemDataModels.WeaponAccessory;
	(CONFIG.Item as any).dataModels.AdeptPower = ItemDataModels.AdeptPower;
	(CONFIG.Item as any).dataModels.Credstick = ItemDataModels.Credstick;

	CONFIG.Combat.documentClass = SR6Combat;
	CONFIG.Combatant.documentClass = SR6Combatant; 

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

Hooks.on("renderItemDirectory", (app: ItemDirectory, html: JQuery, data: any) => {
	//addImportButton(app, html, data);
});