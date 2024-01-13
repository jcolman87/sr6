/**
 *
 * @author jaynus
 * @file
 */

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
