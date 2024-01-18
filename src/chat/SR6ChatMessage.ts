import SR6Actor from '@/actor/SR6Actor';
import { ITest, testFromData } from '@/roll/test';
import { BaseTestMessageData } from '@/roll/test/BaseTest';
import { SR6Roll } from '@/roll/v2/SR6Roll';
import { SR6Token } from '@/token/SR6Token';
import * as util from '@/util';
import VueChatMessage from '@/vue/chat/ChatMessage.vue';

import { App, createApp, reactive, UnwrapNestedRefs } from 'vue';

export const ChatContext = Symbol('Chat Root Context');

export class ChatMessageContext {
	test?: ITest;
	roll?: SR6Roll;
	message: SR6ChatMessage;

	get actor(): SR6Actor | null {
		return this.message.speaker.actor ? game.actors.get(this.message.speaker.actor) : null;
	}

	get scene(): Scene | null {
		return this.message.speaker.scene ? (game.scenes.get(this.message.speaker.scene) as Scene | null) : null;
	}

	get token(): SR6Token | null {
		return this.message.speaker.token ? (canvas.tokens.get(this.message.speaker.token) as SR6Token | null) : null;
	}

	constructor(message: SR6ChatMessage) {
		this.message = message;
	}
}

export type ChatMessageFlags = {
	sr6?: {
		testData?: BaseTestMessageData;
	};
};

export class SR6ChatMessage extends ChatMessage<SR6Actor> {
	declare flags: ChatMessageFlags;

	form: HTMLFormElement;
	vueApp: App;
	vueContext: UnwrapNestedRefs<ChatMessageContext>;

	mounted: boolean = false;

	constructor(data: PreCreate<foundry.data.ChatMessageSource>, context?: DocumentConstructionContext<ChatMessage>) {
		super(data, context);

		this.vueContext = reactive(new ChatMessageContext(this));

		const form = document.createElement('form');

		form.className = `vue-app`;
		form.setAttribute('autocomplete', 'off');

		this.form = form;
		this.vueApp = createApp(VueChatMessage);

		if (this.flags?.sr6?.testData) {
			const testObj = testFromData(this.flags!.sr6!.testData!);
			this.vueContext.test = testObj;
			if (this.rolls.length > 0) {
				this.vueContext.roll = SR6Roll.fromData(this.rolls[0] as unknown as RollJSON) as SR6Roll;
				console.log('fuckme', this, this.rolls[0], this.vueContext.roll);
			}
		}
	}

	override async getHTML(): Promise<JQuery> {
		const html = await super.getHTML();

		if (!this.mounted) {
			await util.waitForCanvasTokens();
			this.vueApp.provide(ChatContext, this.vueContext);
			this.vueApp.mount(this.form);
		}

		html.find('.message-content').empty().append(this.form);

		return html;
	}
}
