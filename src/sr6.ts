/**
 *
 * @author jaynus
 * @file System Entry Point
 */

import { register as registerConfig, ready as readyConfigs } from '@/config';
import { register as registerCombat } from '@/combat';
import { register as registerEnrichers } from '@/enrichers';
import { register as registerHandlebarsHelpers, preload as preloadHandlebarsTemplates } from '@/handlebars';
import { register as registerItems, setOptGroups as registerItemOptGroups } from '@/item';
import { register as registerRolls } from '@/roll';
import { register as registerConditions } from '@/condition';
import { register as registerToken } from '@/token';

import { NAMESPACE as SETTINGS_NAMESPACE, register as registerSettings } from '@/settings';
import { KEY_ALPHA_VERSION } from '@/settings/alpha';

import { register as registerChat } from '@/chat';

import { register as registerActors, onCreate as onCreateActor, setOptGroups as registerActorOptGroups } from '@/actor';
import { register as registerEffects } from '@/effects';

import { BUGFIX } from '@/roll/Rollers';

import ImportPrompt from '@/app/ImportPrompt';

import './scss/index.scss';

import { Logger } from 'tslog';

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
		/* html*/ `
	<h3 style="font-family: 'Bebas Neue', sans-serif">SR6 Alpha ${game.system.version}</h3>
	<p>
		Hello! Thank you for giving the SR6 system a try! Please note that this system is currently in an alpha state; it is ready for some early playtesting and experimentation, but there are many features that are yet unimplemented and may be bugs!
	</p>
	<div style="text-align: center">@symbol[satfhd]</div>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Bug Fixes & Updates</h4>
	<ul style="margin-top: 0">
		<li><a href="asdf">PR #104</a>: </li>
	</ul>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Roadmap</h4>
	<ul style="margin-top: 0">
        <li><strong>0.x:</strong> CRB: X</li>
	</ul>
	<h4 style="font-family: 'Bebas Neue', sans-serif">Useful Links</h4>
	<ul style="margin-top: 0">
		<li><a href="https://github.com/jaynus/sr6/wiki">Project Wiki</a></li>
		<li><a href="https://github.com/jaynus/sr6">Project Source Code</a></li>
		<li><a href="https://github.com/jaynus/sr6/issues">Report Bugs &amp; Suggest Features</a></li>
		<li><a href="https://github.com/jaynus/sr6/blob/main/LICENSE">Licensed under the MIT License</a></li>
	</ul>
	`,
		{ async: true }
	);

	await ChatMessage.create({
		user: game.user.id,
		content: enrichedMessage,
		type: CONST.CHAT_MESSAGE_TYPES.OTHER,
	});

	await game.settings.set(SETTINGS_NAMESPACE, KEY_ALPHA_VERSION, game.system.version);
}

Hooks.once('init', async () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).log = new Logger({
		overwrite: {
			transportFormatted: (logMetaMarkup: string, logArgs: unknown[], logErrors: string[]): void => {
				console.log(...logArgs);
			},
		},
	});

	// System Documents
	registerActors();
	registerItems();
	registerConditions();
	registerEffects();
	registerRolls();

	// Misc. modules with one-time registrations
	registerCombat();
	registerEnrichers();
	registerHandlebarsHelpers();
	registerSettings();
	registerConfig();
	registerChat();
	registerToken();

	await preloadHandlebarsTemplates();

	log.info('SR6 | Initialization Complete.');
});

Hooks.once('ready', async () => {
	await doAlphaNotice();

	readyConfigs();
});

Hooks.on('createActor', async (actor: Actor, controlled: boolean): Promise<void> => {
	return onCreateActor(actor, controlled);
});

Hooks.on('renderDialog', (_dialog: Dialog, html: JQuery<HTMLElement>, _data: object): void => {
	const container = html[0];

	// Cheks if it's the item creation dialog and categorize the options from the dropdown
	if (container.classList.contains('dialog-item-create')) {
		const select = container.querySelector<HTMLSelectElement>('select[name=type]');

		if (select) {
			registerItemOptGroups(select);
			select.querySelector('option')!.selected = true;
		}

		// Cheks if it's the actor creation dialog and categorize the options from the dropdown
	} else if (container.classList.contains('dialog-actor-create')) {
		const select = container.querySelector<HTMLSelectElement>('select[name=type]');
		if (select) {
			registerActorOptGroups(select);
			select.querySelector('option')!.selected = true;
		}
	}
});

Hooks.on('renderActorDirectory', async (_app: ActorDirectory<Actor>, html: JQuery): Promise<void> => {
	const button = $("<button class='open-import-dialog'><i class='fas fa-edit'></i></i>Import</button>");

	button.click(async () => {
		new ImportPrompt().render(true);
	});

	// Render Button
	$(html).find('.header-actions').append(button);
});
