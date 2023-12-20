import * as Rolls from "./rolls/Rolls.js";
import { SR6DefenseRollDialog } from "./dialogs/SR6DefenseRollDialog.js";
import { SR6SoakRollDialog } from "./dialogs/SR6SoakRollDialog.js";
import { SR6MatrixDefenseRollDialog } from "./dialogs/SR6MatrixDefenseRollDialog.js";
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
    //
    html.on("click", "#roll-soak", async (event) => {
        event.preventDefault();
        let defense_roll = msg.rolls[0];
        util.getSelfOrSelectedActors().forEach((actor) => {
            new SR6SoakRollDialog(actor, defense_roll).render(true);
        });
    });
    html.on("click", "#roll-defense", async (event) => {
        event.preventDefault();
        let attack_roll = msg.rolls[0];
        util.getSelfOrSelectedActors().forEach((actor) => {
            new SR6DefenseRollDialog(actor, attack_roll).render(true);
        });
    });
    html.on("click", "#roll-matrix-defense", async (event) => {
        event.preventDefault();
        let attack_roll = msg.rolls[0];
        util.getSelfOrSelectedActors().forEach((actor) => {
            new SR6MatrixDefenseRollDialog(actor, attack_roll).render(true);
        });
    });
    //
    //
    //
    html.on("click", "#spend-edge", async (event) => {
        event.preventDefault();
        let roll = msg.rolls[0];
        let selection = parseInt(html.find("#edge-boost").val());
        roll.data.edge.boost = selection;
        await roll.finishEdge();
        msg.update({ content: await roll.render(), rolls: [roll] });
    });
    html.on("click", ".chat-edge", async (event) => {
        event.preventDefault();
        let roll = $(event.currentTarget.parentElement);
        let tip = roll.find(".chat-edge-collapsible");
        if (!tip.is(":visible")) {
            tip.slideDown(200);
        }
        else {
            tip.slideUp(200);
        }
    });
    html.on("click", ".chat-dice", async (event) => {
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
    html.on("click", ".chat-item", async (event) => {
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
    html.on("click", ".chat-action-expand-text", async (event) => {
        event.preventDefault();
        let tip = html.find(".chat-action-expand-text-collapsible");
        if (!tip.is(":visible")) {
            tip.slideDown(200);
        }
        else {
            tip.slideUp(200);
        }
    });
    // Multiple formulas
    for (let i = 0; i < 9; i++) {
        html.on("click", `.chat-formula-${i}`, async (event) => {
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
            return game.messages.get(li.data("messageId")).rolls[0] instanceof Rolls.SR6SoakRoll;
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
            return game.messages.get(li.data("messageId")).rolls[0] instanceof Rolls.SR6SoakRoll;
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
