export class SR6ChatMessage extends ChatMessage {
	constructor(data: PreCreate<foundry.data.ChatMessageSource>, context?: DocumentConstructionContext<ChatMessage>) {
		super(data, context);
	}
	override async getHTML(): Promise<JQuery> {
		let html = await super.getHTML();

		html.find('.chat-expand-dice').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			let roll = $(event.currentTarget.parentElement);
			let tip = roll.find('.chat-dice-collapsible');
			if (!tip.is(':visible')) {
				tip.slideDown(200);
			} else {
				tip.slideUp(200);
			}
		});

		// Multiple formulas
		for (let i = 0; i < 9; i++) {
			html.find(`.chat-expand-${i}`).click(async (event: JQuery.ClickEvent<HTMLElement>) => {
				event.preventDefault();
				let roll = $(event.currentTarget.parentElement);
				let tip = roll.find(`.chat-${i}-collapsible`);
				if (!tip.is(':visible')) {
					tip.slideDown(200);
				} else {
					tip.slideUp(200);
				}
			});
		}

		return html;
	}
}
