import { Enums } from "../config.js";
export class Formula extends String {
}
export var ActorTypes;
(function (ActorTypes) {
    class Attribute {
        base = 0;
        modifier = 0;
        formula = undefined;
        augment = 0;
        pool = 0;
    }
    ActorTypes.Attribute = Attribute;
    class Skill {
        points = 0;
        pool = 0;
        specialization = null;
        expertise = null;
    }
    ActorTypes.Skill = Skill;
    class Monitors {
        physical = new Attribute();
        overflow = new Attribute();
        stun = new Attribute();
        edge = new Attribute();
    }
    ActorTypes.Monitors = Monitors;
    class DerivedAttributes {
        composure = new Attribute();
        judge_intentions = new Attribute();
        memory = new Attribute();
        lift_carry = new Attribute();
        movement = new Attribute();
        matrix_perception = new Attribute();
    }
    ActorTypes.DerivedAttributes = DerivedAttributes;
    class MatrixAttributes {
        a = 0;
        s = 0;
        d = 0;
        f = 0;
    }
    ActorTypes.MatrixAttributes = MatrixAttributes;
    class Attributes {
        body = new Attribute();
        agility = new Attribute();
        reaction = new Attribute();
        strength = new Attribute();
        willpower = new Attribute();
        logic = new Attribute();
        intuition = new Attribute();
        charisma = new Attribute();
        edge = new Attribute();
        magic = new Attribute();
        resonance = new Attribute();
        essense = new Attribute();
    }
    ActorTypes.Attributes = Attributes;
    class Skills {
        astral = new Skill();
        athletics = new Skill();
        biotech = new Skill();
        close_combat = new Skill();
        con = new Skill();
        conjuring = new Skill();
        cracking = new Skill();
        electronics = new Skill();
        enchanting = new Skill();
        engineering = new Skill();
        exotic_weapons = new Skill();
        firearms = new Skill();
        influence = new Skill();
        outdoors = new Skill();
        perception = new Skill();
        piloting = new Skill();
        sorcery = new Skill();
        stealth = new Skill();
        tasking = new Skill();
    }
    ActorTypes.Skills = Skills;
    class EffectModifiers {
        global_pool = 0;
        attack_pool = 0;
        damage = 0;
        defense = 0;
        soak = 0;
    }
    ActorTypes.EffectModifiers = EffectModifiers;
    class Matrix {
        persona = null;
    }
    ActorTypes.Matrix = Matrix;
    class MatrixPersona {
        device = null;
        base_attributes = new MatrixAttributes();
        attributes = new MatrixAttributes();
        vr_type = Enums.VRType.AR;
    }
    ActorTypes.MatrixPersona = MatrixPersona;
})(ActorTypes || (ActorTypes = {}));
export class CharacterActorData {
    initiatives = {
        die: {
            physical: 1,
            matrix: 1,
            astral: 1
        },
        actions: {
            major: 1,
            minor: 1
        },
        physical_formula: undefined,
        matrix_formula: undefined,
        astral_formula: undefined
    };
    karma = 0;
    monitors = new ActorTypes.Monitors();
    attributes = new ActorTypes.Attributes();
    derived_attributes = new ActorTypes.DerivedAttributes();
    skills = new ActorTypes.Skills();
    effect_modifiers = new ActorTypes.EffectModifiers();
    matrix = new ActorTypes.Matrix();
}
