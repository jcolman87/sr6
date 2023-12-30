import SR6Actor from '@/actor/SR6Actor';

export function constructOptGroup(select: HTMLSelectElement, groupLabel: string, optValues?: string[]): HTMLOptGroupElement {
	const options = select.querySelectorAll<HTMLOptionElement>(':scope > option');
	const optgroup = document.createElement('optgroup');

	optgroup.label = groupLabel;
	optgroup.append(...Array.from(options).filter((option) => !optValues || optValues.includes(option.value)));

	return optgroup;
}

export function toSnakeCase(string: string) {
	return string
		.replace(/\W+/g, ' ')
		.split(/ |\B(?=[A-Z])/)
		.map((word) => word.toLowerCase())
		.join('_');
}

export function getTokenOrActorId<TActor extends Actor>(actor: TActor): string {
	if (actor.token) {
		return actor.token!.id;
	} else {
		return actor.id;
	}
}

export function getActor<TActor extends Actor>(id: string): null | TActor {
	let token = canvas.tokens.get(id);
	if (token) {
		return token.actor as TActor;
	} else {
		return game.actors.get(id);
	}
}

export async function waitForCanvasTokens() {
	while (!canvas.ready) {
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
}

////
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
	let canvas_tokens = canvas.tokens;
	if (!canvas_tokens) {
		return [];
	}

	return canvas_tokens.controlled;
}

export function getTargetTokens(): Token[] {
	return Array.from(game.user.targets);
}

export function getTargetActors(): Actor[] {
	return Array.from(game.user.targets).map((token) => {
		return token.actor!;
	});
}
export function getTargetTokenIds(): string[] {
	return Array.from(game.user.targets).map((token) => {
		return token.id;
	});
}
