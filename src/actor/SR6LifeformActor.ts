import LifeformDataModel from "@/actor/data/LifeformDataModel";
import SR6Actor from '@/actor/SR6Actor';

export default class SR6LifeformActor<ActorDataModel extends LifeformDataModel = LifeformDataModel> extends SR6Actor<ActorDataModel> {

	override prepareDerivedData() {
		super.prepareDerivedData();

		this.prepareAttributes();
	}

	prepareAttributes() {
		this.systemData.attributes.body.value = this.systemData.attributes.body.base + this.systemData.attributes.body.mod;
		this.systemData.attributes.agility.value = this.systemData.attributes.agility.base + this.systemData.attributes.agility.mod;
		this.systemData.attributes.reaction.value = this.systemData.attributes.reaction.base + this.systemData.attributes.reaction.mod;
		this.systemData.attributes.strength.value = this.systemData.attributes.strength.base + this.systemData.attributes.strength.mod;
		this.systemData.attributes.willpower.value = this.systemData.attributes.willpower.base + this.systemData.attributes.willpower.mod;
		this.systemData.attributes.logic.value = this.systemData.attributes.logic.base + this.systemData.attributes.logic.mod;
		this.systemData.attributes.intuition.value = this.systemData.attributes.intuition.base + this.systemData.attributes.intuition.mod;
		this.systemData.attributes.charisma.value = this.systemData.attributes.charisma.base + this.systemData.attributes.charisma.mod;
	}
}