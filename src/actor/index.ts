/**
 *
 * @author jaynus
 * @file SR6 Actors root.
 */

import { register as registerSheets } from '@/actor/sheets';
import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Actor from '@/actor/SR6Actor';

export async function onCreate(actor: Actor, controlled: boolean) {
	return (actor as unknown as SR6Actor)._onPostCreate(controlled);
}

export function register() {
	(CONFIG.Actor.documentClass as any) = SR6Actor;

	registerDataModels();
	registerSheets();
}

function registerDataModels() {
	CONFIG.Actor.dataModels.character = CharacterDataModel;
}

export function setOptGroups(select: HTMLSelectElement) {}
