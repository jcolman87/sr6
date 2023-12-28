import CharacterDataModel from '@/actor/data/CharacterDataModel';
import SkillDataModel from '@/item/data/SkillDataModel';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';
import LifeformActor from './LifeformActor';

export default class CharacterActor<ActorDataModel extends CharacterDataModel = CharacterDataModel> extends LifeformActor<ActorDataModel> {
	async rollSkill(skill_name: string, pool_modifier: number = 0) {
		let skill = this.skill(skill_name)!;
		let pool: number = pool_modifier + skill.systemData.points + this.attribute(skill.systemData.attribute).value;

		let roll = new SR6Roll(`${pool}d6`, { ...this.getRollData(), actor: this }, { ...SR6Roll.defaultOptions(), skill_id: skill.id });
		roll = roll.evaluate({ async: false });
		await roll.toMessage();
	}
	skill(name: string): SR6Item<SkillDataModel> | null {
		return this.items.getName(name)?.system || null;
	}

	override prepareDerivedData() {
		super.prepareDerivedData();
	}

	override getRollData() {
		let rollData = super.getRollData();

		this.items
			.filter((item) => item.type === 'skill')
			.map((i) => i as SR6Item<SkillDataModel>)
			.forEach((skill: SR6Item<SkillDataModel>) => ((rollData as any)[skill.safe_name] = skill.systemData.points));

		return rollData;
	}

	override async onCreate(controlled: boolean) {
		super.onCreate(controlled);
		// Add default skills to our character
		let pack = game.packs.get('sr6.sr6-crb-skills')!;

		let skills: SR6Item<SkillDataModel>[] = Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<SkillDataModel>).map((i) => i as SR6Item<SkillDataModel>));
		console.log('Skills', skills);
		await this.createEmbeddedDocuments('Item', skills);
	}
}
