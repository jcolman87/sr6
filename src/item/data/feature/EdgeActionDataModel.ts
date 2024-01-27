import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { ActivationPeriod } from '@/data';
import InitiativeDataModel from '@/data/InitiativeDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { InitiativeRollData } from '@/roll/InitiativeRoll';
import { ITest } from '@/test';

export default abstract class EdgeActionDataModel extends BaseItemDataModel {
	abstract edgeCostFormula: string;
	abstract activationPeriod: ActivationPeriod;

	get cost(): number {
		return this.solveFormula(this.edgeCostFormula);
	}

	async prepareInitiative(data: InitiativeRollData): Promise<void> {}
	async prepareTest(test: ITest): Promise<void> {}
	async finishTest(test: ITest): Promise<void> {}
	async finishRoll(roll: Roll): Promise<void> {}
	async prepareActor(actor: SR6Actor<BaseActorDataModel>): Promise<void> {}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			edgeCostFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			activationPeriod: new fields.StringField({
				initial: ActivationPeriod.Any,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ActivationPeriod),
			}),
		};
	}
}
