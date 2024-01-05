/**
 *
 * @author jaynus
 * @file Item Sheet Registration
 */

import BasicItemSheet from '@/vue/sheets/item/BasicItemSheet.vue';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';
import SR6ItemSheet from '@/item/SR6ItemSheet';

import MatrixActionSheet from '@/vue/sheets/item/MatrixActionSheet.vue';
import SkillSheet from '@/vue/sheets/item/SkillSheet.vue';

import { SR6ItemSheetData, ItemSheetContext } from '@/vue/SheetContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VueSheetConstructor = new (...args: any[]) => {
	get vueComponent(): Component;
	getVueContext(): Promise<ItemSheetContext | undefined>;
};

/**
 * Constructs a vue-based ItemSheet subclass with little extra processing.
 * @param vueComponent Vue component to use for the sheet.
 * @param sheetType Base class to use for the sheet.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function basicSheet(vueComponent: Component, sheetType: any = VueSheet(SR6ItemSheet)): typeof sheetType {
	return class extends sheetType {
		get vueComponent(): Component {
			return vueComponent;
		}

		async getVueContext(): Promise<ItemSheetContext | undefined> {
			const thisAsSheet = this as unknown as SR6ItemSheet;
			return {
				sheet: thisAsSheet,
				data: (await thisAsSheet.getData()) as SR6ItemSheetData,
				user: game.user!,
			};
		}
	};
}

/**
 * Registers Item sheets used by the system.
 */
export function register(): void {
	Items.unregisterSheet('core', ItemSheet);

	Items.registerSheet('sr6', basicSheet(BasicItemSheet), {
		types: [
			'gear',
			'weapon',
			'credstick',
			'contact',
			'sin',
			'lifestyle',
			'quality',
			'augmentation',
			'spell',
			'adeptpower',
			'complexform',
			'matrix_action',
			'matrix_persona',
			'general_action',
		],
		makeDefault: true,
	});

	Items.registerSheet('sr6', basicSheet(SkillSheet), {
		types: ['skill'],
		makeDefault: true,
	});

	Items.registerSheet('sr6', basicSheet(MatrixActionSheet), {
		types: ['matrix_action'],
		makeDefault: true,
	});
}
