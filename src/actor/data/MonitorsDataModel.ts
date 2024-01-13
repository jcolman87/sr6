import BaseDataModel from '@/data/BaseDataModel';
import { IHasEdge } from '@/data/interfaces';

export enum MonitorType {
	Physical = 'physical',
	Overflow = 'overflow',
	Stun = 'stun',
	Matrix = 'matrix',
	Edge = 'edge',
}

export type WoundModifierData = Partial<Record<MonitorType, number>>;

export abstract class MonitorDataModel extends BaseDataModel {
	abstract damage: number;
	abstract max: number;
	abstract formula: string | null;

	get woundModifier(): number {
		return -Math.floor(this.damage / 3);
	}

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

export default abstract class MonitorsDataModel extends BaseDataModel implements IHasEdge {
	abstract physical: MonitorDataModel;
	abstract stun: MonitorDataModel;
	abstract overflow: MonitorDataModel;
	abstract edge: MonitorDataModel;

	get woundModifiers(): WoundModifierData {
		return {
			[MonitorType.Physical]: this.physical.woundModifier,
			[MonitorType.Stun]: this.stun.woundModifier,
		};
	}

	get woundModifier(): number {
		return Object.entries(this.woundModifier).reduce((acc, [_key, value]) => (acc += value), 0);
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

	gainEdge(count: number): boolean {
		this.edge.damage = Math.max(0, (this.edge.damage -= count));

		return true;
	}

	spendEdge(count: number): boolean {
		if (this.edge.value < count) {
			return false;
		}

		this.edge.damage += count;

		return true;
	}

	override prepareBaseData(): void {
		this.physical.prepareBaseData();
		this.stun.prepareBaseData();
		this.overflow.prepareBaseData();
		this.edge.prepareBaseData();
	}

	override prepareData(): void {
		this.physical.prepareData();
		this.stun.prepareData();
		this.overflow.prepareData();
		this.edge.prepareData();
	}

	override prepareDerivedData(): void {
		this.physical.prepareDerivedData();
		this.stun.prepareDerivedData();
		this.overflow.prepareDerivedData();
		this.edge.prepareDerivedData();
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
