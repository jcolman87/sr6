/**
 *
 * @author jaynus
 * @file Item Sheet Registration
 */

import VueSheet from '@/vue/VueSheet';

import SR6ItemSheet from '@/item/SR6ItemSheet';

import MatrixActionSheet from '@/vue/sheets/item/MatrixActionSheet.vue';
import SkillSheet from '@/vue/sheets/item/SkillSheet.vue';

import { SR6ItemSheetData, ItemSheetContext } from '@/vue/SheetContext';

type VueSheetConstructor = new (...args: any[]) => {
	get vueComponent(): any;
	getVueContext(): Promise<ItemSheetContext | undefined>;
};

/**
 * Constructs a vue-based ItemSheet subclass with little extra processing.
 * @param vueComponent Vue component to use for the sheet.
 * @param sheetType Base class to use for the sheet.
 */
function basicSheet(vueComponent: any, sheetType: VueSheetConstructor = VueSheet(SR6ItemSheet)) {
	return class extends sheetType {
		override get vueComponent() {
			return vueComponent;
		}

		override async getVueContext(): Promise<ItemSheetContext | undefined> {
			const thisAsSheet = this as unknown as SR6ItemSheet;
			return {
				sheet: thisAsSheet,
				data: (await thisAsSheet.getData()) as SR6ItemSheetData,
			};
		}
	};
}

/**
 * Registers Item sheets used by the system.
 */
export function register() {
	Items.unregisterSheet('core', ItemSheet);

	Items.registerSheet('sr6', basicSheet(SkillSheet), {
		types: ['skill'],
		makeDefault: true,
	});

	Items.registerSheet('sr6', basicSheet(MatrixActionSheet), {
		types: ['matrix_action'],
		makeDefault: true,
	});
}
