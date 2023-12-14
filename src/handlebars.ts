import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6Item } from "./items/SR6Item.js";
import { ItemTypes } from "./items/Data.js";
import { Enums } from "./config.js";

export function defineHandlebarHelpers() {
	Handlebars.registerHelper("itemHas", function (item: SR6Item, ty_str: string) {
		return item.has(ItemTypes.Types[ty_str as keyof typeof ItemTypes.Types]);
	});

	Handlebars.registerHelper("solveActorFormula", function (actor: SR6Actor, formula: string) {
		return actor.solveFormula(formula);
	});

	Handlebars.registerHelper("solveItemFormula", function (item: SR6Item, formula: string) {
		return item.solveFormula(formula);
	});

	Handlebars.registerHelper("solveActorItemFormula", function (actor: SR6Actor, item: SR6Item, formula: string) {
		return item.solveFormulaWithActor(actor, formula);
	});

	Handlebars.registerHelper("matrixProgramAsString", function (ty: Enums.MatrixProgram) {
		return Enums.MatrixProgram[ty];
	});
	Handlebars.registerHelper("matrixActionAsString", function (ty: Enums.MatrixAction) {
		return Enums.MatrixAction[ty];
	});

	Handlebars.registerHelper("in", function (elem, list, options) {
		if (Array.isArray(list)) {
			return list.includes(elem);
		} else if (list instanceof Map) {
			return list.has(elem);
		}
	});

	Handlebars.registerHelper("isRollType", function (val: Enums.RollType, ty: string) {
		return val == Enums.RollType[ty as keyof typeof Enums.RollType];
	});

	Handlebars.registerHelper("var", function (varName, varValue, options) {
		options.data.root[varName] = varValue;
	});

	Handlebars.registerHelper("add", function (a: number, b: number) {
		return +a + +b;
	});

	Handlebars.registerHelper("sub", function (a: number, b: number) {
		return +a - +b;
	});

	Handlebars.registerHelper("gt", function (a: number, b: number) {
		return +a >= +b;
	});

	Handlebars.registerHelper("undefined", function (a) {
		return a == undefined;
	});
}
