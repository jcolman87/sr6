import { GearTypes } from "../items/Data.js";
import * as util from "../util.js";
import { SR6CONFIG, Enums } from "../config.js";
export class SR6CharacterSheet extends ActorSheet {
    get template() {
        return "systems/sr6/templates/actors/character.html";
    }
    get character() {
        return this.actor;
    }
    _onRollAttribute(event) {
        let target = event.currentTarget;
        let attribute = Enums.Attribute[target.dataset["attribute"]];
        this.character.rollAttribute(attribute);
    }
    _onRollSkill(event) {
        this.character.rollSkill(parseInt(event.currentTarget.dataset["skill"]));
    }
    _onRollWeapon(event) {
        let target = event.currentTarget;
        let item_id = target.dataset["itemId"];
        let item = this.actor.items.get(item_id);
        this.character.rollWeapon(item);
    }
    _onRollMatrixAction(event) {
        let target = event.currentTarget;
        let actionId = parseInt(target.dataset["matrixAction"]);
        this.character.rollMatrixAction(actionId);
    }
    activateListeners(html) {
        //console.log("SR6CharacterSheet::activateListeners");
        html.find(".roll-weapon").click(this._onRollWeapon.bind(this));
        html.find(".roll-skill").click(this._onRollSkill.bind(this));
        html.find(".roll-attribute").click(this._onRollAttribute.bind(this));
        html.find(".roll-matrix-action").click(this._onRollMatrixAction.bind(this));
        html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
            let target = event.currentTarget;
            let value = util.directDataValue(target);
            this.actor.update({
                [target.id]: value
            });
        });
        html.find("input[direct-item-data], textarea[direct-item-data], select[direct-item-data]").change((event) => {
            let target = event.currentTarget;
            let field = target.dataset["field"];
            let item = this.actor.items.get(target.dataset["itemId"]);
            if (item == null) {
                throw `Invalid Item for direct-item-data ${target} ${field} ${target.dataset["itemId"]}`;
            }
            let value = util.directDataValue(target);
            console.log("SR6CharacterSheet::direct-item-update", field, value);
            item.update({
                [field]: value
            });
        });
        html.find(".expand-skill").click(async (event) => {
            let target = event.currentTarget;
            let skillId = parseInt(target.dataset["skill"]);
            event.preventDefault();
            let special = html.find(`.special-${skillId}-collapsible`);
            let expertise = html.find(`.expertise-${skillId}-collapsible`);
            special.is(":visible") ? special.attr("style", "display: none") : special.attr("style", "");
            expertise.is(":visible") ? expertise.attr("style", "display: none") : expertise.attr("style", "");
        });
        this._activateMatrixListeners(html);
        this._activeItemListeners(html);
        this._activateActiveEffectListeners(html);
        this._drawMonitorBar(html.find(".physical-bar"), this.character.getData().monitors.physical);
        this._drawMonitorBar(html.find(".stun-bar"), this.character.getData().monitors.stun);
    }
    _activateMatrixListeners(html) {
        html.find("#activate-persona").change(async (event) => {
            if (event.currentTarget.checked) {
                // Are there any active devices? If not, error.
                let activeMatrixItems = this.actor.items.filter((i) => {
                    let item = i;
                    return item.has(GearTypes.Types.Matrix) && item.matrix.matrix_active;
                });
                if (activeMatrixItems.length < 1) {
                    ui.notifications.warn("No active matrix item to jack in to!");
                    event.currentTarget.checked = false;
                    return;
                }
                let device = activeMatrixItems[0];
                let persona = {
                    device: device.id,
                    base_attributes: device.matrix.matrix_attributes,
                    attributes: device.matrix.matrix_attributes,
                    vr_type: Enums.VRType.AR
                };
                this.actor.update({
                    ["system.matrix.persona"]: persona,
                });
            }
            else {
                this.actor.update({
                    ["system.matrix.persona"]: null,
                });
            }
        });
    }
    _activeItemListeners(html) {
        html.find(".add-item").click(async (event) => {
            let type = event.currentTarget.dataset["type"];
            let item = (await this.actor.createEmbeddedDocuments("Item", [{ name: "New " + type, type: type }]))[0];
            //effect.sheet!.render(true);
        });
        html.find(".edit-item").click(async (event) => {
            const item = this.actor.items.get(event.currentTarget.dataset["id"]);
            item.sheet.render(true);
        });
        html.find(".remove-item").click(async (event) => {
            this.actor.deleteEmbeddedDocuments("Item", [event.currentTarget.dataset["id"]]);
        });
    }
    _activateActiveEffectListeners(html) {
        html.find(".add-effect").click(async (event) => {
            const activeEffectData = {
                name: "Balls",
                origin: this.actor.id,
                duration: {
                    rounds: undefined
                },
                flags: {
                    sr6: {}
                },
                changes: []
            };
            const effect = (await this.actor.createEmbeddedDocuments("ActiveEffect", [activeEffectData]))[0];
            effect.sheet.render(true);
        });
        html.find(".edit-effect").click(async (event) => {
            const effect = this.actor.effects.get(event.currentTarget.dataset["effectId"]);
            effect.sheet.render(true);
        });
        html.find(".remove-effect").click(async (event) => {
            this.actor.deleteEmbeddedDocuments("ActiveEffect", [event.currentTarget.dataset["effectId"]]);
        });
        html.find(":input[direct-effect-data]").change((event) => {
            const target = event.currentTarget;
            const field = target.dataset["field"];
            const effect = this.actor.effects.get(target.dataset["effectId"]);
            let value;
            if (target.type == "number") {
                value = parseInt(target.value);
                if (value == undefined) {
                    value = 0;
                }
            }
            else {
                value = target.value;
            }
            effect.update({
                [field]: value
            });
        });
        html.find(".transfer-effect").click(async (event) => {
            this.actor.applyActiveEffects();
        });
        // Combat
        html.find(".activate-action").click(async (event) => {
            const target = event.currentTarget;
            const combatActionId = parseInt(target.dataset["combatActionId"]);
            const action = SR6CONFIG.combat_actions.get(combatActionId);
            let content = await renderTemplate("systems/sr6/templates/messages/combat-action.html", {
                actor: this.actor,
                action_id: combatActionId,
                action: action,
                tooltip: "Fuck your face",
                config: SR6CONFIG
            });
            ui.chat.postOne(new ChatMessage({ content: content }));
        });
    }
    _drawMonitorBar(div, attr) {
        let table = document.createElement("table");
        let width = (300 - 32) / attr.base;
        // img
        let imgUrl = "systems/sr6/icons/heart.svg";
        if (div.attr("id") == "stun-bar") {
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
            if (i < attr.pool) {
                point.setAttribute("style", `text-align: center; border-left: solid black 1px; width: ${width}px; background: #FFCCCB`);
            }
            else {
                point.setAttribute("style", `text-align: center; border-left: solid black 1px; width: ${width}px;`);
            }
            if ((i + 1) % 3 == 0) {
                let minus = -((i + 1) / 3);
                let text = document.createTextNode(`${minus}`);
                point.append(text);
            }
            point.addEventListener("click", this._setDamage.bind(this, div, attr, i + 1));
            table.append(point);
        }
        div.append(table);
    }
    _setDamage(div, attr, index) {
        //console.log("SR6CharacterSheet::_setDamage", div.attr("id"), attr, index);
        let newValue = 0;
        if (attr.pool == index) {
            newValue = 0;
        }
        else {
            newValue = index;
        }
        let field = "system.monitors.physical.pool";
        if (div.attr("id") == "stun-bar") {
            field = "system.monitors.stun.pool";
        }
        this.actor.update({ [field]: newValue });
    }
    static get defaultOptions() {
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
    getData(options) {
        let data = super.getData(options);
        data.config = SR6CONFIG;
        data.user = game.user;
        let actor = this.character;
        if (actor.inCombat) {
            let combat = game.combat;
            data.combatant = combat.getCombatantByActor(actor.id);
            data.combat_ui = {
                is_turn: actor.isCombatTurn,
                intiative_roll_class: actor.isCombatTurn ? "roll" : "roll-disabled",
                initiative_row_class: actor.isCombatTurn ? "" : "row-disabled",
                all_roll_class: ""
            };
        }
        else {
            data.combat_ui = {
                is_turn: false,
                all_roll_class: "roll-disabled",
                intiative_roll_class: "roll-disabled",
                initiative_row_class: "row-disabled"
            };
        }
        //console.log("SR6CharacterSheet::getData", data);
        return data;
    }
}
