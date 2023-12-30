import { RollType } from '@/roll';

export default interface IHasPools {
	getPool(type: RollType): number;
}
