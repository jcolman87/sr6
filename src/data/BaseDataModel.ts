import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';

export default abstract class BaseDataModel extends foundry.abstract.DataModel {
	abstract parent: SR6Item | SR6Actor | BaseDataModel;

	static _enableV10Validation = true;

	get actor(): SR6Actor | null {
		const parent = this.parent;

		if (parent instanceof SR6Actor) {
			return parent;
		} else {
			if (parent instanceof BaseDataModel) {
				return (parent as BaseDataModel).actor;
			} else if (parent instanceof SR6Item) {
				return (parent as SR6Item).actor;
			}
			return null;
		}
	}

	get item(): SR6Item | null {
		const parent = this.parent;

		if (parent instanceof SR6Item) {
			return parent;
		} else {
			if (parent instanceof BaseDataModel) {
				return (parent as BaseDataModel).item;
			}
			return null;
		}
	}

	solveFormula(formula: string): number {
		const item = this.item;
		const actor = this.actor;

		if (item) {
			return item.solveFormula(formula, actor);
		} else {
			if (actor) {
				return actor.solveFormula(formula);
			}
		}
		console.error('No parent that can solve a formula exists for this model');
		throw 'err';
	}

	prepareEmbeddedDocuments(): void {}

	prepareBaseData(): void {}

	prepareData(): void {}

	prepareDerivedData(): void {}

	getRollData(): Record<string, unknown> {
		return {};
	}
}
