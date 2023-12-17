export class Attribute extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			base: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true, min: 0}),
			pool: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true, min: 0}),
			modifier: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true}),
			augment: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true}),
			formula: new fields.StringField({required: false, nullable: true, blank: false}),
		}
	}
}

export class Skill extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			points: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true, min: 0, max: 9}),
			pool: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true, min: 0}),
			modifier: new fields.NumberField({initial: 0, required: true, nullable: false, integer: true}),
			specialization: new fields.StringField({required: false, nullable: true, blank: false}),
			expertise: new fields.StringField({required: false, nullable: true, blank: false}),
		}
	}
}

export class MatrixAttributes extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			matrix_attributes: new fields.SchemaField({ 
				a: new fields.StringField({initial: "0", required: true, nullable: false, blank: false}),
				s: new fields.StringField({initial: "0", required: true, nullable: false, blank: false}),
				d: new fields.StringField({initial: "0", required: true, nullable: false, blank: false}),
				f: new fields.StringField({initial: "0", required: true, nullable: false, blank: false})
			})
		}
	}
}


export class Matrix extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			current_device: new fields.DocumentIdField({required: true, nullable: true }),
			base_attributes: new fields.EmbeddedDataField(MatrixAttributes, { required: true, nullable: false  }),
			current_attributes: new fields.EmbeddedDataField(MatrixAttributes, { required: true, nullable: false }),
			monitor: new fields.EmbeddedDataField(Attribute, {
				initial: {
					base: 0,
					pool: 0,
					modifier: 0,
					augment: 0,
					formula: "(@actor.system.rating * 2)"
				}, 
				required: true, 
				nullable: false
			}),
		}
	}
}

export class EffectModifiers extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			attack_pool: new fields.NumberField({initial: 0, required: false, nullable: false, integer: true}),
			damage: new fields.NumberField({initial: 0, required: false, nullable: false, integer: true}),
			defense: new fields.NumberField({initial: 0, required: false, nullable: false, integer: true}),
			soak: new fields.NumberField({initial: 0, required: false, nullable: false, integer: true}),
		};
	}
}

export class Initiatives extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			physical_pool: new fields.NumberField({initial: 1, required: false, nullable: false, integer: true}),
			matrix_pool: new fields.NumberField({initial: 1, required: false, nullable: false, integer: true}),
			astral_pool: new fields.NumberField({initial: 1, required: false, nullable: false, integer: true}),

			physical_formula: new fields.StringField({initial: "(@actor.system.attributes.reaction.pool + @actor.system.attributes.intuition.pool) + ((@actor.system.initiatives.physical_pool)d6)", required: true, nullable: false, blank: false}),
			matrix_formula: new fields.StringField({initial: "0", required: true, nullable: false, blank: false}),
			astral_formula: new fields.StringField({initial: "0", required: true, nullable: false, blank: false}),
		};
	}
}

export class BaseActor extends foundry.abstract.DataModel {
	static _enableV10Validation = true;

	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.StringField({initial: "This is a description", required: false, blank: false}),
			rating: new fields.NumberField({initial: 1, required: false, nullable: false, integer: true, min: 0, max: 6}),
			effect_modifiers: new fields.EmbeddedDataField(EffectModifiers),
			initiatives: new fields.EmbeddedDataField(Initiatives),
		};
	}
}

