export class SR6CombatTracker extends CombatTracker {
    get template() {
        return "systems/sr6/templates/combat/tracker.html";
    }
    async getData(options) {
        let data = super.getData(options);
        data.then((data) => {
            if (data != undefined) {
                data.turns.forEach((turn) => {
                    turn.combatant = data.combat?.combatants.get(turn.id);
                });
            }
            return data;
        });
        return data;
    }
}
