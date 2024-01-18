import { config as configTests } from '@/roll/test/index';

export const SR6_CONFIG = {
	tests: configTests(),
};

export function register(): void {
	CONFIG.sr6 = SR6_CONFIG;
}

export function ready(): void {
	// CONFIG.sr6.useMagicalGirlSymbols = game.settings.get(SETTINGS_NAMESPACE, KEY_USE_MAGICAL_GIRL_SYMBOLS) as boolean;
}
