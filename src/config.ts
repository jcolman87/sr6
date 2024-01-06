/**
 *
 * @author jaynus
 * @file
 */

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import MatrixHostDataModel from '@/actor/data/MatrixHostDataModel';
import MatrixICDataModel from '@/item/data/MatrixICDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel from '@/condition/ConditionDataModel';
import GeneralActionDataModel from '@/item/data/action/GeneralActionDataModel';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';

import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import AdeptPowerDataModel from '@/item/data/feature/AdeptPowerDataModel';
import AugmentationDataModel from '@/item/data/feature/AugmentationDataModel';
import ComplexFormDataModel from '@/item/data/feature/ComplexFormDataModel';
import ContactDataModel from '@/item/data/feature/ContactDataModel';
import LifestyleDataModel from '@/item/data/feature/LifestyleDataModel';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import SINDataModel from '@/item/data/feature/SINDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SpellDataModel from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';

import { NAMESPACE as SETTINGS_NAMESPACE } from '@/settings';
import { KEY_USE_MAGICAL_GIRL_SYMBOLS } from '@/settings/user';

export const SR6_CONFIG = {
	/**
	 * Whether to use the Magical Girl symbols where possible in the system.
	 */
	useMagicalGirlSymbols: true,

	/*
	Actor: {
		documentClasses: {
			character: SR6Actor<CharacterDataModel>,
			matrix_host: SR6Actor<MatrixHostDataModel>,
			matrix_ic: SR6Actor<MatrixICDataModel>,
		},
	},
	Item: {
		documentClasses: {
			gear: SR6Item<GearDataModel>,
			weapon: SR6Item<WeaponDataModel>,
			skill: SR6Item<SkillDataModel>,
			contact: SR6Item<ContactDataModel>,
			sin: SR6Item<SINDataModel>,
			lifestyle: SR6Item<LifestyleDataModel>,
			quality: SR6Item<QualityDataModel>,
			augmentation: SR6Item<AugmentationDataModel>,
			spell: SR6Item<SpellDataModel>,
			adeptpower: SR6Item<AdeptPowerDataModel>,
			complexform: SR6Item<ComplexFormDataModel>,
			matrix_action: SR6Item<MatrixActionDataModel>,
			matrix_persona: SR6Item<MatrixPersonaDataModel>,
			general_action: SR6Item<GeneralActionDataModel>,
			condition: SR6Item<ConditionDataModel>,
		},
	},

	 */
};

/**
 * Called during 'init' hook to initialize the SR6 config data.
 */
export function register(): void {
	CONFIG.sr6 = SR6_CONFIG;
}

/**
 * Called on 'ready' to initialize values that rely on items established in init.
 */
export function ready(): void {
	// CONFIG.sr6.useMagicalGirlSymbols = game.settings.get(SETTINGS_NAMESPACE, KEY_USE_MAGICAL_GIRL_SYMBOLS) as boolean;
}
