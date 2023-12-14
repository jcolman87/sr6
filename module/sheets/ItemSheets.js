import { ItemTypes } from "../items/Data.js";
import { SR6CONFIG } from "../config.js";
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
        html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
            let target = event.currentTarget;
            //console.log("SR6ItemSheet::change - ", target.id, target.value);
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
            this.item.update({
                [target.id]: value
            });
        });
    }
    get template() {
        return "systems/sr6/templates/items/base.html";
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["shadowrun6", "sheet", "item"],
            width: 550
        });
    }
    getData(options) {
        let data = super.getData(options);
        data.config = SR6CONFIG;
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
