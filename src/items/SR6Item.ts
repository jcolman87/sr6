import { ItemFormula, ItemData, ItemTypes } from "./Data.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Roll } from "../SR6Roll.js";

export class SR6Item extends Item {
	solveFormula(formula: ItemFormula): number {
		return this.solveFormulaWithActor(this.actor! as SR6Actor, formula);
	}
	solveFormulaWithActor(actor: SR6Actor, formula: ItemFormula): number {
		//console.log("SR6Item::solveFormulaWithActor", formula);

		let roll = new SR6Roll(formula as string, { actor: actor, item: this });
		roll.evaluate({ async: false });
		//console.log("solved", formula, roll);
		return roll.total!;
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

	get damage(): undefined | number {
		let formula: string = this.weapon()!.damage as string;
		return this.solveFormula(formula);
	}

	getData(): ItemData {
		let data: ItemData = (this as any).system;
		return data;
	}
}
