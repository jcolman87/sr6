import BaseDataModel from '@/data/BaseDataModel';
import { ConstructorOf } from '@/util';

export default class FlagDocument<TDataModel extends foundry.abstract.DataModel> {
	name: string;
	type: ConstructorOf<TDataModel>;
	document: foundry.abstract.Document;

	system: TDataModel;

	async save(): Promise<void> {
		await this.document.setFlag('sr6', this.name, this.system.toObject());
	}

	prepareBaseData(): void {
		this.system.prepareBaseData();
	}

	prepareData(): void {
		this.system.prepareData();
	}

	prepareDerivedData(): void {
		this.system.prepareDerivedData();
	}

	constructor(document: foundry.abstract.Document, type: ConstructorOf<TDataModel>, name: string) {
		this.document = document;
		this.type = type;
		this.name = name;

		console.log('document', this);

		let data = this.document.getFlag('sr6', this.name);
		if (!data) {
			data = {};
		}

		this.system = new this.type(data, { parent: document });
	}
}
