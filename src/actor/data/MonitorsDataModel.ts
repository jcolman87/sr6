import BaseDataModel from '@/data/BaseDataModel';

export enum MonitorType {
	Physical = 'physical',
	Stun = 'stun',
	Matrix = 'matrix',
	Edge = 'edge',
}

export default abstract class MonitorsDataModel extends BaseDataModel {
	abstract physical: MonitorDataModel;
	abstract stun: MonitorDataModel;
	abstract overflow: MonitorDataModel;
	abstract edge: MonitorDataModel;

	get woundModifier(): number {
		return -Math.floor(this.physical.damage / 3) + Math.floor(this.stun.damage / 3);
	}

	get(type: MonitorType): MonitorDataModel {
		switch (type) {
			case MonitorType.Physical:
				return this.physical;
			case MonitorType.Stun:
				return this.physical;
			case MonitorType.Matrix:
				return this.physical;
			case MonitorType.Edge:
				return this.physical;
		}
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			stun: new fields.EmbeddedDataField(MonitorDataModel, { initial: { damage: 0, max: 0, formula: '8 + ceil(@body / 2)' }, required: true, nullable: false }),
			physical: new fields.EmbeddedDataField(MonitorDataModel, { initial: { damage: 0, max: 0, formula: '8 + ceil(@body / 2)' }, required: true, nullable: false }),
			overflow: new fields.EmbeddedDataField(MonitorDataModel, { initial: { damage: 0, max: 32, formula: null }, required: true, nullable: false }),
			edge: new fields.EmbeddedDataField(MonitorDataModel, { initial: { damage: 0, max: 5, formula: null }, required: true, nullable: false }),
		};
	}
}

export abstract class MonitorDataModel extends BaseDataModel {
	abstract damage: number;
	abstract max: number;
	abstract formula: string | null;

	get value(): number {
		return Math.max(0, this.max - this.damage);
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			damage: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			max: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			formula: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
		};
	}

	override prepareData() {
		if (this.formula) {
			this.max = this.solveFormula(this.formula);
		}
	}
}
