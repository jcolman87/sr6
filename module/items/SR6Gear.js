import { GearTypes } from "./Data.js";
import { SR6Item } from "./SR6Item.js";
import { Enums, SkillUse } from "../config.js";
export class SR6Gear extends SR6Item {
    getAttackRating(distance) {
        switch (distance) {
            case Enums.Distance.Close:
                return this.solveFormula(this.weapon.attack_ratings.close);
            case Enums.Distance.Near:
                return this.solveFormula(this.weapon.attack_ratings.near);
            case Enums.Distance.Medium:
                return this.solveFormula(this.weapon.attack_ratings.medium);
            case Enums.Distance.Far:
                return this.solveFormula(this.weapon.attack_ratings.far);
            case Enums.Distance.Extreme:
                return this.solveFormula(this.weapon.attack_ratings.extreme);
            default:
                return 0;
        }
    }
    get damage() {
        return this.solveFormula(this.weapon.damage);
    }
    addType(ty) {
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
    removeType(ty) {
        this.update({
            ["system.types"]: this.getData().types & ~ty
        });
    }
    has(ty) {
        return (this.getData().types & ty) == ty;
    }
    get skill_use() {
        if (!this.has(GearTypes.Types.SkillUse))
            return undefined;
        return this.getData().skill_use;
    }
    get cost() {
        if (!this.has(GearTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    get capacity() {
        if (!this.has(GearTypes.Types.Capacity))
            return undefined;
        return this.getData();
    }
    get defense() {
        if (!this.has(GearTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    get matrix() {
        if (!this.has(GearTypes.Types.Matrix))
            return undefined;
        return this.getData();
    }
    get mountable() {
        if (!this.has(GearTypes.Types.Mountable))
            return undefined;
        return this.getData();
    }
    get explosive() {
        if (!this.has(GearTypes.Types.Explosive))
            return undefined;
        return this.getData();
    }
    get weapon() {
        if (!this.has(GearTypes.Types.Weapon))
            return undefined;
        return this.getData();
    }
    get firearm() {
        if (!this.has(GearTypes.Types.Firearm))
            return undefined;
        return this.getData();
    }
    getData() {
        let data = this.system;
        return data;
    }
}
