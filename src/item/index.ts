/**
 *
 * @author jaynus
 * @file SR6 Items Root.
 */

import SR6Item from '@/item/SR6Item';
import { register as registerSheets } from '@/item/sheets';

import MatrixActionDataModel from '@/item/data/MatrixActionDataModel';
import SkillDataModel from '@/item/data/SkillDataModel';
import { MatrixPersonaDataModel } from '@/item/data/MatrixPersonaDataModel';

export function register() {
	CONFIG.Item.documentClass = SR6Item;

	registerDataModels();
	registerSheets();
}

function registerDataModels() {
	CONFIG.Item.dataModels.skill = SkillDataModel;
	CONFIG.Item.dataModels.matrix_action = MatrixActionDataModel;
	CONFIG.Item.dataModels.matrix_persona = MatrixPersonaDataModel;
}
