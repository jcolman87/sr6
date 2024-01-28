import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { ActivationPeriod } from '@/data';
import BaseActionDataModel from '@/item/data/action/BaseActionDataModel';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { InitiativeRollData } from '@/roll/InitiativeRoll';
import { ITest } from '@/test';

export default abstract class EdgeActionDataModel extends BaseActionDataModel {
	abstract edgeCostFormula: string;

	get cost(): number {
		return this.solveFormula(this.edgeCostFormula);
	}

	async prepareInitiative(_data: InitiativeRollData): Promise<void> {}
	async prepareTest(_test: ITest): Promise<void> {}
	async finishTest(_test: ITest): Promise<void> {}
	async finishRoll(_roll: Roll): Promise<void> {}
	async prepareActor(_actor: SR6Actor<BaseActorDataModel>): Promise<void> {}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;
		return {
			...super.defineSchema(),
			edgeCostFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
		};
	}
}
