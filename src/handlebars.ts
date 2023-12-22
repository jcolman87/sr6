import { SR6Actor } from "./actors/SR6Actor.js";
import { SR6CharacterActor } from "./actors/SR6CharacterActor.js";
import { SR6Gear } from "./items/SR6Gear.js";
import * as Rolls from "./rolls/Rolls.js";
import { GearTypes } from "./items/Data.js";
import { SR6CONFIG, Enums, SkillUse, EdgeBoostDef } from "./config.js";

export function defineHandlebarHelpers() {
	Handlebars.registerHelper("isGM", function (user_id: string) {
		return (game as Game).user!.isGM;
	});

	Handlebars.registerHelper("bold", function (this: any, options: any) {
		return new Handlebars.SafeString('<div class="mybold">' + options.fn(this) + "</div>");
	});

	////
	Handlebars.registerHelper("itemHas", function (item: SR6Gear, ty_str: string) {
		return item.has(GearTypes.Types[ty_str as keyof typeof GearTypes.Types]);
	});

	Handlebars.registerHelper("solveActorFormula", function (actor: SR6Actor, formula: string) {
		return actor.solveFormula(formula);
	});

	Handlebars.registerHelper("solveItemFormula", function (item: SR6Gear, formula: string) {
		return item.solveFormula(formula);
	});

	Handlebars.registerHelper("solveActorItemFormula", function (actor: SR6Actor, item: SR6Gear, formula: string) {
		return item.solveFormulaWithActor(actor, formula);
	});

	Handlebars.registerHelper("getSkill", function (actor: SR6CharacterActor, ty: Enums.Skill) {
		return actor.getSkill(ty);
	});

	Handlebars.registerHelper("getAttackRating", function (item: SR6Gear, distance: Enums.Distance) {
		return item.getAttackRating(distance);
	});

	Handlebars.registerHelper("canUseEdgeBoost", function (boost_id: Enums.EdgeBoost, activation: Enums.ActivationLimit, roll: Rolls.SR6RollData) {
		return SR6CONFIG.edge_boosts.get(boost_id)!.condition(activation, roll);
	});

	Handlebars.registerHelper("attributeAsString", function (ty: Enums.Attribute) {
		return Enums.Attribute[ty];
	});
	Handlebars.registerHelper("skillAsString", function (ty: Enums.Skill) {
		return Enums.Skill[ty];
	});
	Handlebars.registerHelper("combatActionAsString", function (ty: Enums.Skill) {
		return Enums.CombatAction[ty];
	});
	Handlebars.registerHelper("skillUseAsString", function (ty: SkillUse) {
		if (ty.specialization) {
			return Enums.Specialization[ty.specialization];
		} else {
			return Enums.Skill[ty.skill!];
		}
	});
	Handlebars.registerHelper("specializationAsString", function (ty: Enums.Specialization) {
		return Enums.Specialization[ty];
	});
	Handlebars.registerHelper("distanceToString", function (ty: Enums.Distance) {
		return Enums.Distance[ty];
	});
	Handlebars.registerHelper("matrixProgramAsString", function (ty: Enums.MatrixProgram) {
		return Enums.MatrixProgram[ty];
	});
	Handlebars.registerHelper("matrixActionAsString", function (ty: Enums.MatrixAction) {
		return Enums.MatrixAction[ty];
	});
	Handlebars.registerHelper("edgeBoostAsString", function (ty: Enums.EdgeBoost) {
		return Enums.EdgeBoost[ty];
	});

	Handlebars.registerHelper("specializationsOfSkill", function (ty: Enums.Skill) {
		return SR6CONFIG.skills.get(ty)!.specializations;
	});

	Handlebars.registerHelper("in", function (elem, list, options) {
		if (Array.isArray(list)) {
			let res = list.includes(elem);
			return res;
		} else if (list instanceof Map) {
			return list.has(elem);
		}
	});

	Handlebars.registerHelper("var", function (this: any, varName, varValue, options) {
		this[varName] = varValue;
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

	Handlebars.registerHelper("isNull", function (a) {
		return a == null;
	});

	Handlebars.registerHelper("null", function (a) {
		return a == null;
	});

	Handlebars.registerHelper("ifBoth", function (a: boolean, b: boolean) {
		return a && b;
	});

	Handlebars.registerHelper("ifCond", function (this: any, v1, operator, v2, options) {
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

	Handlebars.registerHelper('times', function(n, block) {
	    var accum = '';
	    for(var i = 0; i < n; ++i)
	        accum += block.fn(i);
	    return accum;
	});


	Handlebars.registerHelper("eachMap", function (map, block) {
		var out = "";

		map.forEach((value: any, key: any) => {
			out += block.fn({ key: key, value: value });
		});

		return out;
	});

	Handlebars.registerHelper("localizeName", function (root: string, name: string) {
		return (game as Game).i18n.localize(`${root}.${name}.name`);
	});

	Handlebars.registerHelper("localizeDescription", function (root: string, name: string) {
		return (game as Game).i18n.localize(`${root}.${name}.description`);
	});
}
