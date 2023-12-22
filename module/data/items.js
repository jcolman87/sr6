import { Enums } from "../config.js";
//import Spell from "./spell.js";
//export { Spell };
export class Credstick extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 6 }),
            capacity: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            nuyen: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            sin: new fields.StringField({ required: false, blank: false })
        };
    }
}
export class SIN extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 6 })
        };
    }
}
export class Lifestyle extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 6 }),
            cost: new fields.NumberField({ initial: 0, required: true }),
            months_paid: new fields.NumberField({ initial: 1, required: true }),
            sin: new fields.DocumentIdField({ required: true, nullable: true }),
        };
    }
}
export class Contact extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            type: new fields.StringField({ initial: "This is a type", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12 }),
            loyalty: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12 })
        };
    }
}
export class WeaponAccessory extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12 }),
            locations: new fields.ArrayField(new fields.StringField({
                choices: () => {
                    let choices = [];
                    Object.keys(Enums.WeaponAttachmentLocation)
                        .filter((v) => isNaN(Number(v)))
                        .forEach((key, index) => choices.push(key));
                    return choices;
                }
            }), { initial: [], required: true, nullable: false }),
            attached_to: new fields.DocumentIdField({ required: true, nullable: true }),
        };
    }
}
export class Augmentation extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 1, max: 12 }),
            quality: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 1, max: 5 }),
            essense_cost: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: false, min: 0, max: 12 })
        };
    }
}
export class Quality extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false })
        };
    }
}
export class AdeptPower extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true }),
            activation: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 3 })
        };
    }
}
export class Spell extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: true, blank: false }),
            drain: new fields.NumberField({ initial: 1, required: true, nullable: false, integer: true, min: 0, max: 99 }),
            range: new fields.SchemaField({
                type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 2 }),
                value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true })
            }, { required: true, nullable: false }),
            duration: new fields.SchemaField({
                type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 3 }),
                value: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true })
            }, { required: true, nullable: false }),
            damage: new fields.SchemaField({
                combat: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 }),
                type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 }),
                form: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 })
            }, { required: true, nullable: true })
        };
    }
}
