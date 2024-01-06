/**
 *
 * @author jaynus
 * @file Actor Sheet Registration
 */

import CharacterSheet from '@/actor/sheets/CharacterSheet';

import MatrixHostSheet from '@/actor/sheets/MatrixHostSheet';

export function register(): void {
	Actors.unregisterSheet('core', ActorSheet);

	Actors.registerSheet('sr6', CharacterSheet, {
		types: ['character'],
		makeDefault: true,
	});

	Actors.registerSheet('sr6', MatrixHostSheet, {
		types: ['matrix_host'],
		makeDefault: true,
	});
}
