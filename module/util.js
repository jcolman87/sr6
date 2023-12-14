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
export function getSelfActor() {
    return game.user.character;
}
export function getSelectedActors() {
    return getSelectedTokens().map((token) => {
        return token.actor;
    });
}
export function getSelectedTokens() {
    let canvas_tokens = game.canvas.tokens;
    if (!canvas_tokens) {
        return [];
    }
    return canvas_tokens.controlled;
}
