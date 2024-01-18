import { Distance } from '@/data';
import { BaseTestData } from '@/roll/test/BaseTest';

export default interface AttackTestData extends BaseTestData {
	targetIds: ActorUUID[];
	damage: number;
	attackRating: number;
	distance: Distance;
}
