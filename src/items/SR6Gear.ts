import { ItemFormula, GearData, GearTypes } from "./Data.js";
import { SR6Item } from "./SR6Item.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import * as Rolls from "../rolls/Rolls.js";
import { Enums, SkillUse } from "../config.js";

export class SR6Gear extends SR6Item {
	getAttackRating(distance: Enums.Distance): number {
		switch (distance) {
			case Enums.Distance.Close:
				return this.solveFormula(this.weapon!.attack_ratings.close);
			case Enums.Distance.Near:
				return this.solveFormula(this.weapon!.attack_ratings.near);
			case Enums.Distance.Medium:
				return this.solveFormula(this.weapon!.attack_ratings.medium);
			case Enums.Distance.Far:
				return this.solveFormula(this.weapon!.attack_ratings.far);
			case Enums.Distance.Extreme:
				return this.solveFormula(this.weapon!.attack_ratings.extreme);
			default:
				return 0;
		}
	}
	get damage(): number {
		return this.solveFormula(this.weapon!.damage);
	}

	addType(ty: GearTypes.Types) {
		let data = this.getData();
		data.types = data.types | ty;

		switch (ty) {
			case GearTypes.Types.Cost:
				mergeObject(data, new GearTypes.Cost());
				break;
			case GearTypes.Types.Capacity:
				mergeObject(data, new GearTypes.Capacity());
				break;
			case GearTypes.Types.Defense:
				mergeObject(data, new GearTypes.Defense());
				break;
			case GearTypes.Types.Matrix:
				mergeObject(data, new GearTypes.Matrix());
				break;
			case GearTypes.Types.Explosive:
				mergeObject(data, new GearTypes.Explosive());
				break;
			case GearTypes.Types.Weapon:
				mergeObject(data, new GearTypes.Weapon());
				break;
			case GearTypes.Types.Firearm:
				mergeObject(data, new GearTypes.Firearm());
				break;
			case GearTypes.Types.Mountable:
				mergeObject(data, new GearTypes.Mountable());
				break;
			case GearTypes.Types.SkillUse:
				mergeObject(data, new SkillUse());
				break;
			default:
				throw "WTF";
		}

		this.update({
			["system"]: data
		});
	}

	removeType(ty: GearTypes.Types) {
		this.update({
			["system.types"]: this.getData().types & ~ty
		});
	}

	has(ty: GearTypes.Types): boolean {
		return (this.getData().types & ty) == ty;
	}

	get skill_use(): undefined | SkillUse {
		if (!this.has(GearTypes.Types.SkillUse)) return undefined;
		return (this.getData() as any).skill_use as unknown as SkillUse;
	}

	get cost(): undefined | GearTypes.Cost {
		if (!this.has(GearTypes.Types.Cost)) return undefined;
		return this.getData() as unknown as GearTypes.Cost;
	}
	get capacity(): undefined | GearTypes.Capacity {
		if (!this.has(GearTypes.Types.Capacity)) return undefined;
		return this.getData() as unknown as GearTypes.Capacity;
	}
	get defense(): undefined | GearTypes.Defense {
		if (!this.has(GearTypes.Types.Cost)) return undefined;
		return this.getData() as unknown as GearTypes.Defense;
	}
	get matrix(): undefined | GearTypes.Matrix {
		if (!this.has(GearTypes.Types.Matrix)) return undefined;
		return this.getData() as unknown as GearTypes.Matrix;
	}
	get mountable(): undefined | GearTypes.Mountable {
		if (!this.has(GearTypes.Types.Mountable)) return undefined;
		return this.getData() as unknown as GearTypes.Mountable;
	}
	get explosive(): undefined | GearTypes.Explosive {
		if (!this.has(GearTypes.Types.Explosive)) return undefined;
		return this.getData() as unknown as GearTypes.Explosive;
	}
	get weapon(): undefined | GearTypes.Weapon {
		if (!this.has(GearTypes.Types.Weapon)) return undefined;
		return this.getData() as unknown as GearTypes.Weapon;
	}
	get firearm(): undefined | GearTypes.Firearm {
		if (!this.has(GearTypes.Types.Firearm)) return undefined;
		return this.getData() as unknown as GearTypes.Firearm;
	}

	getData(): GearData {
		let data: GearData = (this as any).system;
		return data;
	}
}
