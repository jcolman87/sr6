import MatrixActionDataModel from '@/item/data/MatrixActionDataModel';
import SkillDataModel from '@/item/data/SkillDataModel';
import SR6Item from '@/item/SR6Item';

export async function getCoreSkills(): Promise<SR6Item<SkillDataModel>[]> {
	let pack = game.packs.get('sr6.sr6-crb-skills')!;

	return Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<SkillDataModel>).map((i) => i as SR6Item<SkillDataModel>));
}

export async function getCoreMatrixActions(): Promise<SR6Item<MatrixActionDataModel>[]> {
	let pack = game.packs.get('sr6.sr6-crb-matrix-actions')!;

	return Array.from((await pack.getDocuments()).filter((i) => i instanceof SR6Item<MatrixActionDataModel>).map((i) => i as SR6Item<MatrixActionDataModel>));
}
