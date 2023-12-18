import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6Item } from "./items/SR6Item.js";
import { showDefenseRollDialog } from "./dialogs/DefenseRollDialog.js";
import { showRollSoakDialog } from "./dialogs/RollSoakDialog.js";
import { getSelfOrSelectedActors } from "./util.js";

export class SR6ChatMessage extends ChatMessage {
	constructor(data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseChatMessage>>[0], context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseChatMessage>>[1]) {
		super(data, context);
		console.log("SR6ChatMessage", this);
	}

	getHTML(): Promise<JQuery> {
		return super.getHTML();
	}
}

export function SR6RenderChatMessage(app: ChatMessage, html: JQuery, data: any) {
	html.on("click", "#roll-soak", (event) => {
		//event.preventDefault();
		let target: HTMLInputElement = event.currentTarget;
		let attacker_id: string = target.dataset["attackerId"]!;
		let item_id: string = target.dataset["weaponId"]!;
		let hits: number = parseInt(target.dataset["hits"]!);
		let damage: number = parseInt(target.dataset["damage"]!);

		let attacker: SR6Actor = (game as Game).actors!.get(attacker_id)! as SR6Actor;
		let item: SR6Item = attacker.items.get(item_id)! as SR6Item;

		//console.log("roll-soak", hits, threshold, damage, attacker_id, item_id);

		let rollers = getSelfOrSelectedActors();
		rollers.forEach((actor) => showRollSoakDialog(actor, attacker, item, damage));
	});

	html.on("click", "#roll-defense", (event) => {
		//event.preventDefault();
		let target: HTMLInputElement = event.currentTarget;
		let attacker_id: string = target.dataset["attackerId"]!;
		let item_id: string = target.dataset["weaponId"]!;
		let hits: number = parseInt(target.dataset["hits"]!);
		let damage: number = parseInt(target.dataset["damage"]!) + hits;

		let attacker: SR6Actor = (game as Game).actors!.get(attacker_id)! as SR6Actor;
		let item: SR6Item = attacker.items.get(item_id)! as SR6Item;

		let rollers = getSelfOrSelectedActors();
		rollers.forEach((actor) => showDefenseRollDialog(actor, attacker, item, damage));
	});

	html.on("click", ".chat-dice", (event) => {
		event.preventDefault();
		let roll = $(event.currentTarget.parentElement);
		let tip = roll.find(".chat-dice-collapsible");
		if (!tip.is(":visible")) {
			tip.slideDown(200);
		} else {
			tip.slideUp(200);
		}
	});

	html.on("click", ".chat-weapon", (event) => {
		event.preventDefault();
		let roll = $(event.currentTarget.parentElement);
		let tip = roll.find(".chat-weapon-collapsible");
		if (!tip.is(":visible")) {
			tip.slideDown(200);
		} else {
			tip.slideUp(200);
		}
	});
}
