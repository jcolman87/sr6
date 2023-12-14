import { SR6CONFIG } from "../config.js";
export class SR6CharacterSheet extends ActorSheet {
    _onRollFormula(event) {
        let target = event.currentTarget;
        let formula = target.dataset["pool"];
        this.actor.rollFormula(formula);
    }
    _onRollWeapon(event) {
        let target = event.currentTarget;
        let item_id = target.dataset["itemId"];
        let item = this.actor.items.get(item_id);
        this.actor.rollWeapon(item);
    }
    activateListeners(html) {
        html.find(".roll-weapon").click(this._onRollWeapon.bind(this));
        html.find(".roll-formula").click(this._onRollFormula.bind(this));
        html.find(":input[direct-data]").change((event) => {
            let target = event.currentTarget;
            //console.log("SR6CharacterSheet::change - ", target.id, target.value);
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
            this.actor.update({
                [target.id]: value
            });
        });
    }
    get template() {
        return "systems/sr6/templates/actors/character.html";
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["shadowrun6", "sheet", "actor"],
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
        //console.log("SR6CharacterSheet::getData", data);
        return data;
    }
}
