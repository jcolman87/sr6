import { SR6Roll, SR6RollData } from "./SR6Roll.js";
import { SR6ItemRoll, SR6ItemRollData } from "./SR6ItemRoll.js";
import { SR6InitiativeRoll } from "./SR6InitiativeRoll.js";
import { SR6AttributeRoll, SR6AttributeRollData } from "./SR6AttributeRoll.js";
import { SR6SkillRoll, SR6SkillRollData } from "./SR6SkillRoll.js";
import { SR6WeaponRoll, SR6WeaponRollData } from "./SR6WeaponRoll.js";
import { SR6DefenseRoll, SR6DefenseRollData } from "./SR6DefenseRoll.js";
import { SR6SoakRoll, SR6SoakRollData } from "./SR6SoakRoll.js";
export { SR6Roll, SR6ItemRoll, SR6InitiativeRoll, SR6AttributeRoll, SR6SkillRoll, SR6WeaponRoll, SR6DefenseRoll, SR6SoakRoll };
export { SR6RollData, SR6ItemRollData, SR6AttributeRollData, SR6SkillRollData, SR6WeaponRollData, SR6DefenseRollData, SR6SoakRollData };
export const RollTypes = [SR6Roll, SR6ItemRoll, SR6InitiativeRoll, SR6AttributeRoll, SR6SkillRoll, SR6WeaponRoll, SR6DefenseRoll, SR6SoakRoll];
/*
    Adding a Roll Type:
        - Create dialogs\SRBallsRollDialog.ts
        - Create rolls\SRBallsRoll.ts
            This needs to have a new SRBallsRollData as well, copy from the other types
        - Add references to the roll type here in this file in RollTypes and re-exports
        - Create its templates, copy from SR6Roll.
            - templates\dialogs\SR6BallsRollDialog.html (if you want a roll dialog for it)
            - templates\rolls\SR6BallsRoll.html (output for chat)


    Using a roll directly: This does a straight roll without a dialog
        let roll = Rolls.SR6SkillRoll.make(new Rolls.SR6SkillRollData(this, { skill: skill, specialization: undefined }));
        roll.evaluate({ async: false });
        roll.toMessage();

    Popping a Roll Dialog: pop the dialog with its constructor
        new SR6WeaponRollDialog(this, weapon).render(true);

    Embedded one roll into another special case:
        - See Defense/Soak rolls. This requires adding the fromData instance to create the proper object so you can use accessors

*/ 
