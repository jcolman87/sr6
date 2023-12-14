import { ItemTypes } from "./items/Data.js";
import { Enums } from "./config.js";
export function defineHandlebarHelpers() {
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
    Handlebars.registerHelper("matrixProgramAsString", function (ty) {
        return Enums.MatrixProgram[ty];
    });
    Handlebars.registerHelper("matrixActionAsString", function (ty) {
        return Enums.MatrixAction[ty];
    });
    Handlebars.registerHelper("in", function (elem, list, options) {
        if (Array.isArray(list)) {
            return list.includes(elem);
        }
        else if (list instanceof Map) {
            return list.has(elem);
        }
    });
    Handlebars.registerHelper("isRollType", function (val, ty) {
        return val == Enums.RollType[ty];
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
