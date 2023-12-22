import { GearTypes } from "./items/Data.js";
import { SR6CONFIG, Enums } from "./config.js";
export function defineHandlebarHelpers() {
    Handlebars.registerHelper("isGM", function (user_id) {
        return game.user.isGM;
    });
    Handlebars.registerHelper("bold", function (options) {
        return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
    });
    ////
    Handlebars.registerHelper("itemHas", function (item, ty_str) {
        return item.has(GearTypes.Types[ty_str]);
    });
    Handlebars.registerHelper("solveActorFormula", function (actor, formula) {
        return actor.solveFormula(formula);
    });
    Handlebars.registerHelper("solveItemFormula", function (item, formula) {
        return item.solveFormula(formula);
    });
    Handlebars.registerHelper("solveActorItemFormula", function (actor, item, formula) {
        return item.solveFormulaWithActor(actor, formula);
    });
    Handlebars.registerHelper("getSkill", function (actor, ty) {
        return actor.getSkill(ty);
    });
    Handlebars.registerHelper("getAttackRating", function (item, distance) {
        return item.getAttackRating(distance);
    });
    Handlebars.registerHelper("canUseEdgeBoost", function (boost_id, activation, roll) {
        return SR6CONFIG.edge_boosts.get(boost_id).condition(activation, roll);
    });
    Handlebars.registerHelper("attributeAsString", function (ty) {
        return Enums.Attribute[ty];
    });
    Handlebars.registerHelper("skillAsString", function (ty) {
        return Enums.Skill[ty];
    });
    Handlebars.registerHelper("combatActionAsString", function (ty) {
        return Enums.CombatAction[ty];
    });
    Handlebars.registerHelper("skillUseAsString", function (ty) {
        if (ty.specialization) {
            return Enums.Specialization[ty.specialization];
        }
        else {
            return Enums.Skill[ty.skill];
        }
    });
    Handlebars.registerHelper("specializationAsString", function (ty) {
        return Enums.Specialization[ty];
    });
    Handlebars.registerHelper("distanceToString", function (ty) {
        return Enums.Distance[ty];
    });
    Handlebars.registerHelper("matrixProgramAsString", function (ty) {
        return Enums.MatrixProgram[ty];
    });
    Handlebars.registerHelper("matrixActionAsString", function (ty) {
        return Enums.MatrixAction[ty];
    });
    Handlebars.registerHelper("edgeBoostAsString", function (ty) {
        return Enums.EdgeBoost[ty];
    });
    Handlebars.registerHelper("specializationsOfSkill", function (ty) {
        return SR6CONFIG.skills.get(ty).specializations;
    });
    Handlebars.registerHelper("in", function (elem, list, options) {
        if (Array.isArray(list)) {
            let res = list.includes(elem);
            return res;
        }
        else if (list instanceof Map) {
            return list.has(elem);
        }
    });
    Handlebars.registerHelper("var", function (varName, varValue, options) {
        this[varName] = varValue;
    });
    Handlebars.registerHelper("add", function (a, b) {
        return +a + +b;
    });
    Handlebars.registerHelper("sub", function (a, b) {
        return +a - +b;
    });
    Handlebars.registerHelper("gt", function (a, b) {
        return +a >= +b;
    });
    Handlebars.registerHelper("undefined", function (a) {
        return a == undefined;
    });
    Handlebars.registerHelper("isNull", function (a) {
        return a == null;
    });
    Handlebars.registerHelper("null", function (a) {
        return a == null;
    });
    Handlebars.registerHelper("ifBoth", function (a, b) {
        return a && b;
    });
    Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
        switch (operator) {
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "!==":
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
    Handlebars.registerHelper('times', function (n, block) {
        var accum = '';
        for (var i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
    Handlebars.registerHelper("eachMap", function (map, block) {
        var out = "";
        map.forEach((value, key) => {
            out += block.fn({ key: key, value: value });
        });
        return out;
    });
    Handlebars.registerHelper("localizeName", function (root, name) {
        return game.i18n.localize(`${root}.${name}.name`);
    });
    Handlebars.registerHelper("localizeDescription", function (root, name) {
        return game.i18n.localize(`${root}.${name}.description`);
    });
}
