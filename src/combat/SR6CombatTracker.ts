import { SR6Combatant } from "./SR6Combatant.js";


type SR6Turn = CombatTracker.Turn & {
	combatant: SR6Combatant;
};


export class SR6CombatTracker extends CombatTracker {
	get template() {
		return "systems/sr6/templates/combat/tracker.html";
	}

	async getData(options?: Partial<ApplicationOptions> | undefined): Promise<CombatTracker.Data> {
		let data: Promise<CombatTracker.Data> = super.getData(options);
		data.then((data: CombatTracker.Data) => {
			if (data != undefined) {
				data.turns.forEach((turn: CombatTracker.Turn) => {
					(turn as SR6Turn).combatant = data.combat?.combatants.get(turn.id) as SR6Combatant;
				});
			}
			return data;
		});
		return data;
	}
}
