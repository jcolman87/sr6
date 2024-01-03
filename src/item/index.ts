/**
 *
 * @author jaynus
 * @file SR6 Items Root.
 */
import GeneralActionDataModel from '@/item/data/action/GeneralActionDataModel';
import ComplexFormDataModel from '@/item/data/feature/ComplexFormDataModel';
import SR6Item from '@/item/SR6Item';
import { register as registerSheets } from '@/item/sheets';
import { constructOptGroup } from '@/util';

import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';

import SkillDataModel from '@/item/data/feature/SkillDataModel';
import ContactDataModel from '@/item/data/feature/ContactDataModel';
import SINDataModel from '@/item/data/feature/SINDataModel';
import LifestyleDataModel from '@/item/data/feature/LifestyleDataModel';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import AdeptPowerDataModel from '@/item/data/feature/AdeptPowerDataModel';
import AugmentationDataModel from '@/item/data/feature/AugmentationDataModel';
import SpellDataModel from '@/item/data/SpellDataModel';

import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';

export function register(): void {
	CONFIG.Item.documentClass = SR6Item;

	registerDataModels();
	registerSheets();
}

export const CharacterItemTypes = [
	'skill',
	'contact',
	'sin',
	'lifestyle',
	'augmentation',
	'quality',
	'adeptpower',
	'complexform',
];

export const GearItemTypes = ['weapon', 'gear', 'credstick'];

export const MatrixItemTypes = ['matrix_action', 'matrix_persona'];

export const GameplayItemTypes = ['condition'];

function registerDataModels(): void {
	// Gear
	CONFIG.Item.dataModels.weapon = WeaponDataModel;
	CONFIG.Item.dataModels.gear = GearDataModel;
	CONFIG.Item.dataModels.credstick = GearDataModel;

	// Character
	CONFIG.Item.dataModels.skill = SkillDataModel;
	CONFIG.Item.dataModels.contact = ContactDataModel;
	CONFIG.Item.dataModels.sin = SINDataModel;
	CONFIG.Item.dataModels.lifestyle = LifestyleDataModel;
	CONFIG.Item.dataModels.augmentation = AugmentationDataModel;
	CONFIG.Item.dataModels.quality = QualityDataModel;
	CONFIG.Item.dataModels.adeptpower = AdeptPowerDataModel;
	CONFIG.Item.dataModels.complexform = ComplexFormDataModel;
	CONFIG.Item.dataModels.spell = SpellDataModel;

	// Matrix
	CONFIG.Item.dataModels.matrix_action = MatrixActionDataModel;
	CONFIG.Item.dataModels.matrix_persona = MatrixPersonaDataModel;

	//
	CONFIG.Item.dataModels.general_action = GeneralActionDataModel;
}

export function setOptGroups(select: HTMLSelectElement): void {
	select.append(
		constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Character'), CharacterItemTypes),
		constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Gear'), GearItemTypes),
		constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Matrix'), MatrixItemTypes),
		constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Matrix'), GameplayItemTypes),
		constructOptGroup(select, game.i18n.localize('SR6.DialogGroups.Item.Other'))
	);
}
