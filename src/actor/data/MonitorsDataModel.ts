import BaseDataModel from '@/data/BaseDataModel';

export enum MonitorType {
	Physical = 'physical',
	Overflow = 'overflow',
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
			case MonitorType.Overflow:
				return this.overflow;
			case MonitorType.Stun:
				return this.physical;
			case MonitorType.Matrix:
				return this.physical;
			case MonitorType.Edge:
				return this.edge;
		}
		throw 'ERROR INVALID MONITOR TYPE';
	}

	// returns remainder
	private async _applyDamage(type: MonitorType, value: number): Promise<number> {
		const monitor: MonitorDataModel = this.get(type);

		const newDamage: number = monitor.value + value;
		const remainder: number = newDamage - monitor.max;

		if (remainder > 0) {
			await this.actor!.update({ [`system.monitors.${type.toString()}.damage`]: monitor.max });
			return remainder;
		} else {
			await this.actor!.update({ [`system.monitors.${type.toString()}.damage`]: newDamage });
			return 0;
		}
	}

	async applyDamage(type: MonitorType, value: number): Promise<void> {
		if (type === MonitorType.Edge) {
			ui.notifications.error('Dont use applyDamage for edge, use spendEdge instaed');
		}
		let physicalDamage: number = type === MonitorType.Physical ? value : 0;
		let overflowDamage: number = 0;

		if (type === MonitorType.Stun) {
			const remainder: number = await this._applyDamage(type, value);
			if (remainder > 0) {
				physicalDamage = await this._applyDamage(MonitorType.Physical, remainder);
			}
		}

		if (physicalDamage > 0) {
			const remainder: number = await this._applyDamage(MonitorType.Physical, value);
			if (remainder > 0) {
				overflowDamage = await this._applyDamage(MonitorType.Overflow, remainder);
			}
		}

		if (overflowDamage > 0) {
			const remainder: number = await this._applyDamage(MonitorType.Physical, value);
			if (remainder > 0) {
				// They are dead
			}
		}
	}

	// Returns true if they edge got spent
	async spendEdge(count: number): Promise<boolean> {
		if (this.edge.value < count) {
			return false;
		}
		return true;
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			stun: new fields.EmbeddedDataField(MonitorDataModel, {
				initial: { damage: 0, max: 0, formula: '8 + ceil(@body / 2)' },
				required: true,
				nullable: false,
			}),
			physical: new fields.EmbeddedDataField(MonitorDataModel, {
				initial: { damage: 0, max: 0, formula: '8 + ceil(@body / 2)' },
				required: true,
				nullable: false,
			}),
			overflow: new fields.EmbeddedDataField(MonitorDataModel, {
				initial: { damage: 0, max: 32, formula: null },
				required: true,
				nullable: false,
			}),
			edge: new fields.EmbeddedDataField(MonitorDataModel, {
				initial: { damage: 0, max: 5, formula: null },
				required: true,
				nullable: false,
			}),
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

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			damage: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			max: new fields.NumberField({ initial: 0, required: true, nullable: false, integer: true, min: 0 }),
			formula: new fields.StringField({ initial: null, required: true, nullable: true, blank: false }),
		};
	}

	override prepareData(): void {
		if (this.formula) {
			this.max = this.solveFormula(this.formula);
		}
	}
}
