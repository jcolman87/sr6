/**
  *
 * @author jaynus
 * @file
 */

import { NAMESPACE as SETTINGS_NAMESPACE } from '@/settings';
import { KEY_USE_MAGICAL_GIRL_SYMBOLS } from '@/settings/user';

export const SR6_CONFIG = {
	/**
	 * Whether to use the Magical Girl symbols where possible in the system.
	 */
	useMagicalGirlSymbols: true,
};

/**
 * Called during 'init' hook to initialize the SR6 config data.
 */
export function register() {
	CONFIG.sr6 = SR6_CONFIG;
}

/**
 * Called on 'ready' to initialize values that rely on items established in init.
 */
export function ready() {
	CONFIG.sr6.useMagicalGirlSymbols = game.settings.get(SETTINGS_NAMESPACE, KEY_USE_MAGICAL_GIRL_SYMBOLS) as boolean;
}
