import { ItemTypes } from "../items/Data.js";
import { SR6CONFIG } from "../config.js";
import * as util from "../util.js";
export class SR6ItemSheet extends ItemSheet {
    _onAddType(event) {
        let target = event.currentTarget;
        let ty_str = target.dataset["addType"];
        let ty = parseInt(ItemTypes.Types[ty_str]);
        this.item.addType(ty);
    }
    _onRemoveType(event) {
        let target = event.currentTarget;
        let ty_str = target.dataset["removeType"];
        let ty = parseInt(ItemTypes.Types[ty_str]);
        this.item.removeType(ty);
    }
    activateListeners(html) {
        html.find(".add-type").click(this._onAddType.bind(this));
        html.find(".remove-type").click(this._onRemoveType.bind(this));
        html.find("input[direct-data-array]").change((event) => {
            let target = event.currentTarget;
            //console.log("SR6ItemSheet::change - ", target.id, target.value);
            let data = this.item.system;
            let array = data[target.id];
            if (target.checked) {
                array.push(target.value);
            }
            else {
                array = array.filter((v) => v !== target.value);
            }
            this.item.update({
                ["system." + target.id]: array
            });
        });
        html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
            let target = event.currentTarget;
            let value = util.directDataValue(target);
            this.item.update({
                [target.id]: value
            });
        });
        this._activateActiveEffectListeners(html);
    }
    _activateActiveEffectListeners(html) {
        html.find(".add-effect").click(async (event) => {
            const activeEffectData = {
                name: "Balls",
                origin: this.item.id,
                duration: {
                    rounds: undefined
                },
                flags: {
                    sr6: {}
                },
                changes: []
            };
            let effect = (await this.item.createEmbeddedDocuments("ActiveEffect", [activeEffectData]))[0];
            effect.sheet.render(true);
        });
        html.find(".edit-effect").click((event) => {
            let effect = this.item.effects.get(event.currentTarget.dataset["effectId"]);
            effect.sheet.render(true);
        });
        html.find(".remove-effect").click((event) => {
            this.item.deleteEmbeddedDocuments("ActiveEffect", [event.currentTarget.dataset["effectId"]]);
        });
        html.find(":input[direct-effect-data]").change((event) => {
            let target = event.currentTarget;
            let target_effect_id = target.dataset["effectId"];
            let field = target.dataset["field"];
            //console.log("SR6CharacterSheet::change - ", target.id, target.value);
            let effect = this.item.effects.get(target_effect_id);
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
        html.find(".add-effect-change").click((event) => {
            let id = event.currentTarget.dataset["effectId"];
        });
        html.find(".remove-effect-change").click((event) => {
            let effect_id = event.currentTarget.dataset["effectId"];
            let change_idx = parseInt(event.currentTarget.dataset["effectId"]);
            //let effect: ActiveEffect = this.actor.effects.get(effect_id)!;
            //effect.changes.splice(change_idx, 1);
            //effect.update({["changes"]: effect.changes });
        });
    }
    get template() {
        return "systems/sr6/templates/items/base.html";
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sr6", "sheet", "item"],
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "basics"
                }
            ],
            width: 550
        });
    }
    getData(options) {
        let data = super.getData(options);
        data.config = SR6CONFIG;
        data.user = game.user;
        //console.log("SR6ItemSheet::getData", data);
        return data;
    }
}
export class SINSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/sin.html";
    }
}
export class LifestyleSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/lifestyle.html";
    }
}
export class ContactSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/contact.html";
    }
}
export class AugmentationSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/augmentation.html";
    }
}
export class QualitySheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/quality.html";
    }
}
export class SpellSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/spell.html";
    }
}
export class WeaponAccessorySheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/weapon-accessory.html";
    }
}
export class AdeptPowerSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/adept-power.html";
    }
}
export class CredstickSheet extends SR6ItemSheet {
    get template() {
        return "systems/sr6/templates/items/credstick.html";
    }
}
