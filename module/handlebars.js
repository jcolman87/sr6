import { ItemTypes } from "./items/Data.js";
import { SR6CONFIG, Enums } from "./config.js";
export function defineHandlebarHelpers() {
    Handlebars.registerHelper("bold", function (options) {
        return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
    });
    ////
    Handlebars.registerHelper("itemHas", function (item, ty_str) {
        return item.has(ItemTypes.Types[ty_str]);
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
    Handlebars.registerHelper("attributeAsString", function (ty) {
        return Enums.Attribute[ty];
    });
    Handlebars.registerHelper("skillAsString", function (ty) {
        return Enums.Skill[ty];
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
        console.log("ty", ty, Enums.Specialization[ty]);
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
    Handlebars.registerHelper("specializationsOfSkill", function (ty) {
        console.log("specializationsOfSkill", ty, SR6CONFIG.skills.get(ty).specializations);
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
        options.data.root[varName] = varValue;
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
}
