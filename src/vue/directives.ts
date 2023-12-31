/**
 *
 * @author jaynus
 * @file Vue custom directives
 */
import SR6Actor from '@/actor/SR6Actor';
import { toRaw } from 'vue';

function doLocalize(el: HTMLInputElement, binding: any) {
	if (typeof binding.arg !== 'string') {
		console.warn(`Attempt to localize non-string attribute '${binding.arg}'`);
		return;
	}

	if (typeof binding.value !== 'string' || binding.value.trim().length === 0) {
		console.warn(`Attempt to localize non-string or empty key '${binding.value}'`);
		return;
	}

	const localized = game.i18n.localize(<string>binding.value);

	(<string>binding.arg).split(',').forEach((attribute) => {
		el.setAttribute(attribute, localized);
	});
}

export const vLocalize = {
	beforeMount: doLocalize,
	updated: doLocalize,
};

export async function createNewItem(actor: SR6Actor, type: string) {
	await toRaw(actor).createEmbeddedDocuments('Item', [{ name: `new ${type}`, type: type }]);
}

export async function updateItem(actor: SR6Actor, id: string, field: string, event: Event) {
	let value = null;
	if (event.target instanceof HTMLSelectElement) {
		let target = event.target as HTMLSelectElement;
		if (target.value != '') {
			value = target.value;
		}
	} else {
		let target = event.target as HTMLInputElement;
		if (target.type == 'text') {
			value = target.value;
		} else if (target.type == 'number') {
			value = parseInt(target.value);
		}
	}

	await toRaw(actor).updateEmbeddedDocuments('Item', [
		{
			_id: id,
			[field]: value,
		},
	]);
}
