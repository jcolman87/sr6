/**
 *
 * @author jaynus
 * @file
 */

import SR6Combat from '@/combat/SR6Combat';

export default class SR6CombatTracker extends CombatTracker<SR6Combat> {
	override get template(): string {
		return 'systems/sr6/templates/sidebar/combat-tracker.hbs';
	}
}
