import { SR6CONFIG, EffectChangeMode, Enums } from "./config.js";
export function getGlobalPoolModifier(actor) {
    return +actor.wound_modifier + +actor.getData().effect_modifiers.global_pool;
}
export var EdgeBoosts;
(function (EdgeBoosts) {
    let buy_auto_hit;
    (function (buy_auto_hit) {
        async function prepareData(roll) {
            roll.auto_hits = 1;
        }
        buy_auto_hit.prepareData = prepareData;
        async function apply(roll) {
            return prepareData(roll.data);
        }
        buy_auto_hit.apply = apply;
    })(buy_auto_hit = EdgeBoosts.buy_auto_hit || (EdgeBoosts.buy_auto_hit = {}));
    let plus_1_roll;
    (function (plus_1_roll) {
        async function apply(roll) {
            await roll.addOne();
        }
        plus_1_roll.apply = apply;
    })(plus_1_roll = EdgeBoosts.plus_1_roll || (EdgeBoosts.plus_1_roll = {}));
    let reroll_one;
    (function (reroll_one) {
        async function apply(roll) {
            await roll.rerollOne();
        }
        reroll_one.apply = apply;
    })(reroll_one = EdgeBoosts.reroll_one || (EdgeBoosts.reroll_one = {}));
    let add_edge_pool;
    (function (add_edge_pool) {
        async function prepareData(roll) {
            roll.pool += roll.getActor().getAttribute(Enums.Attribute.edge).pool;
            roll.explode = true;
        }
        add_edge_pool.prepareData = prepareData;
        async function apply(roll) {
            console.log("Rules::EdgeBoosts::apply::apply");
        }
        add_edge_pool.apply = apply;
    })(add_edge_pool = EdgeBoosts.add_edge_pool || (EdgeBoosts.add_edge_pool = {}));
    let reroll_failed;
    (function (reroll_failed) {
        async function apply(roll) {
            await roll.rerollFailed();
        }
        reroll_failed.apply = apply;
    })(reroll_failed = EdgeBoosts.reroll_failed || (EdgeBoosts.reroll_failed = {}));
})(EdgeBoosts || (EdgeBoosts = {}));
export var Magic;
(function (Magic) {
    function calcSpellAttackPool(actor, spell, apply_modifiers = true) {
        return +actor.getSkill(Enums.Skill.sorcery).pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
    }
    Magic.calcSpellAttackPool = calcSpellAttackPool;
    function calcSpellDrainPool(actor, spell, apply_modifiers = true) {
        // TODO: school of magic
        return +actor.getAttribute(Enums.Attribute.logic).pool + +actor.getAttribute(Enums.Attribute.willpower).pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
    }
    Magic.calcSpellDrainPool = calcSpellDrainPool;
    function calcSpellDefensePool(actor, spell, apply_modifiers = true) {
        if (spell.damage == null) {
            return 0;
        }
        let damage = 0;
        switch (spell.damage.combat) {
            case Enums.SpellCombatType.Direct: {
                damage = (actor.getAttribute(Enums.Attribute.willpower).pool + actor.getAttribute(Enums.Attribute.intuition).pool);
                break;
            }
            case Enums.SpellCombatType.Indirect: {
                damage = (actor.getAttribute(Enums.Attribute.reaction).pool + actor.getAttribute(Enums.Attribute.willpower).pool);
                break;
            }
        }
        return +damage + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
    }
    Magic.calcSpellDefensePool = calcSpellDefensePool;
    function calcSpellStartingDamage(actor, spell) {
        if (spell.damage == null) {
            return 0;
        }
        switch (spell.damage.combat) {
            case Enums.SpellCombatType.Direct: {
                return 0;
                break;
            }
            case Enums.SpellCombatType.Indirect: {
                return Math.ceil(actor.getAttribute(Enums.Attribute.magic).pool / 2);
                break;
            }
        }
        return 0;
    }
    Magic.calcSpellStartingDamage = calcSpellStartingDamage;
})(Magic || (Magic = {}));
export function calcMatrixDefensePool(actor, matrix_action, apply_modifiers = true) {
    let action = SR6CONFIG.matrix_actions.get(matrix_action);
    let pool = actor.solveFormula(action.defendAgainstFormula);
    return +pool + +(apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}
export function calcWeaponPool(actor, item) {
    let skill_use = item.skill_use;
    if (!skill_use)
        return 0;
    let pool = calcSkillPool(actor, skill_use);
    pool += +actor.getData().effect_modifiers.attack_pool;
    return pool;
}
export function calcWeaponDamage(actor, weapon, apply_modifiers = true) {
    let modifiers = 0;
    if (apply_modifiers) {
        modifiers += +actor.getData().effect_modifiers.damage;
    }
    return +weapon.damage + +modifiers;
}
export function calcDefensePool(actor, apply_modifiers = true) {
    let reaction = actor.getAttribute(Enums.Attribute.reaction);
    let intuition = actor.getAttribute(Enums.Attribute.intuition);
    let modifiers = 0;
    if (apply_modifiers) {
        modifiers += getGlobalPoolModifier(actor);
        modifiers += +actor.getData().effect_modifiers.defense;
    }
    return +reaction.pool + +intuition.pool + +modifiers;
}
export function calcSoakPool(actor, apply_modifiers = true) {
    let body = actor.getAttribute(Enums.Attribute.body);
    return +body.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}
export function getFiremodeModifiers(firemode) {
    switch (firemode) {
        case Enums.FireMode.SS:
            return [];
        case Enums.FireMode.SA:
            return [
                { key: "damage", mode: EffectChangeMode.ADD, value: "1" },
                { key: "attack_rating", mode: EffectChangeMode.ADD, value: "-2" }
            ];
        case Enums.FireMode.BF_narrow:
            return [
                { key: "damage", mode: EffectChangeMode.ADD, value: "2" },
                { key: "attack_rating", mode: EffectChangeMode.ADD, value: "-4" }
            ];
        case Enums.FireMode.FA:
            return [{ key: "attack_rating", mode: EffectChangeMode.ADD, value: "-6" }];
    }
    return [];
}
export function calcSkillPool(actor, skill_use, apply_modifiers = true) {
    let modifiers = 0;
    let skill = actor.getSkill(skill_use.skill);
    if (skill_use.specialization) {
        if (skill.specialization == skill_use.specialization) {
            modifiers = 2;
        }
        else if (skill.expertise == skill_use.specialization) {
            modifiers = 3;
        }
    }
    return +skill.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}
export function calcAttributePool(actor, attr_id, apply_modifiers = true) {
    let modifiers = 0;
    let attribute = actor.getAttribute(attr_id);
    return +attribute.pool + (apply_modifiers ? getGlobalPoolModifier(actor) : 0);
}
