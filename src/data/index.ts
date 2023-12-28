export { SkillUseDataModel } from '@/data/SharedDataModels';

export enum ActivationType {
	Passive = 'passive',
	Minor = 'minor',
	Major = 'major',
	Extended = 'extended',
}

export enum ActivationPeriod {
	Any = 'any',
	Initiative = 'initiative',
	PreRoll = 'pre',
	PostRoll = 'post',
	OneMinute = '1minute',
	TenMinute = '10minute',
}
