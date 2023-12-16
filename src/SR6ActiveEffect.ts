import { SR6Actor } from "./actors/SR6Actor.js";

import type {
  EffectChangeData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData';


export class SR6ActiveEffect extends ActiveEffect {
	override apply(actor: Actor, change: EffectChangeData): any {
		return super.apply(actor, change);
	}

	_applyCustom(actor: Actor, change: EffectChangeData): void {
		let value: number = (actor as SR6Actor).solveFormula(change.value);
		mergeObject(actor, {[change.key]: value});
	}
}