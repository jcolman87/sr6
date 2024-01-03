/**
 *
 * @author jaynus
 * @file
 */

import SR6Combatant from '@/combat/SR6Combatant';

export default class SR6Combat extends Combat {
	debounceTrackerRender = foundry.utils.debounce(() => {
		if (ui.combat.viewed === this) {
			ui.combat.render();
		}
	}, 50);

	override prepareDerivedData(): void {
		super.prepareDerivedData();
	}

	override startCombat(): Promise<this> {
		if (this.turns[0]) {
			const next = this.turns[0] as SR6Combatant;
			next.beginTurn();
		}

		return super.startCombat();
	}

	override nextTurn(): Promise<this> {
		// check combatant effects
		/* this.combatants.forEach((c) => {
			c.actor!.effects.forEach((effect) => {
				if (effect.isTemporary && effect.duration.remaining != null && effect.duration.remaining <= 0) {
					effect.delete();
					if (c.actor!.sheet.rendered) {
						c.actor!.sheet.render(true);
					}
				}
			});
		});*/

		if (this.nextCombatant) {
			const next = this.nextCombatant! as SR6Combatant;
			next.beginTurn();
		}
		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			current.endTurn();
		}

		return super.nextTurn();
	}

	override previousTurn(): Promise<this> {
		if (this.previous && this.previous.combatantId && this.turn > 0) {
			const next = this.combatants.get(this.previous!.combatantId!) as SR6Combatant;
			next.beginTurn();
		}

		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			current.endTurn();
		}

		return super.previousTurn();
	}

	override nextRound(): Promise<this> {
		this.combatants.forEach((c) => {
			const combatant = c as SR6Combatant;
			combatant.nextRound();
		});
		return super.nextRound();
	}

	override previousRound(): Promise<this> {
		return super.previousRound();
	}
}

/**
 * Register socket listener for SR6 Combats
 */
export function register(): void {
	// Helper function to determine if the code is being executed by only one GM.
	const isGmHub = () => {
		return game.user.isGM && game.users.filter((user) => user.isGM && user.active).every((candidate) => candidate.id >= game.user.id);
	};
}
