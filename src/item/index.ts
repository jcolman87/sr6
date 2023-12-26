/**
  *
 * @author jaynus
 * @file SR6 Items Root.
 */

import SR6Item from '@/item/SR6Item';
import { register as registerSheets } from '@/item/sheets';


export function register() {
	CONFIG.Item.documentClass = SR6Item;

	registerDataModels();
	registerSheets();
}

function registerDataModels() {
	//CONFIG.Item.dataModels.skill = SkillDataModel;
}
