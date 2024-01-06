import SR6Actor from '@/actor/SR6Actor';

export interface IHasActor {
	get actor(): SR6Actor | null;
}
