import { SR6SoakRoll } from "./rolls/Rolls.js";
import { SR6DefenseRollDialog } from "./dialogs/SR6DefenseRollDialog.js";
import { SR6SoakRollDialog } from "./dialogs/SR6SoakRollDialog.js";
import * as util from "./util.js";
export class SR6ChatMessage extends ChatMessage {
    constructor(data, context) {
        super(data, context);
    }
    getHTML() {
        return super.getHTML();
    }
}
export function SR6RenderChatMessage(msg, html, data) {
    // add a hidden input field to all chat messages
    html.find("#message-id").attr("value", msg.id);
    html.on("click", "#roll-soak", (event) => {
        event.preventDefault();
        let defense_roll = msg.rolls[0];
        util.getSelfOrSelectedActors().forEach((actor) => {
            new SR6SoakRollDialog(actor, defense_roll).render(true);
        });
    });
    html.on("click", "#roll-defense", (event) => {
        event.preventDefault();
        let attack_roll = msg.rolls[0];
        util.getSelfOrSelectedActors().forEach((actor) => {
            new SR6DefenseRollDialog(actor, attack_roll).render(true);
        });
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
    html.on("click", ".chat-item", (event) => {
        event.preventDefault();
        let roll = $(event.currentTarget.parentElement);
        let tip = roll.find(".chat-item-collapsible");
        if (!tip.is(":visible")) {
            tip.slideDown(200);
        }
        else {
            tip.slideUp(200);
        }
    });
    // Multiple formulas
    for (let i = 0; i < 9; i++) {
        html.on("click", `.chat-formula-${i}`, (event) => {
            event.preventDefault();
            let roll = $(event.currentTarget.parentElement);
            let tip = roll.find(`.chat-formula-${i}-collapsible`);
            if (!tip.is(":visible")) {
                tip.slideDown(200);
            }
            else {
                tip.slideUp(200);
            }
        });
    }
}
export function SR6ChatLogContext(html, data) {
    console.log("getChatLogEntryContext", data);
    const healPhysicalDamage = {
        name: "Heal Damage",
        icon: '<i class="fas fa-user-minus"></i>',
        condition: (li) => {
            return game.messages.get(li.data("messageId")).rolls[0] instanceof SR6SoakRoll;
        },
        callback: (li) => {
            let roll = game.messages.get(li.data("messageId")).rolls[0];
            util.getSelfOrSelectedActors().forEach((actor) => {
                actor.healDamage(roll.damage, roll.item.system.damage_type);
            });
        }
    };
    const applyPhysicalDamage = {
        name: "Apply Damage",
        icon: '<i class="fas fa-user-minus"></i>',
        condition: (li) => {
            return game.messages.get(li.data("messageId")).rolls[0] instanceof SR6SoakRoll;
        },
        callback: (li) => {
            let roll = game.messages.get(li.data("messageId")).rolls[0];
            util.getSelfOrSelectedActors().forEach((actor) => {
                actor.applyDamage(roll.damage, roll.item.system.damage_type);
            });
        }
    };
    data.unshift(healPhysicalDamage);
    data.unshift(applyPhysicalDamage);
}
