/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import { MatrixAccessLevel } from '@/item/data/MatrixActionDataModel';

export enum EffectActivation {
	Always = 'always',
	OnHit = 'onhit',
	OnUse = 'onuse',
}

export default class SR6Effect extends ActiveEffect {
	activation: EffectActivation = EffectActivation.Always;

	override get isSuppressed() {
		return this.disabled;
	}

	static override defineSchema() {
		return {
			...foundry.documents.BaseActiveEffect.defineSchema(),
			activation: new foundry.data.fields.StringField({ initial: EffectActivation.Always, required: true, nullable: false, blank: false, choices: Object.values(EffectActivation) }),
		};
	}

	override apply(actor: Actor, change: ApplicableChangeData<this>): unknown {
		return super.apply(actor, change);
	}
}
