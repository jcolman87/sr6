export enum InitiativeType {
	Physical = 'physical',
	Matrix = 'matrix',
	Astral = 'astral',
}

export enum ActivationType {
	Passive = 'passive',
	Minor = 'minor',
	Major = 'major',
	Extended = 'extended',
}

export enum ActivationPeriod {
	Any = 'any',
	Initiative = 'initiative',
	OneMinute = '1minute',
	TenMinute = '10minute',
}

export enum ActivationPhase {
	Initiative = 'initiative',
	PreRoll = 'pre',
	PostRoll = 'post',
	Any = 'any',
}

export enum ActivationMode {
	Always = 'always',
	Manual = 'manual',
}

export type ActivationData = {
	type: ActivationType;
	period: ActivationPeriod;
	mode: ActivationMode;
};

export enum DamageType {
	Physical = 'P',
	Stun = 'S',
	Matrix = 'M',
	Biofeedback = 'B',
	Astral = 'A',
}

export enum FireMode {
	SS = 'SS',
	SA = 'SA',
	BF_narrow = 'BF_narrow',
	BF_wide = 'BF_wide',
	FA = 'FA',
}

export enum Distance {
	Close = 'close',
	Near = 'near',
	Medium = 'medium',
	Far = 'far',
	Extreme = 'extreme',
}
