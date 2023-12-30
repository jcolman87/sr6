import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import MonitorDataModel from '@/data/MonitorDataModel';
import MatrixAttributesDataModel from '@/data/MatrixAttributesDataModel';

import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';

export default abstract class MatrixPersonaDataModel extends BaseItemDataModel {
	abstract deviceId: string;
	abstract baseAttributes: MatrixAttributesDataModel;
	abstract attributes: MatrixAttributesDataModel;

	get monitors(): MonitorDataModel {
		if (this.deviceId) {
			return this.device!.monitors.matrix!;
		} else {
			return this.bio_monitor;
		}
	}
	get bio_monitor(): MonitorDataModel {
		return this.actor!.systemData.monitors.physical;
	}

	get device(): null | GearDataModel {
		let device = this.actor!.items.get(this.deviceId);
		return device ? (device as SR6Item<GearDataModel>).systemData : null;
	}

	get a(): number {
		return this.attributes.attack;
	}
	get s(): number {
		return this.attributes.sleaze;
	}
	get d(): number {
		return this.attributes.dataProcessing;
	}
	get f(): number {
		return this.attributes.firewall;
	}

	static override defineSchema() {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			deviceId: new fields.DocumentIdField({ initial: null, nullable: true, required: true }),
			attributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
			baseAttributes: new fields.EmbeddedDataField(MatrixAttributesDataModel, { required: true, nullable: false }),
		};
	}
}
