import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { IHasMatrixPersona } from '@/data/interfaces';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';
import { getActorSync, getItemSync } from '@/util';
import * as util from '@/util';
import * as rollers from '@/roll/Rollers';

export class SR6ChatMessage extends ChatMessage {
	constructor(data: PreCreate<foundry.data.ChatMessageSource>, context?: DocumentConstructionContext<ChatMessage>) {
		super(data, context);
	}

	override async getHTML(): Promise<JQuery> {
		const html = await super.getHTML();
		console.log('html', html);

		/*
		todo: alignMENT FUCKED
		html.hover(
			async (event: JQuery.MouseEnterEvent) => {
				const tip = html.find('.chat-roll-menu');
				tip.slideDown(200);
			},
			async (event: JQuery.MouseLeaveEvent) => {
				const tip = html.find('.chat-roll-menu');
				tip.slideUp(200);
			}
		);

		 */
		html.find('.heal').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			// for (const actor of util
			//	.getSelfOrSelectedActors()
			//	.filter((actor) => actor.systemData instanceof CharacterDataModel)) {
			// }
		});
		html.find('.damage').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
		});

		html.find('.click-actor').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();
			const actorId = event.currentTarget.dataset['actorId'];
			const actor = getActorSync(SR6Actor, actorId);
			if (actor && actor.token) {
				void canvas.ping(actor.token.object.center);
				return canvas.animatePan(actor.token.object.center);
			}
		});

		html.find('.click-actor').dblclick(async (event: JQuery.DoubleClickEvent<HTMLElement>) => {
			event.preventDefault();
			await getActorSync(SR6Actor, event.currentTarget.dataset['actorId'] as ActorUUID)?.sheet?.render(true);
		});

		html.find('.click-item').dblclick(async (event: JQuery.DoubleClickEvent<HTMLElement>) => {
			event.preventDefault();
			await getItemSync(SR6Item, event.currentTarget.dataset['itemId'] as ItemUUID)?.sheet?.render(true);
		});

		html.find('.chat-expand-target-box').click(async (event: JQuery.ClickEvent<HTMLElement>) => {
			event.preventDefault();

			const tip = html.find('.chat-target-box');
			if (!tip.is(':visible')) {
				tip.slideDown(200);
			} else {
				tip.slideUp(200);
			}
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

			for (const actor of util.getSelfOrSelectedActors()) {
				await rollers.rollWeaponDefend(
					actor.systemData,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.WeaponAttackRollData,
				);
			}
		});

		html.on('click', '#roll-weapon-soak', async (event) => {
			event.preventDefault();

			for (const actor of util.getSelfOrSelectedActors()) {
				await rollers.rollWeaponSoak(
					actor.systemData,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.WeaponSoakRollData,
				);
			}
		});

		// Matrix

		html.on('click', '#roll-matrix-defense', async (event) => {
			event.preventDefault();

			for (const actor of util
				.getSelfOrSelectedActors()
				.filter((actor) => actor.systemData.is<IHasMatrixPersona>())) {
				await rollers.rollMatrixDefense(
					actor.systemData as unknown as IHasMatrixPersona,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.MatrixActionRollData,
				);
			}
		});

		// Magic
		html.on('click', '#roll-spell-resist-drain', async (event) => {
			event.preventDefault();

			for (const actor of util.getSelfOrSelectedActors()) {
				await rollers.rollSpellResistDrain(
					actor.systemData as LifeformDataModel,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.SpellCastRollData,
				);
			}
		});

		html.on('click', '#roll-spell-defense', async (event) => {
			event.preventDefault();

			for (const actor of util.getSelfOrSelectedActors()) {
				await rollers.rollSpellDefend(
					actor.systemData as LifeformDataModel,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.SpellCastRollData,
				);
			}
		});

		html.on('click', '#roll-spell-soak', async (event) => {
			event.preventDefault();

			for (const actor of util.getSelfOrSelectedActors()) {
				await rollers.rollSpellSoak(
					actor.systemData as LifeformDataModel,
					(this.rolls[0] as SR6Roll).hits,
					this.rolls[0].options as unknown as rollers.SpellDefendRollData,
				);
			}
		});

		return html;
	}
}
