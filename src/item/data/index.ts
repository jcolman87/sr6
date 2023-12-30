import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import GeneralActionDataModel from '@/item/data/action/GeneralActionDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import SR6Item from '@/item/SR6Item';

export async function getCoreSkills(): Promise<SR6Item<SkillDataModel>[]> {
	let pack = game.packs.get('sr6.sr6-crb-skills')!;

	return Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<SkillDataModel>).map((i) => i as SR6Item<SkillDataModel>));
}

export async function getCoreMatrixActions(): Promise<SR6Item<MatrixActionDataModel>[]> {
	let pack = game.packs.get('sr6.sr6-crb-matrix-actions')!;

	return Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<MatrixActionDataModel>).map((i) => i as SR6Item<MatrixActionDataModel>));
}

export async function getCoreGeneralActions(): Promise<SR6Item<GeneralActionDataModel>[]> {
	let pack = game.packs.get('sr6.sr6-crb-combat-actions')!;

	return Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<MatrixActionDataModel>).map((i) => i as SR6Item<GeneralActionDataModel>));
}
