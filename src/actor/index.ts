/**
 *
 * @author jaynus
 * @file SR6 Actors root.
 */

import { register as registerSheets } from '@/actor/sheets';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { SR6ActorProxy } from '@/actor/SR6ActorProxy';

import SR6Actor from '@/actor/SR6Actor';

export function onCreate(actor: Actor, controlled: boolean): void {
	(actor as SR6Actor).onCreate(controlled);
}

export function register() {
	(CONFIG.Actor.documentClass as any) = SR6ActorProxy;

	registerDataModels();
	registerSheets();
}

export const AdversaryTypes = ['minion', 'nemesis', 'rival'];

function registerDataModels() {
	CONFIG.Actor.dataModels.character = CharacterDataModel;
}
