import { EffectChangeMode } from "./config.js";
export function directDataValue(target) {
    if (target.value == "null") {
        return null;
    }
    else {
        if (target.type == "number" || target.dataset["type"] == "number") {
            let value = parseInt(target.value);
            if (isNaN(value)) {
                return 0;
            }
            return value;
        }
        else {
            return target.value;
        }
    }
}
export function getSelfOrSelectedActors() {
    let actors = [];
    if (game.user.isGM) {
        actors = getSelectedActors();
    }
    else {
        actors = [getSelfActor()];
    }
    return actors;
}
export function getActorById(id) {
    // First check if its a real actor, instead its a token actor delta??
}
export function getSelfActor() {
    return game.user.character;
}
export function getSelectedActors() {
    return getSelectedTokens().map((token) => {
        return token.actor;
    });
}
export function getTargetedActors() {
    let canvas_tokens = game.canvas.tokens;
    if (!canvas_tokens) {
        return [];
    }
    else {
        return game.user.targets.ids.map((id) => {
            return canvas_tokens.get(id).actor;
        });
    }
}
export function getSelectedTokens() {
    let canvas_tokens = game.canvas.tokens;
    if (!canvas_tokens) {
        return [];
    }
    return canvas_tokens.controlled;
}
export function applyChangesetToObject(obj, mods) {
    mods.forEach((change) => {
        if (change.key && change.value) {
            let value = parseInt(change.value);
            if (isNaN(value) || isNaN(obj[change.key])) {
                ui.notifications.error("Custom mods only support numbers");
                return;
            }
            switch (change.mode) {
                case EffectChangeMode.ADD:
                    obj[change.key] += +value;
                    break;
                case EffectChangeMode.MULTIPLY:
                    obj[change.key] += +value;
                    break;
                case EffectChangeMode.OVERRIDE:
                    obj[change.key] += +value;
                    break;
                case EffectChangeMode.UPGRADE:
                    if (change.value > obj[change.key]) {
                        obj[change.key] = change.value;
                    }
                    break;
                case EffectChangeMode.DOWNGRADE:
                    if (change.value < obj[change.key]) {
                        obj[change.key] = change.value;
                    }
                    break;
                default:
                    ui.notifications.error("Custom mods not supported for manual effect changes");
                    break;
            }
        }
    });
}
