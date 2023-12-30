import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { SR6Roll } from '@/roll/SR6Roll';
import * as util from '@/util';
import * as rollers from '@/roll/Rollers';

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
			html.find(`.chat-${i}-expand`).click(async (event: JQuery.ClickEvent<HTMLElement>) => {
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

		// Roll buttons
		html.on('click', '#roll-weapon-defense', async (event) => {
			event.preventDefault();

			util.getSelfOrSelectedActors().forEach((actor) => {
				rollers.rollWeaponDefend(actor, (this.rolls[0] as SR6Roll).hits, this.rolls[0].options as unknown as rollers.WeaponAttackRollData);
			});
		});

		html.on('click', '#roll-weapon-soak', async (event) => {
			event.preventDefault();

			util.getSelfOrSelectedActors().forEach((actor) => {
				rollers.rollWeaponSoak(actor as SR6Actor<LifeformDataModel>, (this.rolls[0] as SR6Roll).hits, this.rolls[0].options as unknown as rollers.WeaponSoakRollData);
			});
		});

		return html;
	}
}
