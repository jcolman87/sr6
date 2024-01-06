import { IHasActor } from '@/data/IHasActor';
import { RollType } from '@/roll';

export default interface IHasPools extends IHasActor {
	getPool(type: RollType): number;
}
