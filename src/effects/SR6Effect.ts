/**
 *
 * @author jaynus
 * @file ActiveEffects Customizations
 */
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';

export default class SR6Effect extends ActiveEffect {
	constructor(data: PreCreate<foundry.data.ActiveEffectSource>, context?: DocumentConstructionContext<ActiveEffect>) {
		log.debug(`${JSON.stringify(data)}`);
		super(data, context);
	}

	override prepareDerivedData() {
		super.prepareDerivedData();
	}

	override get isSuppressed() {
		return this.disabled;
	}

	override apply(actor: Actor, change: ApplicableChangeData<this>): unknown {
		return super.apply(actor, change);
	}

	override _applyCustom(actor: Actor, change: ApplicableChangeData<this>): unknown {
		let baseActor = actor as SR6Actor<BaseActorDataModel>;

		return null;
	}
}
