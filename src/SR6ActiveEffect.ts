import { SR6Actor } from "./actors/SR6Actor.js";

import type {
  EffectChangeData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData';

import type {
  ActiveEffectData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';


export class SR6ActiveEffect extends ActiveEffect {
	constructor(data: ActiveEffectData, parent: any) {
		super(data, parent);
		console.log("SR6ActiveEffect::constructor", data, parent);
	}

	override apply(actor: Actor, change: EffectChangeData): any {
		console.log("SR6ActiveEffect::apply", actor, change);
		return super.apply(actor, change);
	}

	_applyCustom(actor: Actor, change: EffectChangeData): void {
		let value: number = (actor as SR6Actor).solveFormula(change.value);
		mergeObject(actor, {[change.key]: value});
	}
}


