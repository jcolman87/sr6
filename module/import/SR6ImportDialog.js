import { SR6Dialog } from "../dialogs/SR6Dialog.js";
import { Enums } from "../config.js";
export default class SR6MatrixRollDialog extends SR6Dialog {
    get template() {
        return "systems/sr6/templates/dialogs/SR6ImportDialog.html";
    }
    constructor() {
        super({}, {});
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("#pick-file").click(async (event) => {
            let picker = await new FilePicker({
                callback: async (path) => {
                    await this._onImportGenesisActor(path);
                },
            }).render(true);
        });
    }
    async _onImportGenesisActor(path) {
        const response = await fetch(path);
        const json = await response.json();
        json.attr = (name) => {
            return json.attributes.find((a) => a.id == name.toUpperCase());
        };
        json.skill = (name) => {
            return json.skills.find((a) => a.id == name.toLowerCase());
        };
        let actor = await Actor.create({
            name: json.streetName,
            type: "Player",
        });
        if (actor == undefined) {
            ui.notifications.error("import failed to create actor");
            return;
        }
        let data = actor.getData();
        console.log("actor", actor, actor.getData());
        data.name = json.streetName;
        //data.realName = json.name;
        Object.keys(data.attributes).forEach((name) => {
            const value = json.attr(name);
            if (value != undefined) {
                data.attributes[name].base = value.points;
                data.attributes[name].modifier = value.modifiedValue - value.points;
            }
            else {
                console.log("missing attr:", name);
            }
        });
        Object.keys(data.skills).forEach((name) => {
            const value = json.skill(name);
            if (value != undefined) {
                console.log("setting skill", name);
                data.skills[name].points = value.rating;
                value.specializations.forEach((special) => {
                    let special_id = Enums.Specialization[special.id.toLowerCase()];
                    if (special_id == undefined) {
                        console.log("Invalid special?", special);
                    }
                    else {
                        if (special.expertise) {
                            console.log("setting expertise", special.id);
                            data.skills[name].expertise = special_id;
                        }
                        else {
                            console.log("setting specialization", special.id);
                            data.skills[name].specialization = special_id;
                        }
                    }
                });
            }
        });
        json.longRangeWeapons.forEach(async (value) => {
            // Find the weapon and clone it
            let base = game.items.getName(value.name);
            if (base == null) {
                ui.notifications.error("We dont have this weapon!?", value);
                console.error("missing weapon", value);
                // TODO:
            }
            else {
                let weapon = (await actor.createEmbeddedDocuments("Item", [{
                        "name": value.name,
                        "type": "Gear",
                        "system": base.getData(),
                    }]))[0];
                console.log("weapon id = ", weapon.id);
                let accessory_items = await actor.createEmbeddedDocuments("Item", Array.from(value.accessories.map((ass_val) => {
                    return {
                        "name": ass_val.name,
                        "type": "WeaponAccessory",
                        "system": {
                            "description": ass_val.description,
                            "rating": ass_val.rating,
                            "attached_to": weapon.id,
                        },
                    };
                })));
                let attachments = [];
                for (let i = 0; i < accessory_items.length; i++) {
                    attachments.push(accessory_items[i].id);
                }
                console.log("attachments,", attachments);
            }
            ;
        });
        json.matrixItems.forEach(async (value) => {
            console.log("Creating", value.name);
            if (value.type == "CYBERWARE") {
                return;
            }
            await actor.createEmbeddedDocuments("Item", [{
                    "name": value.name,
                    "type": "Gear",
                    "system": {
                        "types": 18,
                        "matrix_attributes": {
                            "a": value.attack.toString(),
                            "s": value.sleaze.toString(),
                            "d": value.dataProcessing.toString(),
                            "f": value.firewall.toString()
                        }
                    },
                }]);
        });
        await actor.createEmbeddedDocuments("Item", Array.from(json.qualities
            .filter((value) => {
            switch (value.name) {
                case "Technomancer": {
                    data.magic.type = Enums.MagicType.Technomancer;
                    return false;
                }
                case "Mystic Adept": {
                    data.magic.type = Enums.MagicType.Technomancer;
                    return false;
                }
                case "Adept": {
                    data.magic.type = Enums.MagicType.Technomancer;
                    return false;
                }
                case "Magician": {
                    data.magic.type = Enums.MagicType.Full;
                    data.magic.tradition = Enums.MagicTradition.Hermetic;
                    return false;
                }
                // TODO:
            }
            return true;
        })
            .map((value) => {
            return {
                "name": value.name,
                "type": "Quality",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": value.page,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.adeptPowers.map((value) => {
            let activation = Enums.Activation.Passive;
            if (value.activation == "MINOR_ACTION") {
                activation = Enums.Activation.Minor;
            }
            else if (value.activation == "MAJOR_ACTION") {
                activation = Enums.Activation.Major;
            }
            return {
                "name": value.name,
                "type": "AdeptPower",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": value.page,
                    "rating": value.level,
                    activation: activation,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.lifestyles.map((value) => {
            return {
                "name": value.customName,
                "type": "Lifestyle",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": value.sin + "\n" + value.description,
                    "rating": Enums.Lifestyle[value.name],
                    "months_paid": value.paidMonths,
                    "cost": value.cost,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.sins.map((value) => {
            return {
                "name": value.name,
                "type": "SIN",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": (value.description != undefined) ? value.description : "No description!",
                    "rating": value.quality,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.contacts.map((value) => {
            return {
                "name": (value.name != undefined) ? value.name : "No Name!",
                "type": "Contact",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": (value.description != undefined) ? value.description : "No description!",
                    "rating": value.influence,
                    "loyalty": value.level,
                    "type": value.type,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.augmentations.map((value) => {
            let quality = 1;
            let rating = 1;
            if (value.level == "-") {
                rating = 1;
            }
            else {
                rating = parseInt(value.level);
            }
            if (value.quality == "ALPHA") {
                quality = 3;
            }
            return {
                "name": value.name,
                "type": "Augmentation",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": value.page,
                    "rating": rating,
                    "quality": quality,
                    "essense_cost": value.essence,
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", Array.from(json.spells.map((value) => {
            let range_type = Enums.SpellRangeType.Touch;
            if (value.range.indexOf("Line of sight") != -1) {
                range_type = Enums.SpellRangeType.LineOfSight;
            }
            let duration_type = Enums.SpellDurationType[value.duration];
            return {
                "name": value.name,
                "type": "Spell",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": value.page,
                    "drain": value.drain,
                    "range": {
                        "type": range_type,
                        "value": 1
                    },
                    "duration": {
                        "type": 0,
                        "value": 1
                    },
                    "damage": {
                        "combat": 0,
                        "type": 0,
                        "form": 0
                    }
                }
            };
        })));
        await actor.createEmbeddedDocuments("Item", [{
                "name": "Silver Credstick",
                "type": "Credstick",
                "img": "icons/svg/item-bag.svg",
                "system": {
                    "description": "",
                    "rating": 2,
                    "capacity": 20000,
                    "nuyen": json.nuyen
                }
            }]);
        actor.update({ ["system"]: data });
        this.close();
    }
}
