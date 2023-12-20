export class SkillUse extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            skill: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            specialization: new fields.NumberField({ initial: null, required: true, nullable: true, integer: true })
        };
    }
}
export class Attribute extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            base: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
            pool: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
            modifier: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            augment: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            formula: new fields.StringField({ required: false, nullable: true, blank: false })
        };
    }
}
export class Skill extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            points: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9 }),
            pool: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
            modifier: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true }),
            specialization: new fields.NumberField({ required: true, nullable: true }),
            expertise: new fields.NumberField({ required: true, nullable: true })
        };
    }
}
export class EffectModifiers extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            global_pool: new fields.NumberField({ initial: 0, required: false, nullable: false, integer: true }),
            attack_pool: new fields.NumberField({ initial: 0, required: false, nullable: false, integer: true }),
            damage: new fields.NumberField({ initial: 0, required: false, nullable: false, integer: true }),
            defense: new fields.NumberField({ initial: 0, required: false, nullable: false, integer: true }),
            soak: new fields.NumberField({ initial: 0, required: false, nullable: false, integer: true })
        };
    }
}
export class Initiatives extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            die: new fields.SchemaField({
                physical: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
                matrix: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true }),
                astral: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true })
            }),
            physical_formula: new fields.StringField({
                initial: "(@actor.system.attributes.reaction.pool + @actor.system.attributes.intuition.pool) + ((@actor.system.initiatives.die.physical)d6)",
                required: true,
                nullable: false,
                blank: false
            }),
            matrix_formula: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            astral_formula: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            actions: new fields.SchemaField({
                major: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true, min: 1 }),
                minor: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true, min: 1 })
            })
        };
    }
}
export class MatrixAttributes extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            a: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            s: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            d: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            f: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false })
        };
    }
}
export class AttackRatings extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            close: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            near: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            medium: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            far: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false }),
            extreme: new fields.StringField({ initial: "0", required: true, nullable: false, blank: false })
        };
    }
}
export class MatrixPersona extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            device: new fields.DocumentIdField({ required: true, nullable: true }),
            base_attributes: new fields.EmbeddedDataField(MatrixAttributes, { required: true, nullable: false }),
            attributes: new fields.EmbeddedDataField(MatrixAttributes, { required: true, nullable: false }),
            vr_type: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0, max: 2 })
        };
    }
}
