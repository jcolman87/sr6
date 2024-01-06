/**
 *
 * @author jaynus
 * @file SR6 Actors root.
 */

import MatrixHostDataModel from '@/actor/data/MatrixHostDataModel';
import { register as registerSheets } from '@/actor/sheets';
import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Actor from '@/actor/SR6Actor';

export async function onCreate(actor: Actor): Promise<void> {
	return (actor as unknown as SR6Actor)._onPostCreate();
}

export function register(): void {
	CONFIG.Actor.documentClass = SR6Actor;

	registerDataModels();
	registerSheets();
}

function registerDataModels(): void {
	CONFIG.Actor.dataModels.character = CharacterDataModel;
	CONFIG.Actor.dataModels.matrix_host = MatrixHostDataModel;
}

export function setOptGroups(select: HTMLSelectElement): void {}
