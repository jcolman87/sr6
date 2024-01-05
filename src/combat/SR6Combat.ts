/**
 *
 * @author jaynus
 * @file
 */

import SR6Combatant from '@/combat/SR6Combatant';

export default class SR6Combat extends Combat {
	constructor(data: PreCreate<foundry.data.CombatSource>, context?: DocumentConstructionContext<Combat>) {
		super(data, context);

		// Add any open actor sheets
		for (const windowId in ui.windows) {
			if (ui.windows[windowId] instanceof ActorSheet) {
				this.apps[windowId] = ui.windows[windowId];
			}
		}
	}

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

	override async nextTurn(): Promise<this> {
		console.log('SR6Combat::nextTurn', this);

		if (this.nextCombatant) {
			const next = this.nextCombatant! as SR6Combatant;
			await next.beginTurn();
		}
		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			await current.endTurn();
		}

		return super.nextTurn();
	}

	override async previousTurn(): Promise<this> {
		if (this.previous && this.previous.combatantId && this.turn > 0) {
			const next = this.combatants.get(this.previous!.combatantId!) as SR6Combatant;
			await next.beginTurn();
		}

		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			await current.endTurn();
		}

		return super.previousTurn();
	}

	override async nextRound(): Promise<this> {
		for (const c in this.combatants) {
			const combatant = this.combatants[c] as SR6Combatant;
			await combatant.nextRound();
		}
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
		return (
			game.user.isGM &&
			game.users.filter((user) => user.isGM && user.active).every((candidate) => candidate.id >= game.user.id)
		);
	};
}
