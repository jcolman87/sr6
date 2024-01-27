/**
 *
 * @author jaynus
 * @file Effect registration
 */
import SR6Effect from '@/effect/SR6Effect';
import SR6EffectSheet from '@/effect/SR6EffectSheet';

export function register(): void {
	CONFIG.ActiveEffect.legacyTransferral = false;

	CONFIG.ActiveEffect.documentClass = SR6Effect;

	DocumentSheetConfig.unregisterSheet(ActiveEffect, 'core', ActiveEffectConfig);
	DocumentSheetConfig.registerSheet(ActiveEffect, 'sr6', SR6EffectSheet, {
		makeDefault: true,
	});
}
