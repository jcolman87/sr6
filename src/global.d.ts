/**
 *
 * @author jaynus
 * @file Provides overridden, system-specific type data for Foundry's CONFIG global.
 */

import SR6Actor from '@/actor/SR6Actor';
import SR6Effect from '@/effects/SR6Effect';
import SR6Item from '@/item/SR6Item';
import SR6Combat from '@/combat/SR6Combat';
import SR6Combatant from '@/combat/SR6Combatant';
import SR6CombatTracker from '@/combat/SR6CombatTracker';
import { SR6_CONFIG } from '@/config';
import { Logger } from 'tslog';

declare global {
	declare let log: Logger;

	const ui: FoundryUI;

	const canvas: Canvas;

	interface SR6Config
		extends Config<
			AmbientLightDocument,
			SR6Effect,
			SR6Actor,
			ActorDirectory<SR6Actor>,
			ChatLog,
			ChatMessage,
			SR6Combat,
			SR6Combatant,
			SR6CombatTracker,
			CompendiumDirectory,
			Hotbar,
			SR6Item,
			Macro,
			MeasuredTemplateDocument,
			TileDocument,
			TokenDocument,
			Scene,
			User,
			EffectsCanvasGroup
		> {
		sr6: typeof SR6_CONFIG;
	}
	const CONFIG: SR6Config;

	interface SR6Game extends Game<SR6Actor, Actors, ChatMessage, SR6Combat, SR6Item, Macro, Scene, User> {
		dice3d: Dice3d;
	}

	const game: SR6Game;

	interface LoggerParams {
		type?: 'log' | 'trace' | 'warn' | 'info' | 'debug';
		inputs?: boolean;
		outputs?: boolean;
	}

	const defaultParams: Required<LoggerParams> = {
		type: 'log',
		inputs: true,
		outputs: true,
	};
}
