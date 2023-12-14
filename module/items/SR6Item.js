import { ItemTypes } from "./Data.js";
import { SR6Roll } from "../SR6Roll.js";
export class SR6Item extends Item {
    solveFormula(formula) {
        return this.solveFormulaWithActor(this.actor, formula);
    }
    solveFormulaWithActor(actor, formula) {
        //console.log("SR6Item::solveFormulaWithActor", formula);
        let roll = new SR6Roll(formula, { actor: actor, item: this });
        roll.evaluate({ async: false });
        //console.log("solved", formula, roll);
        return roll.total;
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
    cost() {
        if (!this.has(ItemTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    capacity() {
        if (!this.has(ItemTypes.Types.Capacity))
            return undefined;
        return this.getData();
    }
    defense() {
        if (!this.has(ItemTypes.Types.Cost))
            return undefined;
        return this.getData();
    }
    matrix() {
        if (!this.has(ItemTypes.Types.Matrix))
            return undefined;
        return this.getData();
    }
    mountable() {
        if (!this.has(ItemTypes.Types.Mountable))
            return undefined;
        return this.getData();
    }
    explosive() {
        if (!this.has(ItemTypes.Types.Explosive))
            return undefined;
        return this.getData();
    }
    weapon() {
        if (!this.has(ItemTypes.Types.Weapon))
            return undefined;
        return this.getData();
    }
    firearm() {
        if (!this.has(ItemTypes.Types.Firearm))
            return undefined;
        return this.getData();
    }
    get damage() {
        let formula = this.weapon().damage;
        return this.solveFormula(formula);
    }
    getData() {
        let data = this.system;
        return data;
    }
}
