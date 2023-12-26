/**
  *
 * @author jaynus
 * @file Effect registration
 */
import SR6Effect from '@/effects/SR6Effect';
import SR6EffectSheet from '@/effects/SR6EffectSheet';

export function register() {
	CONFIG.ActiveEffect.documentClass = SR6Effect;

	DocumentSheetConfig.unregisterSheet(ActiveEffect, 'core', ActiveEffectConfig);
	DocumentSheetConfig.registerSheet(ActiveEffect, 'sr6', SR6EffectSheet, {
		makeDefault: true,
	});
}
