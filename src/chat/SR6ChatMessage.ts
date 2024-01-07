import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import IHasMatrixPersona from '@/data/IHasMatrixPersona';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';
import { getActor, getItem } from '@/util';
import * as util from '@/util';
import * as rollers from '@/roll/Rollers';

export class SR6ChatMessage extends ChatMessage {
	constructor(data: PreCreate<foundry.data.ChatMessageSource>, context?: DocumentConstructionContext<ChatMessage>) {
		super(data, context);
	}

	override async getHTML(): Promise<JQuery> {
		const html = await super.getHTML();

		html.find('.click-actor').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			const actorId = event.currentTarget.dataset['actorId'];
			const actor = getActor(SR6Actor, actorId);
			if (actor && actor.token) {
				canvas.ping(actor.token.object.center);
				return canvas.animatePan(actor.token.object.center);
			}
		});

		html.find('.click-actor').dblclick(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			const actorId = event.currentTarget.dataset['actorId'];
			const actor = getActor(SR6Actor, actorId);
			actor.sheet?.render(true);
		});

		html.find('.click-item').dblclick(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			const itemId = event.currentTarget.dataset['itemId'];
			const item = getItem(SR6Item, itemId);
			item.sheet?.render(true);
		});

		html.find('.chat-expand-dice').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();

			const tip = html.find('.chat-dice-collapsible');
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

				const tip = html.find(`.chat-${i}-collapsible`);
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
				rollers.rollWeaponDefend(
					actor.systemData,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.WeaponAttackRollData
				);
			});
		});

		html.on('click', '#roll-weapon-soak', async (event) => {
			event.preventDefault();

			util.getSelfOrSelectedActors().forEach((actor) => {
				rollers.rollWeaponSoak(
					actor.systemData,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.WeaponSoakRollData
				);
			});
		});

		// Matrix

		html.on('click', '#roll-matrix-defense', async (event) => {
			event.preventDefault();

			util.getSelfOrSelectedActors()
				.filter((actor) => actor.systemData.is<IHasMatrixPersona>())
				.forEach((actor) => {
					rollers.rollMatrixDefense(
						actor.systemData as unknown as IHasMatrixPersona,
						(this.rolls[0] as SR6Roll).hits,
						this.rolls[0].options as unknown as rollers.MatrixActionRollData
					);
				});
		});

		return html;
	}
}
