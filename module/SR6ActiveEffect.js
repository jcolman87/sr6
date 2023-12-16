export class SR6ActiveEffect extends ActiveEffect {
    apply(actor, change) {
        return super.apply(actor, change);
    }
    _applyCustom(actor, change) {
        let value = actor.solveFormula(change.value);
        mergeObject(actor, { [change.key]: value });
    }
}
