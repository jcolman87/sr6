/**
 *
 * @author jaynus
 * @file
 */

import SR6Actor from '@/actor/SR6Actor';
import SR6Combatant, { CombatantFlagData } from '@/combat/SR6Combatant';
import { emit as socketEmit, SOCKET_NAME, SocketPayload, SocketOperation, CombatSocketBaseData } from '@/socket';

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
			void next.beginTurn();
		}

		return super.startCombat();
	}

	getCombatantData(actor: SR6Actor): null | CombatantFlagData {
		let entry = this.combatants.find((c) => c.actor!.uuid == actor.uuid);
		if (entry) {
			return (entry as SR6Combatant).systemData;
		}

		return null;
	}
	async setCombatantData(actor: SR6Actor, data: CombatantFlagData) {
		let entry = this.combatants.find((c) => c.actor!.uuid == actor.uuid);
		if (entry) {
			await (entry as SR6Combatant)._setSystemData(data);
		}
	}

	override nextTurn(): Promise<this> {
		if (this.nextCombatant) {
			const next = this.nextCombatant! as SR6Combatant;
			void next.beginTurn();
		}
		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			void current.endTurn();
		}

		socketEmit(SocketOperation.UpdateCombatTracker, { combatId: this.id });

		return super.nextTurn();
	}

	override previousTurn(): Promise<this> {
		if (this.previous && this.previous.combatantId && this.turn > 0) {
			const next = this.combatants.get(this.previous!.combatantId!) as SR6Combatant;
			void next.beginTurn();
		}

		if (this.combatant) {
			const current = this.combatant! as SR6Combatant;
			void current.endTurn();
		}

		socketEmit(SocketOperation.UpdateCombatTracker, { combatId: this.id });

		return super.previousTurn();
	}

	override nextRound(): Promise<this> {
		return super.nextRound();
	}

	override previousRound(): Promise<this> {
		return super.previousRound();
	}

	debounceRender = foundry.utils.debounce(() => {
		if (ui.combat.viewed === this) {
			ui.combat.render();
		}
	}, 50);
}

/**
 * Register socket listener for SR6 Combats
 */
export function register(): void {
	game.socket.on(SOCKET_NAME, async (payload: SocketPayload<CombatSocketBaseData>) => {
		if (!payload.data) {
			return;
		}

		const combat = game.combats.get(payload.data.combatId) as SR6Combat | undefined;
		if (!combat) {
			console.error(
				`Socket received ${SocketOperation[payload.operation]} payload with invalid combat ID ${
					payload.data.combatId
				}`
			);
			return;
		}

		switch (payload.operation) {
			case SocketOperation.UpdateCombatTracker:
				combat.debounceRender();

				// Debounce any visible actor sheets as well

				break;
		}
	});
}
