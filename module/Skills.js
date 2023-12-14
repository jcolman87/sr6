export var SkillSpecialization;
(function (SkillSpecialization) {
    SkillSpecialization[SkillSpecialization["None"] = 0] = "None";
    SkillSpecialization[SkillSpecialization["climbing"] = 1] = "climbing";
    SkillSpecialization[SkillSpecialization["flying"] = 2] = "flying";
    SkillSpecialization[SkillSpecialization["gymnastics"] = 3] = "gymnastics";
    SkillSpecialization[SkillSpecialization["sprinting"] = 4] = "sprinting";
    SkillSpecialization[SkillSpecialization["swimming"] = 5] = "swimming";
    SkillSpecialization[SkillSpecialization["throwing"] = 6] = "throwing";
    SkillSpecialization[SkillSpecialization["archery"] = 7] = "archery";
    SkillSpecialization[SkillSpecialization["biotechnology"] = 8] = "biotechnology";
    SkillSpecialization[SkillSpecialization["cybertechnology"] = 9] = "cybertechnology";
    SkillSpecialization[SkillSpecialization["first_aid"] = 10] = "first_aid";
    SkillSpecialization[SkillSpecialization["medicine"] = 11] = "medicine";
    SkillSpecialization[SkillSpecialization["blades"] = 12] = "blades";
    SkillSpecialization[SkillSpecialization["clubs"] = 13] = "clubs";
    SkillSpecialization[SkillSpecialization["unarmed"] = 14] = "unarmed";
    SkillSpecialization[SkillSpecialization["acting"] = 15] = "acting";
    SkillSpecialization[SkillSpecialization["disguise"] = 16] = "disguise";
    SkillSpecialization[SkillSpecialization["impersonation"] = 17] = "impersonation";
    SkillSpecialization[SkillSpecialization["performance"] = 18] = "performance";
    SkillSpecialization[SkillSpecialization["banishing"] = 19] = "banishing";
    SkillSpecialization[SkillSpecialization["summoning"] = 20] = "summoning";
    SkillSpecialization[SkillSpecialization["cybercombat"] = 21] = "cybercombat";
    SkillSpecialization[SkillSpecialization["electronic_warfare"] = 22] = "electronic_warfare";
    SkillSpecialization[SkillSpecialization["hacking"] = 23] = "hacking";
    SkillSpecialization[SkillSpecialization["computer"] = 24] = "computer";
    SkillSpecialization[SkillSpecialization["hardware"] = 25] = "hardware";
    SkillSpecialization[SkillSpecialization["software"] = 26] = "software";
    SkillSpecialization[SkillSpecialization["complex_forms"] = 27] = "complex_forms";
    SkillSpecialization[SkillSpecialization["alchemy"] = 28] = "alchemy";
    SkillSpecialization[SkillSpecialization["artificing"] = 29] = "artificing";
    SkillSpecialization[SkillSpecialization["disenchanting"] = 30] = "disenchanting";
    SkillSpecialization[SkillSpecialization["aeronautics_mechanic"] = 31] = "aeronautics_mechanic";
    SkillSpecialization[SkillSpecialization["armorer"] = 32] = "armorer";
    SkillSpecialization[SkillSpecialization["automotive_mechanic"] = 33] = "automotive_mechanic";
    SkillSpecialization[SkillSpecialization["demolitions"] = 34] = "demolitions";
    SkillSpecialization[SkillSpecialization["gunnery"] = 35] = "gunnery";
    SkillSpecialization[SkillSpecialization["industrial_mechanic"] = 36] = "industrial_mechanic";
    SkillSpecialization[SkillSpecialization["lockpicking"] = 37] = "lockpicking";
    SkillSpecialization[SkillSpecialization["nautical_mechanic"] = 38] = "nautical_mechanic";
    SkillSpecialization[SkillSpecialization["tasers"] = 39] = "tasers";
    SkillSpecialization[SkillSpecialization["holdouts"] = 40] = "holdouts";
    SkillSpecialization[SkillSpecialization["pistols_light"] = 41] = "pistols_light";
    SkillSpecialization[SkillSpecialization["pistols_heavy"] = 42] = "pistols_heavy";
    SkillSpecialization[SkillSpecialization["machine_pistols"] = 43] = "machine_pistols";
    SkillSpecialization[SkillSpecialization["submachine_guns"] = 44] = "submachine_guns";
    SkillSpecialization[SkillSpecialization["rifles"] = 45] = "rifles";
    SkillSpecialization[SkillSpecialization["shotguns"] = 46] = "shotguns";
    SkillSpecialization[SkillSpecialization["assault_cannons"] = 47] = "assault_cannons";
    SkillSpecialization[SkillSpecialization["etiquette"] = 48] = "etiquette";
    SkillSpecialization[SkillSpecialization["instruction"] = 49] = "instruction";
    SkillSpecialization[SkillSpecialization["intimidation"] = 50] = "intimidation";
    SkillSpecialization[SkillSpecialization["leadership"] = 51] = "leadership";
    SkillSpecialization[SkillSpecialization["negotiation"] = 52] = "negotiation";
    SkillSpecialization[SkillSpecialization["navigation"] = 53] = "navigation";
    SkillSpecialization[SkillSpecialization["survival"] = 54] = "survival";
    SkillSpecialization[SkillSpecialization["tracking_woods"] = 55] = "tracking_woods";
    SkillSpecialization[SkillSpecialization["tracking_desert"] = 56] = "tracking_desert";
    SkillSpecialization[SkillSpecialization["tracking_urban"] = 57] = "tracking_urban";
    SkillSpecialization[SkillSpecialization["tracking_other"] = 58] = "tracking_other";
    SkillSpecialization[SkillSpecialization["visual"] = 59] = "visual";
    SkillSpecialization[SkillSpecialization["aural"] = 60] = "aural";
    SkillSpecialization[SkillSpecialization["tactile"] = 61] = "tactile";
    SkillSpecialization[SkillSpecialization["scent"] = 62] = "scent";
    SkillSpecialization[SkillSpecialization["taste"] = 63] = "taste";
    SkillSpecialization[SkillSpecialization["perception_woods"] = 64] = "perception_woods";
    SkillSpecialization[SkillSpecialization["perception_desert"] = 65] = "perception_desert";
    SkillSpecialization[SkillSpecialization["perception_urban"] = 66] = "perception_urban";
    SkillSpecialization[SkillSpecialization["perception_other"] = 67] = "perception_other";
    SkillSpecialization[SkillSpecialization["ground_craft"] = 68] = "ground_craft";
    SkillSpecialization[SkillSpecialization["aircraft"] = 69] = "aircraft";
    SkillSpecialization[SkillSpecialization["watercraft"] = 70] = "watercraft";
    SkillSpecialization[SkillSpecialization["counterspelling"] = 71] = "counterspelling";
    SkillSpecialization[SkillSpecialization["ritual_spellcasting"] = 72] = "ritual_spellcasting";
    SkillSpecialization[SkillSpecialization["spellcasting"] = 73] = "spellcasting";
    SkillSpecialization[SkillSpecialization["disguise"] = 74] = "disguise";
    SkillSpecialization[SkillSpecialization["palming"] = 75] = "palming";
    SkillSpecialization[SkillSpecialization["sneaking"] = 76] = "sneaking";
    SkillSpecialization[SkillSpecialization["camouflage"] = 77] = "camouflage";
    SkillSpecialization[SkillSpecialization["compiling"] = 78] = "compiling";
    SkillSpecialization[SkillSpecialization["decompiling"] = 79] = "decompiling";
    SkillSpecialization[SkillSpecialization["registering"] = 80] = "registering";
})(SkillSpecialization || (SkillSpecialization = {}));
