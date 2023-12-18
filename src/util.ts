import { SR6Actor } from "./actors/SR6Actor.js";
import { EffectChangeData, EffectChangeMode } from "./config.js";

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

export function getActorById(id: string) {
	// First check if its a real actor, instead its a token actor delta??
}

export function getSelfActor(): SR6Actor {
	return (game as Game).user!.character as SR6Actor;
}

export function getSelectedActors(): SR6Actor[] {
	return getSelectedTokens().map((token) => {
		return token.actor as SR6Actor;
	});
}

export function getTargetedActors(): SR6Actor[] {
	let canvas_tokens = (game as Game).canvas.tokens;
	if (!canvas_tokens) {
		return [];
	} else {
		return (game as Game).user!.targets.ids.map((id) => {
			return canvas_tokens!.get(id)!.actor as SR6Actor;
		});
	}
}

export function getSelectedTokens(): Token[] {
	let canvas_tokens = (game as Game).canvas.tokens;
	if (!canvas_tokens) {
		return [];
	}

	return canvas_tokens.controlled;
}

export function applyChangesetToObject(obj: any, mods: EffectChangeData[]) {
	mods.forEach((change) => {
		if(change.key && change.value) {
			let value: number = parseInt(change.value);
			if(isNaN(value) || isNaN(obj[change.key])) {
				ui.notifications!.error("Custom mods only support numbers");
				return;
			}

			switch ( change.mode ) {
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
		      	if(change.value > obj[change.key]) {
		      		obj[change.key] = change.value;
		      	}
		      	break;
		      case EffectChangeMode.DOWNGRADE:
		        if(change.value < obj[change.key]) {
		      		obj[change.key] = change.value;
		      	}
		        break;
		      default:
		        ui.notifications!.error("Custom mods not supported for manual effect changes");
		        break;
		    }
		}
	});
}