import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { AttributeDataModel } from '@/data/SharedDataModels';
import SR6Actor from '@/actor/SR6Actor';
import { EnumAttribute } from '@/actor/data';

import { SR6Roll } from '@/roll/SR6Roll';

export default class LifeformActor<ActorDataModel extends LifeformDataModel = LifeformDataModel> extends SR6Actor<ActorDataModel> {
	async rollAttribute(attribute: EnumAttribute, pool_modifier: number = 0) {
		let pool: number = pool_modifier + this.attribute(attribute).value;
		let roll = new SR6Roll(`${pool}d6`, { ...this.getRollData(), actor: this }, { ...SR6Roll.defaultOptions(), attribute: attribute });
		roll = roll.evaluate({ async: false });
		await roll.toMessage();
	}

	override prepareDerivedData() {
		super.prepareDerivedData();

		this.prepareAttributes();
		this.prepareMonitors();
	}

	attribute(name: EnumAttribute): AttributeDataModel {
		return (this.systemData.attributes as any)[name];
	}

	override getRollData() {
		return {
			...super.getRollData(),
			body: this.systemData.attributes.body.value,
			agility: this.systemData.attributes.agility.value,
			reaction: this.systemData.attributes.reaction.value,
			strength: this.systemData.attributes.strength.value,
			willpower: this.systemData.attributes.willpower.value,
			logic: this.systemData.attributes.logic.value,
			intuition: this.systemData.attributes.intuition.value,
			charisma: this.systemData.attributes.charisma.value,
			magic: this.systemData.attributes.magic.value,
			resonance: this.systemData.attributes.resonance.value,
		};
	}

	prepareMonitors() {
		this.systemData.monitors.physical.max = this.solveFormula(this.systemData.monitors.physical.formula);
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
		this.systemData.attributes.magic.value = this.systemData.attributes.magic.base + this.systemData.attributes.magic.mod;
		this.systemData.attributes.resonance.value = this.systemData.attributes.resonance.base + this.systemData.attributes.resonance.mod;
	}
}
