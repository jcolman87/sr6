/**
 *
 * @author jaynus
 * @file System Entry Point
 */

import { register as registerConfig, ready as readyConfigs } from '@/config';
import { register as registerCombat } from '@/combat';
import { register as registerEnrichers } from '@/enrichers';
import { register as registerHandlebarsHelpers, preload as preloadHandlebarsTemplates } from '@/handlebars';
import { register as registerItems } from '@/item';
import { register as registerRolls } from '@/roll';
import { NAMESPACE as SETTINGS_NAMESPACE, register as registerSettings } from '@/settings';
import { KEY_ALPHA_VERSION } from '@/settings/alpha';

import { register as registerChat } from '@/chat';

import { register as registerActors, AdversaryTypes, onCreate as onCreateActor } from '@/actor';
import { register as registerEffects } from '@/effects';

import './scss/index.scss';

async function doAlphaNotice() {
	if (!game.user.isGM) {
		return;
	}

	// Get the last-acknowledged Alpha version notice.
	const lastAlpha = game.settings.get(SETTINGS_NAMESPACE, KEY_ALPHA_VERSION) as string;

	const [lastMajor, lastMinor, lastRevision] = lastAlpha.split('.').map((v) => parseInt(v));
	const [currMajor, currMinor, currRevision] = game.system.version.split('.').map((v) => parseInt(v));

	if (lastMajor >= currMajor && lastMinor >= currMinor && lastRevision >= currRevision) {
		return;
	}

	const enrichedMessage = await TextEditor.enrichHTML(
		/*html*/ `
	<h3 style="font-family: 'Bebas Neue', sans-serif">SR6 Alpha ${game.system.version}</h3>
	<p>
		Hello! Thank you for giving the SR6 system a try! Please note that this system is currently in an alpha state; it is ready for some early playtesting and experimentation, but there are many features that are yet unimplemented and may be bugs!
	</p>
	<div style="text-align: center">@symbol[satfhd]</div>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Bug Fixes & Updates</h4>
	<ul style="margin-top: 0">
		<li><a href="https://github.com/Mezryss/FVTT-SR6/pull/104">PR #104</a>: Feature - Adds an alternate way to calculate the chance to succeed (FVTTv11 only)</li>
        <li><a href="https://github.com/Mezryss/FVTT-SR6/pull/105">PR #105</a>: Enhancement - Additional enhacenments and fixes to vehicle's sheets</li>
	</ul>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Roadmap</h4>
	<ul style="margin-top: 0">
        <li><strong>0.3:</strong> CRB: Attachments optional rule</li>
        <li><strong>0.4:</strong> CRB: Magic optional rule</li>
        <li><strong>1.0:</strong> Core Rulebook Compatibility</li>
		<li><strong>1.1:</strong> Expanded Player's Guide Compatibility</li>
		<li><strong>1.2:</strong> First-Party Setting Books Compatibility</li>
		<li><strong>1.3:</strong> Community Feature Focus</li>
		<li><strong>1.4:</strong> Automation Focus</li>
	</ul>
	<div style="text-align: center">@dice[apbdcs]</div>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Useful Links</h4>
	<ul style="margin-top: 0">
		<li><a href="https://github.com/Mezryss/FVTT-SR6/wiki">Project Wiki</a></li>
		<li><a href="https://github.com/Mezryss/FVTT-SR6">Project Source Code</a></li>
		<li><a href="https://github.com/Mezryss/FVTT-SR6/discussions">Discuss The System</a></li>
		<li><a href="https://github.com/Mezryss/FVTT-SR6/issues">Report Bugs &amp; Suggest Features</a></li>
		<li><a href="https://github.com/Mezryss/FVTT-SR6/blob/main/LICENSE">Licensed under the MIT License</a></li>
	</ul>
	`,
		{ async: true },
	);

	await ChatMessage.create({
		user: game.user.id,
		content: enrichedMessage,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
	});

	await game.settings.set(SETTINGS_NAMESPACE, KEY_ALPHA_VERSION, game.system.version);
}

Hooks.once('init', async () => {
	console.debug('SR6 | Initializing...');

	// System Documents
	registerActors();
	registerItems();
	registerEffects();
	registerRolls();

	// Misc. modules with one-time registrations
	registerCombat();
	registerEnrichers();
	registerHandlebarsHelpers();
	registerSettings();
	registerConfig();
	registerChat();

	await preloadHandlebarsTemplates();

	console.debug('SR6 | Initialization Complete.');
});

Hooks.once('ready', async () => {
	await doAlphaNotice();

	readyConfigs();
});

function constructOptGroup(select: HTMLSelectElement, groupLabel: string, optValues?: string[]): HTMLOptGroupElement {
	const options = select.querySelectorAll<HTMLOptionElement>(':scope > option');
	const optgroup = document.createElement('optgroup');

	optgroup.label = groupLabel;
	optgroup.append(...Array.from(options).filter((option) => !optValues || optValues.includes(option.value)));

	return optgroup;
}

Hooks.on('createActor', (actor: Actor, controlled: boolean) => {
	onCreateActor(actor, controlled);
});

Hooks.on('renderDialog', (_dialog: Dialog, html: JQuery<HTMLElement>, _data: object) => {
	const container = html[0];

	/*
	// Cheks if it's the item creation dialog and categorize the options from the dropdown
	if (container.classList.contains('dialog-item-create')) {
		const select = container.querySelector<HTMLSelectElement>('select[name=type]');

		if (select) {
			select.append(
				constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.CharacterCreation'), CharacterCreationItemTypes),
				constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Equipment'), EquipmentItemTypes),
				constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Other')),
			);
			select.querySelector('option')!.selected = true;
		}


		// Cheks if it's the actor creation dialog and categorize the options from the dropdown
	} else if (container.classList.contains('dialog-actor-create')) {
		const select = container.querySelector<HTMLSelectElement>('select[name=type]');

		if (select) {
			select.append(constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Actor.Adversary'), AdversaryTypes), constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Actor.Other')));
			select.querySelector('option')!.selected = true;
		}
	}
	*/
});
