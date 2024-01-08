import { EnumAttribute } from '@/actor/data';

export enum MagicAwakenedType {
	Mundane = 'mundane',
	Full = 'full',
	Aspected = 'aspected',
	MysticAdept = 'mysticAdept',
	Adept = 'adept',
	Technomancer = 'technomancer',
}
export enum MagicTradition {
	Shamanism = 'shaman',
	Hermeticism = 'hermet',
	Technomancer = 'technomancer',
}
export const MAGIC_TRADITION_ATTRIBUTE: Record<MagicTradition, EnumAttribute> = {
	[MagicTradition.Shamanism]: EnumAttribute.charisma,
	[MagicTradition.Hermeticism]: EnumAttribute.logic,
	[MagicTradition.Technomancer]: EnumAttribute.resonance,
};

export enum SpellCombatType {
	Direct = 'direct',
	Indirect = 'indirect',
}

export enum SpellRangeType {
	Touch = 'touch',
	LineOfSight = 'los',
	LineOfSightArea = 'losa',
	Perceived = 'perceived',
}

export enum SpellDuration {
	Instantaneous = 'I',
	Sustained = 'S',
	Permanent = 'P',
	Limited = 'L',
}

export enum SpellType {
	Mana = 'M',
	Physical = 'P',
}

export enum SpellDamageForm {
	Force = 'force',
	Stun = 'stun',
	Fire = 'fire',
	Acid = 'acid',
	Electrical = 'electric',
	Air = 'air',
	Cold = 'cold',
}
