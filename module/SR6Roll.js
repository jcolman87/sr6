export class SR6RollData {
    parameters;
    constructor(parameters = { glitch: [1], success: [5, 6] }) {
        this.parameters = parameters;
    }
}
export class SR6Roll extends Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6Roll.html";
    get pool_size() {
        return this.terms[0].results.length;
    }
    get sides() {
        return this.terms[0].results.map((result) => result.result);
    }
    get hits() {
        return this.sides.reduce((hits, result) => this.data.parameters.success.includes(result) ? hits + 1 : hits, 0);
    }
    get glitches() {
        return this.sides.reduce((glitches, result) => this.data.parameters.glitch.includes(result) ? glitches + 1 : glitches, 0);
    }
    get is_glitch() {
        return this.glitches > Math.floor(this.pool_size / 2);
    }
    get is_critical_glitch() {
        return this.is_glitch && this.hits == 0;
    }
    async render(options = {}) {
        console.log("SR6Roll::render", options);
        if (!this._evaluated)
            await this.evaluate({ async: true });
        return renderTemplate(SR6Roll.CHAT_TEMPLATE, {
            user: game.user.id,
            tooltip: options.isPrivate ? "" : await this.getTooltip(),
            roll: this,
        });
    }
}
export class SR6FormulaRollData extends SR6RollData {
    actor = null;
    item = null;
    constructor(actor = null, item = null, parameters = { glitch: [1], success: [5, 6] }) {
        super(parameters);
        this.actor = actor;
        this.item = item;
    }
}
export class SR6FormulaRoll extends SR6Roll {
}
export class SR6InitiativeRoll extends SR6Roll {
}
export const RollTypes = [SR6Roll, SR6FormulaRoll, SR6InitiativeRoll];
