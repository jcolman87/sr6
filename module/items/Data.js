import { Enums } from "../config.js";
export class Formula extends String {
}
export class ItemFormula extends Formula {
}
export var ItemTypes;
(function (ItemTypes) {
    class Cost {
        cost = "0";
        availability = "1";
        illegal = false;
    }
    ItemTypes.Cost = Cost;
    class Capacity {
        capacity = "0";
    }
    ItemTypes.Capacity = Capacity;
    class Matrix {
        matrix_attributes = {
            a: "0",
            s: "0",
            d: "0",
            f: "0"
        };
        program_slots = "0";
    }
    ItemTypes.Matrix = Matrix;
    class Defense {
        dr = "0";
    }
    ItemTypes.Defense = Defense;
    class Explosive {
        dv_gz = "0";
        dv_close = "0";
        dv_near = "0";
        blast = "0";
    }
    ItemTypes.Explosive = Explosive;
    class Weapon {
        attack_ratings = {
            close: "0",
            near: "0",
            medium: "0",
            far: "0",
            extreme: "0"
        };
        damage = "0";
        damage_type = Enums.DamageType.Physical;
        damage_form = Enums.DamageType.Physical;
    }
    ItemTypes.Weapon = Weapon;
    class Firearm {
        firemodes = [Enums.FireMode.SS];
        mount_locations = [];
    }
    ItemTypes.Firearm = Firearm;
    class Mountable {
        locations = [];
    }
    ItemTypes.Mountable = Mountable;
    let Types;
    (function (Types) {
        Types[Types["Base"] = 0] = "Base";
        Types[Types["Cost"] = 2] = "Cost";
        Types[Types["Capacity"] = 4] = "Capacity";
        Types[Types["Defense"] = 8] = "Defense";
        Types[Types["Matrix"] = 16] = "Matrix";
        Types[Types["Explosive"] = 32] = "Explosive";
        Types[Types["Weapon"] = 64] = "Weapon";
        Types[Types["Firearm"] = 128] = "Firearm";
        Types[Types["Mountable"] = 256] = "Mountable";
        Types[Types["SkillUse"] = 512] = "SkillUse";
    })(Types = ItemTypes.Types || (ItemTypes.Types = {}));
})(ItemTypes || (ItemTypes = {}));
export class ItemData {
    description = "";
    rating = "1";
    size = "3";
    types = 0;
    category = {
        type: "",
        subtype: ""
    };
}
