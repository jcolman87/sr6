import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { toggleStatusEffectCondition } from '@/condition';

export class SR6TokenDocument extends TokenDocument {}

export class SR6Token<TDocument extends TokenDocument = SR6TokenDocument> extends Token<TDocument> {
	constructor(document: TDocument) {
		super(document);
	}

	get systemActor(): null | SR6Actor<BaseActorDataModel> {
		return this.actor as SR6Actor<BaseActorDataModel>;
	}

	override async toggleEffect(
		effect: StatusEffect,
		{ active, overlay }: { active?: boolean; overlay?: boolean }
	): Promise<boolean> {
		const path = effect.id.split('.');
		if (this.actor && path[0] === 'sr6' && path[1] === 'condition' && path.length === 3) {
			// Find the matching condition from the conditions pack
			const res = await toggleStatusEffectCondition(effect.id, this.actor as SR6Actor);
			await this.drawEffects();
			return res;
		} else {
			return super.toggleEffect(effect, { active, overlay });
		}
	}
}
