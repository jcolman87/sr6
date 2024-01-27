import BaseDataModel from '@/data/BaseDataModel';
import BaseModifier from '@/modifier/BaseModifier';
import { IModifier, ModifierSourceUUID } from '@/modifier/index';
import { Result } from 'ts-results';

export abstract class ModifierDataModel extends BaseDataModel {
	abstract class: string;

	abstract name: string;
	abstract description: string;

	abstract data: Maybe<object>;

	create(
		parent: foundry.abstract.Document,
		source: Maybe<foundry.abstract.Document> = null,
	): Result<IModifier, string> {
		const data = { name: this.name, description: this.description, ...(this.data || {}) };

		return BaseModifier.fromData({
			class: this.class,
			parent: parent.uuid as ModifierSourceUUID,
			source: (source?.uuid as ModifierSourceUUID) || (parent.uuid as ModifierSourceUUID),
			...data,
		});
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			name: new fields.StringField({ initial: 'Missing name', required: true, blank: true, nullable: false }),
			description: new fields.StringField({
				initial: '',
				required: true,
				blank: true,
				nullable: false,
			}),
			class: new fields.StringField({
				nullable: false,
				required: true,
				choices: Object.keys(CONFIG.sr6.types.modifiers),
			}),

			data: new fields.ObjectField({ initial: undefined, nullable: true, required: false }),
		};
	}
}
