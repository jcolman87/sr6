import MatrixHostDataModel from '@/actor/data/MatrixHostDataModel';
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { getCoreConditions } from '@/condition';
import ConditionDataModel, { ConditionActivation } from '@/condition/ConditionDataModel';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import { MatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';

export default abstract class MatrixICDataModel extends MatrixActionDataModel {
	abstract monitor: MonitorDataModel;
	abstract _onHitConditions: string[];
	protected abstract _host: SR6Actor<MatrixHostDataModel> | null;

	override async getHitConditions(): Promise<ConditionDataModel[]> {
		// Find the onHit conditions to apply either in the compendium or global items
		let conditions = (await getCoreConditions()).filter((condition) =>
			this._onHitConditions.includes(condition.name)
		);
		if (conditions.length < this._onHitConditions.length) {
			conditions = conditions.concat(
				game.items.filter((condition) => this._onHitConditions.includes(condition.name))
			);
		}
		conditions = conditions.concat(await super.getHitConditions());

		return conditions as ConditionDataModel[];
	}

	get rating(): number {
		return this.host.systemData.rating;
	}

	get attributes(): null | MatrixAttributesDataModel {
		if (this.host) {
			return this.host.systemData.attributes.current;
		}
		return null;
	}

	get host(): SR6Actor<MatrixHostDataModel> {
		return this.actor! as SR6Actor<MatrixHostDataModel>;
	}

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			rating: this.rating,
			persona: this.attributes,
		};
	}

	override prepareDerivedData(): void {
		this.monitor.prepareDerivedData();
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			_onHitConditions: new fields.ArrayField(new fields.StringField({ blank: false, nullable: false }), {
				initial: [],
				nullable: false,
				required: true,
			}),
			monitor: new fields.EmbeddedDataField(MonitorDataModel, {
				initial: { damage: 0, max: 0, formula: '@rating * 2' },
				required: true,
				nullable: false,
			}),
		};
	}
}