export class Character extends BaseActor {
	static defineSchema() {
		const fields = foundry.data.fields;
			
		console.log("Character::defineSchema")

		return foundry.utils.mergeObject(super.defineSchema(), {
			monitors: new fields.SchemaField({ 
				physical: new fields.EmbeddedDataField(Attribute, {
					initial: {
						base: 0,
						pool: 0,
						modifier: 0,
						augment: 0,
						formula: "8 + (@actor.system.attributes.body.value / 2)"
					},
				}),
				stun: new fields.EmbeddedDataField(Attribute, {
					initial: {
						base: 0,
						pool: 0,
						modifier: 0,
						augment: 0,
						formula: "8 + (@actor.system.attributes.willpower.value / 2)"
					},
				}),
				overflow: new fields.EmbeddedDataField(Attribute),
				edge: new fields.EmbeddedDataField(Attribute),
			}),
			attributes: new fields.SchemaField({
				body: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				agility: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				reaction: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				strength: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				willpower: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				logic: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				intuition: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),
				charisma: new fields.EmbeddedDataField(Attribute, { initial: { base: 2, pool: 0, modifier: 0, augment: 0 }}),

				edge: new fields.EmbeddedDataField(Attribute, { initial: { base: 1, pool: 0, modifier: 0, augment: 0 }}),
				magic: new fields.EmbeddedDataField(Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 }}),
				resonance: new fields.EmbeddedDataField(Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 }}),
				essense: new fields.EmbeddedDataField(Attribute, { initial: { base: 6, pool: 0, modifier: 0, augment: 0 }})
			}),
			derived_attributes: new fields.SchemaField({ 
				composure: new fields.EmbeddedDataField(Attribute, { initial: { formula: "@actor.system.attributes.willpower.value + @actor.system.attributes.charisma.value", base: 0, pool: 0, modifier: 0, augment: 0 }}),
				judge_intentions: new fields.EmbeddedDataField(Attribute, { initial: { formula: "@actor.system.attributes.willpower.value + @actor.system.attributes.intuition.value", base: 0, pool: 0, modifier: 0, augment: 0 }}),
				memory: new fields.EmbeddedDataField(Attribute, { initial: { formula: "@actor.system.attributes.logic.value + @actor.system.attributes.intuition.value", base: 0, pool: 0, modifier: 0, augment: 0 }}),
				lift_carry: new fields.EmbeddedDataField(Attribute, { initial: { formula: "@actor.system.attributes.body.value + @actor.system.attributes.willpower.value", base: 0, pool: 0, modifier: 0, augment: 0 }}),
				movement: new fields.EmbeddedDataField(Attribute, { initial: { base: 0, pool: 0, modifier: 0, augment: 0 }}),
				matrix_perception: new fields.EmbeddedDataField(Attribute, { initial: { formula: "@actor.system.skills.electronics.value + @actor.system.attributes.intuition.value", base: 0, pool: 0, modifier: 0, augment: 0 }}),
			}),
			skills: new fields.SchemaField({ 
				astral: new fields.EmbeddedDataField(Skill),
				athletics: new fields.EmbeddedDataField(Skill),
				biotech: new fields.EmbeddedDataField(Skill),
				close_combat: new fields.EmbeddedDataField(Skill),
				con: new fields.EmbeddedDataField(Skill),
				conjuring: new fields.EmbeddedDataField(Skill),
				cracking: new fields.EmbeddedDataField(Skill),
				electronics: new fields.EmbeddedDataField(Skill),
				enchanting: new fields.EmbeddedDataField(Skill),
				engineering: new fields.EmbeddedDataField(Skill),
				exotic_weapons: new fields.EmbeddedDataField(Skill),
				firearms: new fields.EmbeddedDataField(Skill),
				influence: new fields.EmbeddedDataField(Skill),
				outdoors: new fields.EmbeddedDataField(Skill),
				perception: new fields.EmbeddedDataField(Skill),
				piloting: new fields.EmbeddedDataField(Skill),
				sorcery: new fields.EmbeddedDataField(Skill),
				stealth: new fields.EmbeddedDataField(Skill),
				tasking: new fields.EmbeddedDataField(Skill),
			}),
			matrix: new fields.EmbeddedDataField(Matrix)
		});
	}
}


export class MatrixIC extends BaseActor {
	static defineSchema() {
		const fields = foundry.data.fields;
		return foundry.utils.mergeObject(super.defineSchema(), {
			host: new fields.DocumentIdField({required: true, nullable: true }),
			matrix: new fields.EmbeddedDataField(Matrix),
			//initiative: new fields.StringField({initial: "(@actor.system.matrix_attributes.d * 2) + 3d6", required: true, blank: false}),
			attack_pool: new fields.StringField({initial: "@actor.system.matrix_attributes.a", required: true, blank: false}),
			defend_against_pool: new fields.StringField({initial: "@actor.system.matrix_attributes.f + @actor.system.attributes.logic.pool", required: true, blank: false}),
			damage: new fields.StringField({initial: "@actor.system.rating", required: true, blank: false})
		});
	}
}

export class MatrixHost extends BaseActor{
	static defineSchema() {
		const fields = foundry.data.fields;
		return foundry.utils.mergeObject(super.defineSchema(), {
			monitors: new fields.SchemaField({ 
				matrix: new fields.EmbeddedDataField(Attribute),
			}),
			matrix_attributes: new fields.EmbeddedDataField(MatrixAttributes),
		});
	}
}