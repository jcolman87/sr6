import { showRollDefenseDialog } from "./dialogs/RollDefenseDialog.js";
import { showRollSoakDialog } from "./dialogs/RollSoakDialog.js";
import { getSelfOrSelectedActors } from "./util.js";
export class SR6ChatMessage extends ChatMessage {
    constructor(data, context) {
        super(data, context);
        console.log("SR6ChatMessage", this);
    }
    getHTML() {
        return super.getHTML();
    }
}
export function SR6RenderChatMessage(app, html, data) {
    html.on("click", "#roll-soak", (event) => {
        //event.preventDefault();
        let target = event.currentTarget;
        let attacker_id = target.dataset["attackerId"];
        let item_id = target.dataset["weaponId"];
        let hits = parseInt(target.dataset["hits"]);
        let damage = parseInt(target.dataset["damage"]);
        let attacker = game.actors.get(attacker_id);
        let item = attacker.items.get(item_id);
        //console.log("roll-soak", hits, threshold, damage, attacker_id, item_id);
        let rollers = getSelfOrSelectedActors();
        rollers.forEach((actor) => showRollSoakDialog(actor, attacker, item, damage));
    });
    html.on("click", "#roll-defense", (event) => {
        //event.preventDefault();
        let target = event.currentTarget;
        let attacker_id = target.dataset["attackerId"];
        let item_id = target.dataset["weaponId"];
        let hits = parseInt(target.dataset["hits"]);
        let damage = parseInt(target.dataset["damage"]) + hits;
        let attacker = game.actors.get(attacker_id);
        let item = attacker.items.get(item_id);
        let rollers = getSelfOrSelectedActors();
        rollers.forEach((actor) => showRollDefenseDialog(actor, attacker, item, damage));
    });
    html.on("click", ".chat-dice", (event) => {
        event.preventDefault();
        let roll = $(event.currentTarget.parentElement);
        let tip = roll.find(".chat-dice-collapsible");
        if (!tip.is(":visible")) {
            tip.slideDown(200);
        }
        else {
            tip.slideUp(200);
        }
    });
    html.on("click", ".chat-weapon", (event) => {
        event.preventDefault();
        let roll = $(event.currentTarget.parentElement);
        let tip = roll.find(".chat-weapon-collapsible");
        if (!tip.is(":visible")) {
            tip.slideDown(200);
        }
        else {
            tip.slideUp(200);
        }
    });
}
