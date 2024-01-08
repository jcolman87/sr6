/**
 *
 * @author jaynus
 * @file Basic data model
 */

import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';

/**
 * Base data model shared by all Item documents.
 *
 * This class (and all subclasses) should be made abstract to deal with the way Foundry handles populating data for the schema.
 * By marking the class as abstract, TypeScript won't try to define the properties - which means Foundry is free to do as it wishes.
 * In this way, we can safely define the value types (to allow for typed access) on the data model. This works only because we never
 * have reason to instantiate any of the DataModel classes ourselves.
 */
export default abstract class BaseItemDataModel extends BaseDataModel {
	abstract description: string;
	abstract source: string;

	override getRollData(): Record<string, unknown> {
		return {
			...super.getRollData(),
			item: this.item!,
		};
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			description: new fields.HTMLField(),
			source: new fields.StringField(),
		};
	}

	static CHAT_TEMPLATE: string = 'systems/sr6/templates/chat/item.hbs';
	get chatTemplate(): string {
		return BaseItemDataModel.CHAT_TEMPLATE;
	}

	async toMessage(): Promise<void> {
		const enrichedDescription = await TextEditor.enrichHTML(this.description, { async: true });

		const chatTemplate = await renderTemplate(this.chatTemplate, {
			name: this.item!.name,
			type: this.item!.type,
			description: enrichedDescription,
			img: this.item!.img,
			system: this.item!.systemData,
		});
		await ChatMessage.create({
			user: game.user.id,
			speaker: {
				actor: game.user.character?.id,
			},
			content: chatTemplate,
			type: CONST.CHAT_MESSAGE_TYPES.OOC,
		});
	}
}
