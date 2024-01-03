import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import GeneralActionDataModel from '@/item/data/action/GeneralActionDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import SR6Item from '@/item/SR6Item';

export async function getCoreSkills(): Promise<SR6Item<SkillDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-skills')!;

	return Array.from((await pack.getDocuments()).map((i) => i as SR6Item<SkillDataModel>));
}

export async function getCoreMatrixActions(): Promise<SR6Item<MatrixActionDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-matrix-actions')!;

	return Array.from((await pack.getDocuments()).map((i) => i as SR6Item<MatrixActionDataModel>));
}

export async function getCoreGeneralActions(): Promise<SR6Item<GeneralActionDataModel>[]> {
	const pack = game.packs.get('sr6.sr6-crb-combat-actions')!;

	return Array.from((await pack.getDocuments()).map((i) => i as SR6Item<GeneralActionDataModel>));
}
