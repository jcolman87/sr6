import { applyChangesetToObject } from "../util.js";
export class SR6RollData {
    actor;
    pool;
    constructor(actor, pool = 0) {
        this.actor = actor;
        this.pool = pool;
    }
    applyChangeset(changes) {
        applyChangesetToObject(this, changes);
    }
}
export class SR6Roll extends Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6Roll.html";
    parameters = { glitch: [1], success: [5, 6] };
    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);
    }
    get actor() {
        return this.data.actor;
    }
    get pool() {
        return this.data.pool;
    }
    get sides() {
        return this.terms[0].results.map((result) => result.result);
    }
    get hits() {
        return this.sides.reduce((hits, result) => this.parameters.success.includes(result) ? hits + 1 : hits, 0);
    }
    get glitches() {
        return this.sides.reduce((glitches, result) => this.parameters.glitch.includes(result) ? glitches + 1 : glitches, 0);
    }
    get is_glitch() {
        return this.glitches > Math.floor(this.pool / 2);
    }
    get is_critical_glitch() {
        return this.is_glitch && this.hits == 0;
    }
    async render(options = {}) {
        if (!this._evaluated)
            await this.evaluate({ async: true });
        return renderTemplate(this.constructor.CHAT_TEMPLATE, {
            user: game.user.id,
            tooltip: options.isPrivate ? "" : await this.getTooltip(),
            roll: this,
        });
    }
    toMessage(messageData = {}) {
        return super.toMessage(messageData);
    }
    static make(data) {
        return new SR6Roll(`(@pool)d6`, data);
    }
    toJSON() {
        const json = super.toJSON();
        json.data = this.data;
        return json;
    }
    // NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
    static fromData(data) {
        const roll = super.fromData(data);
        return roll;
    }
}
