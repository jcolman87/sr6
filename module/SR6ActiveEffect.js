export class SR6ActiveEffect extends ActiveEffect {
    constructor(data, parent) {
        super(data, parent);
        console.log("SR6ActiveEffect::constructor", data, parent);
    }
    apply(actor, change) {
        console.log("SR6ActiveEffect::apply", actor, change);
        return super.apply(actor, change);
    }
    _applyCustom(actor, change) {
        let value = actor.solveFormula(change.value);
        mergeObject(actor, { [change.key]: value });
    }
}
