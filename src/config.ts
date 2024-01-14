/**
 *
 * @author jaynus
 * @file
 */

export const SR6_CONFIG = {};

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
