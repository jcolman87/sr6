import { InitiativeType } from '@/data';

export type AvailableActions = {
	major: number;
	minor: number;
};
export default interface IHasInitiative {
	getInitiativeFormula(type: InitiativeType): null | string;

	getAvailableActions(type: InitiativeType): AvailableActions;
}
