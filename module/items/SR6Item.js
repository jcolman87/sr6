import { ItemTypes } from "./Data.js";
import * as Rolls from "../rolls/Rolls.js";
import { Enums, SkillUse } from "../config.js";
export class SR6Item extends Item {
    solveFormula(formula) {
        return this.solveFormulaWithActor(this.actor, formula);
    }
    solveFormulaWithActor(actor, formula) {
        console.log("SR6Item::solveFormulaWithActor", formula);
        let roll = new Rolls.SR6Roll(formula, { actor: this.actor, item: this });
        roll.evaluate({ async: false });
        return roll.total;
    }
    prepareData() {
        // TODO: Validate the data types for various item types
    }
    getAttackRating(distance) {
        switch (distance) {
            case Enums.Distance.Close: return this.solveFormula(this.weapon.attack_ratings.close);
            case Enums.Distance.Near: return this.solveFormula(this.weapon.attack_ratings.near);
            case Enums.Distance.Medium: return this.solveFormula(this.weapon.attack_ratings.medium);
            case Enums.Distance.Far: return this.solveFormula(this.weapon.attack_ratings.far);
            case Enums.Distance.Extreme: return this.solveFormula(this.weapon.attack_ratings.extreme);
            default: return 0;
        }
    }
    get damage() {
        return this.solveFormula(this.weapon.damage);
    }
    addType(ty) {
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
        if (!this.has(ItemTypes.Types.SkillUse))
            return undefined;
        return this.getData().skill_use;
    }
    get cost() {
        if (!this.has(ItemTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    get capacity() {
        if (!this.has(ItemTypes.Types.Capacity))
            return undefined;
        return this.getData();
    }
    get defense() {
        if (!this.has(ItemTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    get matrix() {
        if (!this.has(ItemTypes.Types.Matrix))
            return undefined;
        return this.getData();
    }
    get mountable() {
        if (!this.has(ItemTypes.Types.Mountable))
            return undefined;
        return this.getData();
    }
    get explosive() {
        if (!this.has(ItemTypes.Types.Explosive))
            return undefined;
        return this.getData();
    }
    get weapon() {
        if (!this.has(ItemTypes.Types.Weapon))
            return undefined;
        return this.getData();
    }
    get firearm() {
        if (!this.has(ItemTypes.Types.Firearm))
            return undefined;
        return this.getData();
    }
    getData() {
        let data = this.system;
        return data;
    }
}
