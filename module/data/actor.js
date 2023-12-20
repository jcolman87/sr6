import * as shared from "./shared.js";
export class BaseActor extends foundry.abstract.DataModel {
    static _enableV10Validation = true;
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField({ initial: "This is a description", required: false, blank: false }),
            rating: new fields.NumberField({ initial: 1, required: false, nullable: false, integer: true, min: 0, max: 6 }),
            effect_modifiers: new fields.EmbeddedDataField(shared.EffectModifiers),
            initiatives: new fields.EmbeddedDataField(shared.Initiatives),
        };
    }
}
export class Character extends BaseActor {
    static defineSchema() {
        const fields = foundry.data.fields;
        console.log("Character::defineSchema");
        return foundry.utils.mergeObject(super.defineSchema(), {
            karma: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
            monitors: new fields.SchemaField({
                physical: new fields.EmbeddedDataField(shared.Attribute, {
                    initial: {
                        base: 0,
                        pool: 0,
                        modifier: 0,
                        augment: 0,
                        formula: "8 + (@actor.system.attributes.body.pool / 2)"
                    },
                }),
                stun: new fields.EmbeddedDataField(shared.Attribute, {
                    initial: {
                        base: 0,
                        pool: 0,
                        modifier: 0,
                        augment: 0,
                        formula: "8 + (@actor.system.attributes.willpower.pool / 2)"
                    },
                }),
                overflow: new fields.EmbeddedDataField(shared.Attribute),
                edge: new fields.EmbeddedDataField(shared.Attribute, {
                    initial: {
                        base: 0,
                        pool: 0,
                        modifier: 0,
                        augment: 0,
                        formula: "@actor.system.attributes.edge.pool"
                    },
                }),
            }),
            attributes: new fields.SchemaField({
                body: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                agility: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                reaction: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                strength: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                willpower: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                logic: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                intuition: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                charisma: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 } }),
                edge: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 1, pool: 0, modifier: 0, augment: 0 } }),
                magic: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 } }),
                resonance: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 } }),
                essense: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 6, pool: 0, modifier: 0, augment: 0 } })
            }),
            derived_attributes: new fields.SchemaField({
                composure: new fields.EmbeddedDataField(shared.Attribute, { initial: { formula: "@actor.system.attributes.willpower.pool + @actor.system.attributes.charisma.pool", base: 0, pool: 0, modifier: 0, augment: 0 } }),
                judge_intentions: new fields.EmbeddedDataField(shared.Attribute, { initial: { formula: "@actor.system.attributes.willpower.pool + @actor.system.attributes.intuition.pool", base: 0, pool: 0, modifier: 0, augment: 0 } }),
                memory: new fields.EmbeddedDataField(shared.Attribute, { initial: { formula: "@actor.system.attributes.logic.pool + @actor.system.attributes.intuition.pool", base: 0, pool: 0, modifier: 0, augment: 0 } }),
                lift_carry: new fields.EmbeddedDataField(shared.Attribute, { initial: { formula: "@actor.system.attributes.body.pool + @actor.system.attributes.willpower.pool", base: 0, pool: 0, modifier: 0, augment: 0 } }),
                movement: new fields.EmbeddedDataField(shared.Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 } }),
                matrix_perception: new fields.EmbeddedDataField(shared.Attribute, { initial: { formula: "@actor.system.skills.electronics.pool + @actor.system.attributes.intuition.pool", base: 0, pool: 0, modifier: 0, augment: 0 } }),
            }),
            skills: new fields.SchemaField({
                astral: new fields.EmbeddedDataField(shared.Skill),
                athletics: new fields.EmbeddedDataField(shared.Skill),
                biotech: new fields.EmbeddedDataField(shared.Skill),
                close_combat: new fields.EmbeddedDataField(shared.Skill),
                con: new fields.EmbeddedDataField(shared.Skill),
                conjuring: new fields.EmbeddedDataField(shared.Skill),
                cracking: new fields.EmbeddedDataField(shared.Skill),
                electronics: new fields.EmbeddedDataField(shared.Skill),
                enchanting: new fields.EmbeddedDataField(shared.Skill),
                engineering: new fields.EmbeddedDataField(shared.Skill),
                exotic_weapons: new fields.EmbeddedDataField(shared.Skill),
                firearms: new fields.EmbeddedDataField(shared.Skill),
                influence: new fields.EmbeddedDataField(shared.Skill),
                outdoors: new fields.EmbeddedDataField(shared.Skill),
                perception: new fields.EmbeddedDataField(shared.Skill),
                piloting: new fields.EmbeddedDataField(shared.Skill),
                sorcery: new fields.EmbeddedDataField(shared.Skill),
                stealth: new fields.EmbeddedDataField(shared.Skill),
                tasking: new fields.EmbeddedDataField(shared.Skill),
            })
        });
    }
}
export class MatrixIC extends BaseActor {
    static defineSchema() {
        const fields = foundry.data.fields;
        return foundry.utils.mergeObject(super.defineSchema(), {
            host: new fields.DocumentIdField({ required: true, nullable: true }),
            matrix_attributes: new fields.EmbeddedDataField(shared.MatrixAttributes),
            //initiative: new fields.StringField({initial: "(@actor.system.matrix_attributes.d * 2) + 3d6", required: true, blank: false}),
            attack_pool: new fields.StringField({ initial: "@actor.system.matrix_attributes.a", required: true, blank: false }),
            defend_against_pool: new fields.StringField({ initial: "@actor.system.matrix_attributes.f + @actor.system.attributes.logic.pool", required: true, blank: false }),
            damage: new fields.StringField({ initial: "@actor.system.rating", required: true, blank: false })
        });
    }
}
export class MatrixHost extends BaseActor {
    static defineSchema() {
        const fields = foundry.data.fields;
        return foundry.utils.mergeObject(super.defineSchema(), {
            monitors: new fields.SchemaField({
                matrix: new fields.EmbeddedDataField(shared.Attribute),
            }),
            matrix_attributes: new fields.EmbeddedDataField(shared.MatrixAttributes),
        });
    }
}
