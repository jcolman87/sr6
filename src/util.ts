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
