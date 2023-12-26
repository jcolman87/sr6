import CharacterDataModel from "@/actor/data/CharacterDataModel";
import SR6LifeformActor from './SR6LifeformActor';

export default class SR6CharacterActor<ActorDataModel extends CharacterDataModel = CharacterDataModel>  extends SR6LifeformActor<ActorDataModel> {

	override prepareDerivedData() {
		super.prepareDerivedData();
	}
}