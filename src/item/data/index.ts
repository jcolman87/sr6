import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import GeneralActionDataModel from '@/item/data/action/GeneralActionDataModel';
import AdeptPowerDataModel from '@/item/data/feature/AdeptPowerDataModel';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import MatrixProgramDataModel from '@/item/data/MatrixProgramDataModel';
import SpellDataModel from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';

export async function getCoreSkills(): Promise<SR6Item<SkillDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-skills')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'skill')
			.map((i) => i as SR6Item<SkillDataModel>)
	);
}

export async function getCoreMatrixActions(): Promise<SR6Item<MatrixActionDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-matrix-actions')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'matrix_action')
			.map((i) => i as SR6Item<MatrixActionDataModel>)
	);
}

export async function getCoreGeneralActions(): Promise<SR6Item<GeneralActionDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-general-actions')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
	);
}

export async function getCoreQualities(): Promise<SR6Item<QualityDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-qualities')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'quality')
			.map((i) => i as SR6Item<QualityDataModel>)
	);
}

export async function getCoreAdeptPowers(): Promise<SR6Item<AdeptPowerDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-adeptpowers')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'adeptpower')
			.map((i) => i as SR6Item<AdeptPowerDataModel>)
	);
}

export async function getCoreWeapons(): Promise<SR6Item<WeaponDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-weapons')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'weapon')
			.map((i) => i as SR6Item<WeaponDataModel>)
	);
}

export async function getCoreSpells(): Promise<SR6Item<SpellDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-spells')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'spell')
			.map((i) => i as SR6Item<SpellDataModel>)
	);
}

export async function getCoreMatrixPrograms(): Promise<SR6Item<MatrixProgramDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-matrix-items')!;

	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'matrix_program')
			.map((i) => i as SR6Item<MatrixProgramDataModel>)
	);
}

export async function getCoreAugmentations(): Promise<SR6Item<GeneralActionDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-augmentations')!;
	return Array.from(
		(await pack.getDocuments())
			.filter((i) => (i as SR6Item).type === 'augmentation')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
	);
}

export function register(): void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).getCoreSkills = getCoreSkills;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).getCoreMatrixActions = getCoreMatrixActions;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).getCoreGeneralActions = getCoreGeneralActions;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).getCoreQualities = getCoreQualities;
}
