/**
 *
 * @author jaynus
 * @file
 */
import { getActor } from '@/util';
import * as handlebars from 'handlebars';

export async function preload(): Promise<void> {
	const templatePaths = [
		'systems/sr6/templates/chat/rolls/shared/header.hbs',
		'systems/sr6/templates/chat/rolls/shared/footer.hbs',
	];

	return loadTemplates(templatePaths);
}

export function register(): void {
	// Bullshit

	/** String Utilities */

	Handlebars.registerHelper('capitalize', /** @param {string} value */ (value) => value.capitalize());
	Handlebars.registerHelper('toLowerCase', /** @param {string} value */ (value) => value.toLowerCase());
	Handlebars.registerHelper('toUpperCase', /** @param {string} value */ (value) => value.toUpperCase());
	Handlebars.registerHelper('concat', (...values) => values.filter((v) => v && typeof v === 'string').join(''));
	Handlebars.registerHelper('split', /** @param {string} value */ (value) => value.split(' '));

	/** Math Utilities */
	Handlebars.registerHelper('add', (lhs, rhs) => lhs + rhs);
	Handlebars.registerHelper('sub', (lhs, rhs) => lhs - rhs);
	Handlebars.registerHelper('mul', (lhs, rhs) => lhs * rhs);
	Handlebars.registerHelper('div', (lhs, rhs) => lhs / rhs);
	Handlebars.registerHelper('min', (lhs, rhs) => Math.min(lhs, rhs));
	Handlebars.registerHelper('max', (lhs, rhs) => Math.max(lhs, rhs));
	Handlebars.registerHelper('abs', (val) => Math.abs(val));
	Handlebars.registerHelper('floor', (val) => Math.floor(val));
	Handlebars.registerHelper('toFixed', (val: number, fractionDigits: number) => val.toFixed(fractionDigits));

	/** Logic Utilities */
	Handlebars.registerHelper('and', (lhs, rhs) => lhs && rhs);
	Handlebars.registerHelper('or', (lhs, rhs) => lhs || rhs);
	Handlebars.registerHelper('not', (val) => !val);

	Handlebars.registerHelper('var', function (this: Record<string, unknown>, varName, varValue, options) {
		this[varName] = varValue;
	});

	Handlebars.registerHelper('getActorItem', function (actor: Actor, itemId: string) {
		return actor.items.get(itemId);
	});

	Handlebars.registerHelper('getActorById', function (actorId: string) {
		return getActor(actorId);
	});

	Handlebars.registerHelper('getActorItemById', function (actorId: string, itemId: string) {
		return getActor(actorId)!.items.get(itemId);
	});

	/** Iteration utilities */
	Handlebars.registerHelper('repeat', (times, options) => {
		const results = [];

		for (let i = 0; i < times; i++) {
			results.push(options.fn(i));
		}

		return results.join('');
	});

	/** Functional utilities */
	Handlebars.registerHelper('undefined', /** @param {string} value */ (value) => value === undefined);
	Handlebars.registerHelper('isNull', /** @param {string} value */ (value) => value === null);
}
