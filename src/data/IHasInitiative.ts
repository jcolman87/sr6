import { InitiativeType } from '@/data';
import { IHasActor } from '@/data/IHasActor';
import IHasPools from '@/data/IHasPools';

export type AvailableActions = {
	major: number;
	minor: number;
};

export default interface IHasInitiative extends IHasActor, IHasPools {
	getInitiativeFormula(type: InitiativeType): null | string;

	getAvailableActions(type: InitiativeType): AvailableActions;
}
