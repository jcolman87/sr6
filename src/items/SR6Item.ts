import { ItemFormula, ItemData, ItemTypes } from "./Data.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Roll } from "../SR6Roll.js";
import { Enums } from "../config.js";

export class SR6Item extends Item {
	solveFormula(formula: ItemFormula): number {
		return this.solveFormulaWithActor(this.actor as SR6Actor, formula);
	}
	solveFormulaWithActor(actor: SR6Actor | undefined, formula: ItemFormula): number {
		//console.log("SR6Item::solveFormulaWithActor", formula);

		let roll = new SR6Roll(formula as string, { actor: actor, item: this });
		roll.evaluate({ async: false });
		//console.log("solved", formula, roll);
		return roll.total!;
	}

	prepareData() {
		// TODO: Validate the data types for various item types
	}

	getAttackRating(distance: Enums.Distance): number {
		switch(distance) {
			case Enums.Distance.Close: return this.solveFormula(this.weapon()!.attack_ratings.close);
			case Enums.Distance.Near: return this.solveFormula(this.weapon()!.attack_ratings.near);
			case Enums.Distance.Medium: return this.solveFormula(this.weapon()!.attack_ratings.medium);
			case Enums.Distance.Far: return this.solveFormula(this.weapon()!.attack_ratings.far);
			case Enums.Distance.Extreme: return this.solveFormula(this.weapon()!.attack_ratings.extreme);
			default: return 0;
		}
	}
	get damage(): number {
		return this.solveFormula(this.weapon()!.damage);
	}

	addType(ty: ItemTypes.Types) {
		let data = this.getData();
		data.types = data.types | ty;

		switch (ty) {
			case ItemTypes.Types.Cost:
				mergeObject(data, new ItemTypes.Cost());
				break;
			case ItemTypes.Types.Capacity:
				mergeObject(data, new ItemTypes.Capacity());
				break;
			case ItemTypes.Types.Defense:
				mergeObject(data, new ItemTypes.Defense());
				break;
			case ItemTypes.Types.Matrix:
				mergeObject(data, new ItemTypes.Matrix());
				break;
			case ItemTypes.Types.Explosive:
				mergeObject(data, new ItemTypes.Explosive());
				break;
			case ItemTypes.Types.Weapon:
				mergeObject(data, new ItemTypes.Weapon());
				break;
			case ItemTypes.Types.Firearm:
				mergeObject(data, new ItemTypes.Firearm());
				break;
			case ItemTypes.Types.Mountable:
				mergeObject(data, new ItemTypes.Mountable());
				break;
			case ItemTypes.Types.SkillUse:
				mergeObject(data, new ItemTypes.SkillUse());
				break;
			default:
				throw "WTF";
		}

		this.update({
			["system"]: data
		});
	}

	removeType(ty: ItemTypes.Types) {
		this.update({
			["system.types"]: this.getData().types & ~ty
		});
	}

	has(ty: ItemTypes.Types): boolean {
		return (this.getData().types & ty) == ty;
	}

	cost(): undefined | ItemTypes.Cost {
		if (!this.has(ItemTypes.Types.Cost)) return undefined;
		return this.getData() as unknown as ItemTypes.Cost;
	}
	skill_use(): undefined | ItemTypes.SkillUse {
		if (!this.has(ItemTypes.Types.SkillUse)) return undefined;
		return this.getData() as unknown as ItemTypes.SkillUse;
	}
	capacity(): undefined | ItemTypes.Capacity {
		if (!this.has(ItemTypes.Types.Capacity)) return undefined;
		return this.getData() as unknown as ItemTypes.Capacity;
	}
	defense(): undefined | ItemTypes.Defense {
		if (!this.has(ItemTypes.Types.Cost)) return undefined;
		return this.getData() as unknown as ItemTypes.Defense;
	}
	matrix(): undefined | ItemTypes.Matrix {
		if (!this.has(ItemTypes.Types.Matrix)) return undefined;
		return this.getData() as unknown as ItemTypes.Matrix;
	}
	mountable(): undefined | ItemTypes.Mountable {
		if (!this.has(ItemTypes.Types.Mountable)) return undefined;
		return this.getData() as unknown as ItemTypes.Mountable;
	}
	explosive(): undefined | ItemTypes.Explosive {
		if (!this.has(ItemTypes.Types.Explosive)) return undefined;
		return this.getData() as unknown as ItemTypes.Explosive;
	}
	weapon(): undefined | ItemTypes.Weapon {
		if (!this.has(ItemTypes.Types.Weapon)) return undefined;
		return this.getData() as unknown as ItemTypes.Weapon;
	}
	firearm(): undefined | ItemTypes.Firearm {
		if (!this.has(ItemTypes.Types.Firearm)) return undefined;
		return this.getData() as unknown as ItemTypes.Firearm;
	}

	getData(): ItemData {
		let data: ItemData = (this as any).system;
		return data;
	}
}
