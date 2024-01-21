import { Distance } from '@/data';
import { BaseTestData } from '@/test/BaseTest';

export default interface AttackTestData extends BaseTestData {
	targetIds?: ActorUUID[];
	damage?: number;
	attackRating?: number;
	distance?: Distance;
}
