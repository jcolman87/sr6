import { SR6Actor } from "./actors/SR6Actor.js";

declare var game: Game;

export function getSelfOrSelectedActors(): SR6Actor[] {
	let actors: SR6Actor[] = [];

	if ((game as Game).user!.isGM) {
		actors = getSelectedActors();
	} else {
		actors = [getSelfActor()];
	}

	return actors;
}

export function getSelfActor(): SR6Actor {
	return (game as Game).user!.character as SR6Actor;
}

export function getSelectedActors(): SR6Actor[] {
	return getSelectedTokens().map((token) => {
		return token.actor as SR6Actor;
	});
}

export function getSelectedTokens(): Token[] {
	let canvas_tokens = (game as Game).canvas.tokens;
	if (!canvas_tokens) {
		return [];
	}

	return canvas_tokens.controlled;
}
