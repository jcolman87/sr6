/**
  *
 * @author jaynus
 * @file
 */

import SR6Combatant from '@/combat/SR6Combatant';

export default class SR6Combat extends Combat {
	/**
	 * If this is the currently viewed encounter, re-render the CombatTracker application.
	 * We debounce this call to allow for updates to complete.
	 */
	debounceTrackerRender = foundry.utils.debounce(() => {
		if (ui.combat.viewed === this) {
			ui.combat.render();
		}
	}, 50);
}

/**
 * Register socket listener for SR6 Combats
 */
export function register() {
	// Helper function to determine if the code is being executed by only one GM.
	const isGmHub = () => {
		return game.user.isGM && game.users.filter((user) => user.isGM && user.active).every((candidate) => candidate.id >= game.user.id);
	};
}
