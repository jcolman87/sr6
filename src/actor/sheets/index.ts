/**
  *
 * @author jaynus
 * @file Actor Sheet Registration
 */

import CharacterSheet from '@/actor/sheets/CharacterSheet';

export function register() {
	Actors.unregisterSheet('core', ActorSheet);

	Actors.registerSheet('sr6', CharacterSheet, {
		types: ['character'],
		makeDefault: true,
	});
}
