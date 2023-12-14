export var GearType;
(function (GearType) {
    GearType[GearType["None"] = 0] = "None";
})(GearType || (GearType = {}));
export class SkillUse {
    skill;
    specialization;
}
export class Gear {
    type = GearType.None;
    skill = new SkillUse();
    rating = 1;
    cost_formula = "0";
    roll_formula = undefined;
}
export class Weapon extends Gear {
    damage = 0;
    stun = false;
    attackRating = [0, 0, 0, 0, 0];
}
