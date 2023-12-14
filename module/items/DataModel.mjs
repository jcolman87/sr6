export class ProgramDataModel extends BaseItemDataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            rating: new fields.NumberField({
                required: true,
                initial: 1,
                min: 1,
                max: 20,
                integer: true
            }),
            size: new fields.NumberField({
                required: true,
                initial: 4,
                min: 0,
                max: 10,
                integer: true
            }),
            types: new fields.NumberField({
                required: true,
                initial: 0,
                integer: true
            })
        };
    }
}
export class BaseItemDataModel extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            rating: new fields.NumberField({
                required: true,
                initial: 1,
                min: 1,
                max: 20,
                integer: true
            }),
            size: new fields.NumberField({
                required: true,
                initial: 4,
                min: 0,
                max: 10,
                integer: true
            }),
            types: new fields.NumberField({
                required: true,
                initial: 0,
                integer: true
            })
        };
    }
}
