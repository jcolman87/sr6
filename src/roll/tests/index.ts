import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { IModifier } from '@/modifier';
import { BaseRollData, SR6Roll } from '@/roll/SR6Roll';

export interface ITest<TRollData extends BaseRollData = BaseRollData, TModifier extends IModifier = IModifier> {
	modifiers: TModifier[];
	roll: TRollData;
	actor: SR6Actor;

	get type(): string;
}

export abstract class BaseTest<TRollData extends BaseRollData = BaseRollData> implements ITest {
	modifiers: IModifier[];
	roll: TRollData;
	actor: SR6Actor;

	get type() {
		return 'BaseTest';
	}

	protected constructor({ actor }: { actor: SR6Actor }) {
		this.modifiers = [];
		this.roll = SR6Roll.defaultRollData() as unknown as TRollData;
		this.actor = actor;
	}
}
