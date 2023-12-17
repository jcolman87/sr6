import { Enums } from "./config.js";
export class SR6Roll extends Roll {
    static CHAT_TEMPLATE = "systems/sr6/templates/SR6Roll.html";
    static TOOLTIP_TEMPLATE = "systems/sr6/templates/SR6RollTooltip.html";
    data = undefined;
    toJSON() {
        //
        const json = super.toJSON();
        ////
        json.data = this.data;
        return json;
    }
    static fromData(data) {
        const roll = super.fromData(data);
        roll.data = data.data;
        return roll;
    }
    constructor(formula, data, options) {
        super(formula, data, options);
        this.data = data;
    }
    _getRenderData() {
        let hits = 0;
        let ones = 0;
        let pool = 0;
        let dice = [];
        let glitch = false;
        let critical_glitch = false;
        if (this.data.type != Enums.RollType.Initiative) {
            this.terms[0].results.forEach((roll) => {
                if (roll.active) {
                    dice.push({
                        value: roll.result,
                        classes: "die_" + roll.result
                    });
                    pool += 1;
                    if (roll.result >= 5) {
                        hits += 1;
                    }
                    else if (roll.result == 0) {
                        ones += 1;
                    }
                }
            });
            glitch = ones > Math.round(pool / 2);
            critical_glitch = glitch && hits == 0;
        }
        return {
            user: game.user,
            formula: this.formula,
            data: this.data,
            roll: this,
            hits: hits,
            ones: ones,
            pool: pool,
            glitch: glitch,
            critical_glitch: critical_glitch,
            dice: dice
        };
    }
    async render(options) {
        return renderTemplate(SR6Roll.CHAT_TEMPLATE, this._getRenderData());
    }
}
