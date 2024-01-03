import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import MonitorDataModel from '@/actor/data/MonitorsDataModel';
import MatrixAttributesDataModel from '@/data/MatrixAttributesDataModel';

import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';

export enum PersonaType {
	Device = 'device',
	Living = 'living',
	IC = 'ic',
}

export default abstract class MatrixPersonaDataModel extends BaseItemDataModel {
	abstract deviceId: string;
	abstract baseAttributes: MatrixAttributesDataModel;
	abstract attributes: MatrixAttributesDataModel;

	get type(): PersonaType {
		if (this.device === null) {
			return PersonaType.Living;
		}
		return PersonaType.Device;
	}

	get conditionMonitor(): MonitorDataModel {
		if (this.deviceId) {
			return this.device!.monitors.matrix!;
		} else {
			return this.actor!.systemData.monitors.stun;
		}
	}

	get device(): null | GearDataModel {
		const device = this.actor!.items.get(this.deviceId);
		return device ? (device as SR6Item<GearDataModel>).systemData : null;
	}

	get a(): number {
		return this.attributes.attack;
	}

	set a(value: number) {
		this.attributes.attack = value;
	}

	get s(): number {
		return this.attributes.sleaze;
	}

	set s(value: number) {
		this.attributes.sleaze = value;
	}

	get d(): number {
		return this.attributes.dataProcessing;
	}

	set d(value: number) {
		this.attributes.dataProcessing = value;
	}

	get f(): number {
		return this.attributes.firewall;
	}

	set f(value: number) {
		this.attributes.firewall = value;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			deviceId: new fields.DocumentIdField({ initial: null, nullable: true, required: true }),
			attributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
			baseAttributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
		};
	}
}
