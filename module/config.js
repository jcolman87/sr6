import * as Rules from "./rules.js";
export { Rules };
export const EffectChangeMode = foundry.CONST.ACTIVE_EFFECT_MODES;
export var Enums;
(function (Enums) {
    let Initiative;
    (function (Initiative) {
        Initiative["Physical"] = "physical";
        Initiative["Astral"] = "astral";
        Initiative["Matrix"] = "matrix";
    })(Initiative = Enums.Initiative || (Enums.Initiative = {}));
    let WeaponAccessoryLocation;
    (function (WeaponAccessoryLocation) {
        WeaponAccessoryLocation["Under"] = "under";
        WeaponAccessoryLocation["Barrel"] = "barrel";
        WeaponAccessoryLocation["Top"] = "top";
    })(WeaponAccessoryLocation = Enums.WeaponAccessoryLocation || (Enums.WeaponAccessoryLocation = {}));
    let Attribute;
    (function (Attribute) {
        Attribute[Attribute["body"] = 0] = "body";
        Attribute[Attribute["agility"] = 1] = "agility";
        Attribute[Attribute["reaction"] = 2] = "reaction";
        Attribute[Attribute["strength"] = 3] = "strength";
        Attribute[Attribute["willpower"] = 4] = "willpower";
        Attribute[Attribute["logic"] = 5] = "logic";
        Attribute[Attribute["intuition"] = 6] = "intuition";
        Attribute[Attribute["charisma"] = 7] = "charisma";
        Attribute[Attribute["magic"] = 8] = "magic";
        Attribute[Attribute["resonance"] = 9] = "resonance";
        Attribute[Attribute["essense"] = 10] = "essense";
    })(Attribute = Enums.Attribute || (Enums.Attribute = {}));
    let Specialization;
    (function (Specialization) {
        Specialization[Specialization["astral_combat"] = 0] = "astral_combat";
        Specialization[Specialization["astral_signatures"] = 1] = "astral_signatures";
        Specialization[Specialization["spirit_types"] = 2] = "spirit_types";
        Specialization[Specialization["climbing"] = 3] = "climbing";
        Specialization[Specialization["flying"] = 4] = "flying";
        Specialization[Specialization["emotional_states"] = 5] = "emotional_states";
        Specialization[Specialization["gymnastics"] = 6] = "gymnastics";
        Specialization[Specialization["sprinting"] = 7] = "sprinting";
        Specialization[Specialization["swimming"] = 8] = "swimming";
        Specialization[Specialization["throwing"] = 9] = "throwing";
        Specialization[Specialization["archery"] = 10] = "archery";
        Specialization[Specialization["biotechnology"] = 11] = "biotechnology";
        Specialization[Specialization["cybertechnology"] = 12] = "cybertechnology";
        Specialization[Specialization["first_aid"] = 13] = "first_aid";
        Specialization[Specialization["medicine"] = 14] = "medicine";
        Specialization[Specialization["blades"] = 15] = "blades";
        Specialization[Specialization["clubs"] = 16] = "clubs";
        Specialization[Specialization["unarmed"] = 17] = "unarmed";
        Specialization[Specialization["acting"] = 18] = "acting";
        Specialization[Specialization["disguise"] = 19] = "disguise";
        Specialization[Specialization["impersonation"] = 20] = "impersonation";
        Specialization[Specialization["performance"] = 21] = "performance";
        Specialization[Specialization["banishing"] = 22] = "banishing";
        Specialization[Specialization["summoning"] = 23] = "summoning";
        Specialization[Specialization["cybercombat"] = 24] = "cybercombat";
        Specialization[Specialization["electronic_warfare"] = 25] = "electronic_warfare";
        Specialization[Specialization["hacking"] = 26] = "hacking";
        Specialization[Specialization["computer"] = 27] = "computer";
        Specialization[Specialization["hardware"] = 28] = "hardware";
        Specialization[Specialization["software"] = 29] = "software";
        Specialization[Specialization["complex_forms"] = 30] = "complex_forms";
        Specialization[Specialization["alchemy"] = 31] = "alchemy";
        Specialization[Specialization["artificing"] = 32] = "artificing";
        Specialization[Specialization["disenchanting"] = 33] = "disenchanting";
        Specialization[Specialization["aeronautics_mechanic"] = 34] = "aeronautics_mechanic";
        Specialization[Specialization["armorer"] = 35] = "armorer";
        Specialization[Specialization["automotive_mechanic"] = 36] = "automotive_mechanic";
        Specialization[Specialization["demolitions"] = 37] = "demolitions";
        Specialization[Specialization["gunnery"] = 38] = "gunnery";
        Specialization[Specialization["industrial_mechanic"] = 39] = "industrial_mechanic";
        Specialization[Specialization["lockpicking"] = 40] = "lockpicking";
        Specialization[Specialization["nautical_mechanic"] = 41] = "nautical_mechanic";
        Specialization[Specialization["tasers"] = 42] = "tasers";
        Specialization[Specialization["holdouts"] = 43] = "holdouts";
        Specialization[Specialization["pistols_light"] = 44] = "pistols_light";
        Specialization[Specialization["pistols_heavy"] = 45] = "pistols_heavy";
        Specialization[Specialization["machine_pistols"] = 46] = "machine_pistols";
        Specialization[Specialization["submachine_guns"] = 47] = "submachine_guns";
        Specialization[Specialization["rifles"] = 48] = "rifles";
        Specialization[Specialization["shotguns"] = 49] = "shotguns";
        Specialization[Specialization["assault_cannons"] = 50] = "assault_cannons";
        Specialization[Specialization["etiquette"] = 51] = "etiquette";
        Specialization[Specialization["instruction"] = 52] = "instruction";
        Specialization[Specialization["intimidation"] = 53] = "intimidation";
        Specialization[Specialization["leadership"] = 54] = "leadership";
        Specialization[Specialization["negotiation"] = 55] = "negotiation";
        Specialization[Specialization["navigation"] = 56] = "navigation";
        Specialization[Specialization["survival"] = 57] = "survival";
        Specialization[Specialization["tracking_woods"] = 58] = "tracking_woods";
        Specialization[Specialization["tracking_desert"] = 59] = "tracking_desert";
        Specialization[Specialization["tracking_urban"] = 60] = "tracking_urban";
        Specialization[Specialization["tracking_other"] = 61] = "tracking_other";
        Specialization[Specialization["visual"] = 62] = "visual";
        Specialization[Specialization["aural"] = 63] = "aural";
        Specialization[Specialization["tactile"] = 64] = "tactile";
        Specialization[Specialization["scent"] = 65] = "scent";
        Specialization[Specialization["taste"] = 66] = "taste";
        Specialization[Specialization["perception_woods"] = 67] = "perception_woods";
        Specialization[Specialization["perception_desert"] = 68] = "perception_desert";
        Specialization[Specialization["perception_urban"] = 69] = "perception_urban";
        Specialization[Specialization["perception_other"] = 70] = "perception_other";
        Specialization[Specialization["ground_craft"] = 71] = "ground_craft";
        Specialization[Specialization["aircraft"] = 72] = "aircraft";
        Specialization[Specialization["watercraft"] = 73] = "watercraft";
        Specialization[Specialization["counterspelling"] = 74] = "counterspelling";
        Specialization[Specialization["ritual_spellcasting"] = 75] = "ritual_spellcasting";
        Specialization[Specialization["spellcasting"] = 76] = "spellcasting";
        Specialization[Specialization["palming"] = 77] = "palming";
        Specialization[Specialization["sneaking"] = 78] = "sneaking";
        Specialization[Specialization["camouflage"] = 79] = "camouflage";
        Specialization[Specialization["compiling"] = 80] = "compiling";
        Specialization[Specialization["decompiling"] = 81] = "decompiling";
        Specialization[Specialization["registering"] = 82] = "registering";
    })(Specialization = Enums.Specialization || (Enums.Specialization = {}));
    let Skill;
    (function (Skill) {
        Skill[Skill["astral"] = 0] = "astral";
        Skill[Skill["athletics"] = 1] = "athletics";
        Skill[Skill["biotech"] = 2] = "biotech";
        Skill[Skill["close_combat"] = 3] = "close_combat";
        Skill[Skill["con"] = 4] = "con";
        Skill[Skill["conjuring"] = 5] = "conjuring";
        Skill[Skill["cracking"] = 6] = "cracking";
        Skill[Skill["electronics"] = 7] = "electronics";
        Skill[Skill["enchanting"] = 8] = "enchanting";
        Skill[Skill["engineering"] = 9] = "engineering";
        Skill[Skill["exotic_weapons"] = 10] = "exotic_weapons";
        Skill[Skill["firearms"] = 11] = "firearms";
        Skill[Skill["influence"] = 12] = "influence";
        Skill[Skill["outdoors"] = 13] = "outdoors";
        Skill[Skill["perception"] = 14] = "perception";
        Skill[Skill["piloting"] = 15] = "piloting";
        Skill[Skill["sorcery"] = 16] = "sorcery";
        Skill[Skill["stealth"] = 17] = "stealth";
        Skill[Skill["tasking"] = 18] = "tasking";
    })(Skill = Enums.Skill || (Enums.Skill = {}));
    let CombatAction;
    (function (CombatAction) {
        CombatAction[CombatAction["change_focus"] = 0] = "change_focus";
        CombatAction[CombatAction["avoid_incoming"] = 1] = "avoid_incoming";
        CombatAction[CombatAction["block"] = 2] = "block";
        CombatAction[CombatAction["call_shot"] = 3] = "call_shot";
        CombatAction[CombatAction["change_device_mode"] = 4] = "change_device_mode";
        CombatAction[CombatAction["command_drone"] = 5] = "command_drone";
        CombatAction[CombatAction["command_spirit"] = 6] = "command_spirit";
        CombatAction[CombatAction["dodge"] = 7] = "dodge";
        CombatAction[CombatAction["drop_object"] = 8] = "drop_object";
        CombatAction[CombatAction["drop_prone"] = 9] = "drop_prone";
        CombatAction[CombatAction["hit_the_dirt"] = 10] = "hit_the_dirt";
        CombatAction[CombatAction["intercept"] = 11] = "intercept";
        CombatAction[CombatAction["move"] = 12] = "move";
        CombatAction[CombatAction["multiple_attacks"] = 13] = "multiple_attacks";
        CombatAction[CombatAction["quick_draw"] = 14] = "quick_draw";
        CombatAction[CombatAction["reload_smartgun"] = 15] = "reload_smartgun";
        CombatAction[CombatAction["shift_perception"] = 16] = "shift_perception";
        CombatAction[CombatAction["stand_up"] = 17] = "stand_up";
        CombatAction[CombatAction["take_aim"] = 18] = "take_aim";
        CombatAction[CombatAction["take_cover"] = 19] = "take_cover";
        CombatAction[CombatAction["trip"] = 20] = "trip";
        CombatAction[CombatAction["assist"] = 21] = "assist";
        CombatAction[CombatAction["astral_projection"] = 22] = "astral_projection";
        CombatAction[CombatAction["attack"] = 23] = "attack";
        CombatAction[CombatAction["banish_spirit"] = 24] = "banish_spirit";
        CombatAction[CombatAction["cast_spell"] = 25] = "cast_spell";
        CombatAction[CombatAction["cleanse"] = 26] = "cleanse";
        CombatAction[CombatAction["counterspell"] = 27] = "counterspell";
        CombatAction[CombatAction["full_defense"] = 28] = "full_defense";
        CombatAction[CombatAction["manifest"] = 29] = "manifest";
        CombatAction[CombatAction["observe_in_detail"] = 30] = "observe_in_detail";
        CombatAction[CombatAction["manipulate_object"] = 31] = "manipulate_object";
        CombatAction[CombatAction["ready_weapon"] = 32] = "ready_weapon";
        CombatAction[CombatAction["reload_weapon"] = 33] = "reload_weapon";
        CombatAction[CombatAction["rigger_jump_in"] = 34] = "rigger_jump_in";
        CombatAction[CombatAction["sprint"] = 35] = "sprint";
        CombatAction[CombatAction["summon_spirit"] = 36] = "summon_spirit";
        CombatAction[CombatAction["use_simple_device"] = 37] = "use_simple_device";
        CombatAction[CombatAction["use_skill"] = 38] = "use_skill";
    })(CombatAction = Enums.CombatAction || (Enums.CombatAction = {}));
    let MatrixAction;
    (function (MatrixAction) {
        MatrixAction[MatrixAction["backdoor_entry"] = 0] = "backdoor_entry";
        MatrixAction[MatrixAction["brute_force"] = 1] = "brute_force";
        MatrixAction[MatrixAction["change_icon"] = 2] = "change_icon";
        MatrixAction[MatrixAction["check_os"] = 3] = "check_os";
        MatrixAction[MatrixAction["control_device"] = 4] = "control_device";
        MatrixAction[MatrixAction["crack_file"] = 5] = "crack_file";
        MatrixAction[MatrixAction["crash_program"] = 6] = "crash_program";
        MatrixAction[MatrixAction["data_spike"] = 7] = "data_spike";
        MatrixAction[MatrixAction["disarm_data_bomb"] = 8] = "disarm_data_bomb";
        MatrixAction[MatrixAction["edit_file"] = 9] = "edit_file";
        MatrixAction[MatrixAction["encrypt_file"] = 10] = "encrypt_file";
        MatrixAction[MatrixAction["enter_host"] = 11] = "enter_host";
        MatrixAction[MatrixAction["erase_matrix_signature"] = 12] = "erase_matrix_signature";
        MatrixAction[MatrixAction["format_device"] = 13] = "format_device";
        MatrixAction[MatrixAction["full_matrix_defense"] = 14] = "full_matrix_defense";
        MatrixAction[MatrixAction["hash_check"] = 15] = "hash_check";
        MatrixAction[MatrixAction["hide"] = 16] = "hide";
        MatrixAction[MatrixAction["jack_out"] = 17] = "jack_out";
        MatrixAction[MatrixAction["jam_signals"] = 18] = "jam_signals";
        MatrixAction[MatrixAction["jump_rigged"] = 19] = "jump_rigged";
        MatrixAction[MatrixAction["matrix_perception"] = 20] = "matrix_perception";
        MatrixAction[MatrixAction["matrix_search"] = 21] = "matrix_search";
        MatrixAction[MatrixAction["probe"] = 22] = "probe";
        MatrixAction[MatrixAction["reboot_device"] = 23] = "reboot_device";
        MatrixAction[MatrixAction["reconfigure"] = 24] = "reconfigure";
        MatrixAction[MatrixAction["send_message"] = 25] = "send_message";
        MatrixAction[MatrixAction["set_data_bomb"] = 26] = "set_data_bomb";
        MatrixAction[MatrixAction["snoop"] = 27] = "snoop";
        MatrixAction[MatrixAction["spoof_command"] = 28] = "spoof_command";
        MatrixAction[MatrixAction["switch_ifmode"] = 29] = "switch_ifmode";
        MatrixAction[MatrixAction["tarpit"] = 30] = "tarpit";
        MatrixAction[MatrixAction["trace_icon"] = 31] = "trace_icon";
    })(MatrixAction = Enums.MatrixAction || (Enums.MatrixAction = {}));
    let MatrixProgram;
    (function (MatrixProgram) {
        // Legal
        MatrixProgram[MatrixProgram["browse"] = 0] = "browse";
        MatrixProgram[MatrixProgram["baby_monitor"] = 1] = "baby_monitor";
        MatrixProgram[MatrixProgram["configurator"] = 2] = "configurator";
        MatrixProgram[MatrixProgram["edit"] = 3] = "edit";
        MatrixProgram[MatrixProgram["encryption"] = 4] = "encryption";
        MatrixProgram[MatrixProgram["signal_scrubber"] = 5] = "signal_scrubber";
        MatrixProgram[MatrixProgram["toolbox"] = 6] = "toolbox";
        MatrixProgram[MatrixProgram["virtual_machine"] = 7] = "virtual_machine";
        // Hacking
        MatrixProgram[MatrixProgram["armor"] = 8] = "armor";
        MatrixProgram[MatrixProgram["biofeedback"] = 9] = "biofeedback";
        MatrixProgram[MatrixProgram["biofeedback_filter"] = 10] = "biofeedback_filter";
        MatrixProgram[MatrixProgram["blackout"] = 11] = "blackout";
        MatrixProgram[MatrixProgram["decryption"] = 12] = "decryption";
        MatrixProgram[MatrixProgram["defuse"] = 13] = "defuse";
        MatrixProgram[MatrixProgram["exploit"] = 14] = "exploit";
        MatrixProgram[MatrixProgram["fork"] = 15] = "fork";
        MatrixProgram[MatrixProgram["lockdown"] = 16] = "lockdown";
        MatrixProgram[MatrixProgram["overclock"] = 17] = "overclock";
        MatrixProgram[MatrixProgram["stealth"] = 18] = "stealth";
        MatrixProgram[MatrixProgram["trace"] = 19] = "trace";
    })(MatrixProgram = Enums.MatrixProgram || (Enums.MatrixProgram = {}));
    let Activation;
    (function (Activation) {
        Activation[Activation["Passive"] = 0] = "Passive";
        Activation[Activation["Minor"] = 1] = "Minor";
        Activation[Activation["Major"] = 2] = "Major";
    })(Activation = Enums.Activation || (Enums.Activation = {}));
    let ActivationLimit;
    (function (ActivationLimit) {
        ActivationLimit["Initiative"] = "initiative";
        ActivationLimit["Anytime"] = "anytime";
    })(ActivationLimit = Enums.ActivationLimit || (Enums.ActivationLimit = {}));
    let AccessLevel;
    (function (AccessLevel) {
        AccessLevel[AccessLevel["Outsider"] = 1] = "Outsider";
        AccessLevel[AccessLevel["User"] = 2] = "User";
        AccessLevel[AccessLevel["Admin"] = 4] = "Admin";
    })(AccessLevel = Enums.AccessLevel || (Enums.AccessLevel = {}));
    let Distance;
    (function (Distance) {
        Distance[Distance["Close"] = 0] = "Close";
        Distance[Distance["Near"] = 1] = "Near";
        Distance[Distance["Medium"] = 2] = "Medium";
        Distance[Distance["Far"] = 3] = "Far";
        Distance[Distance["Extreme"] = 4] = "Extreme";
    })(Distance = Enums.Distance || (Enums.Distance = {}));
    let FireMode;
    (function (FireMode) {
        FireMode["SS"] = "SS";
        FireMode["SA"] = "SA";
        FireMode["BF_narrow"] = "BF_narrow";
        FireMode["BF_wide"] = "BF_wide";
        FireMode["FA"] = "FA"; // -6 AR 
    })(FireMode = Enums.FireMode || (Enums.FireMode = {}));
    let DamageType;
    (function (DamageType) {
        DamageType["Physical"] = "Physical";
        DamageType["Stun"] = "Stun";
        DamageType["Matrix"] = "Matrix";
        DamageType["Astral"] = "Astral";
    })(DamageType = Enums.DamageType || (Enums.DamageType = {}));
    let Size;
    (function (Size) {
        Size[Size["Large"] = 0] = "Large";
        Size[Size["Bulky"] = 1] = "Bulky";
        Size[Size["Tuckable"] = 2] = "Tuckable";
        Size[Size["Pocket"] = 3] = "Pocket";
        Size[Size["Hand"] = 4] = "Hand";
        Size[Size["Slim"] = 5] = "Slim";
        Size[Size["Palmable"] = 6] = "Palmable";
        Size[Size["Small"] = 7] = "Small";
        Size[Size["Mini"] = 8] = "Mini";
        Size[Size["Fine"] = 9] = "Fine";
        Size[Size["Microscopic"] = 10] = "Microscopic";
    })(Size = Enums.Size || (Enums.Size = {}));
    let Lifestyle;
    (function (Lifestyle) {
        Lifestyle[Lifestyle["Street"] = 0] = "Street";
        Lifestyle[Lifestyle["Squatter"] = 1] = "Squatter";
        Lifestyle[Lifestyle["Low"] = 2] = "Low";
        Lifestyle[Lifestyle["Middle"] = 3] = "Middle";
        Lifestyle[Lifestyle["High"] = 4] = "High";
        Lifestyle[Lifestyle["Luxury"] = 5] = "Luxury";
    })(Lifestyle = Enums.Lifestyle || (Enums.Lifestyle = {}));
    let SpellRangeType;
    (function (SpellRangeType) {
        SpellRangeType[SpellRangeType["Touch"] = 0] = "Touch";
        SpellRangeType[SpellRangeType["LineOfSight"] = 1] = "LineOfSight";
        SpellRangeType[SpellRangeType["Perceived"] = 2] = "Perceived";
    })(SpellRangeType = Enums.SpellRangeType || (Enums.SpellRangeType = {}));
    let SpellDurationType;
    (function (SpellDurationType) {
        SpellDurationType[SpellDurationType["Instantaneous"] = 0] = "Instantaneous";
        SpellDurationType[SpellDurationType["Sustained"] = 1] = "Sustained";
        SpellDurationType[SpellDurationType["Permanent"] = 2] = "Permanent";
        SpellDurationType[SpellDurationType["Limited"] = 3] = "Limited";
    })(SpellDurationType = Enums.SpellDurationType || (Enums.SpellDurationType = {}));
    let AugmentationQuality;
    (function (AugmentationQuality) {
        AugmentationQuality[AugmentationQuality["Standard"] = 0] = "Standard";
        AugmentationQuality[AugmentationQuality["Alpha"] = 1] = "Alpha";
        AugmentationQuality[AugmentationQuality["Beta"] = 2] = "Beta";
    })(AugmentationQuality = Enums.AugmentationQuality || (Enums.AugmentationQuality = {}));
})(Enums || (Enums = {}));
export class SkillSpecializationDef {
    id;
    pool;
    constructor(id, pool = undefined) {
        this.id = id;
        this.pool = pool;
    }
}
export class SkillDef {
    specializations = [];
    pool = "0";
    untrained = true;
}
export class Activation {
    type;
    when;
    constructor(type, when) {
        this.type = type;
        this.when = when;
    }
}
export class CombatActionDef {
    activation;
    changes;
    duration;
    constructor(activation, changes = [], duration = 1) {
        this.activation = activation;
        this.changes = changes;
        this.duration = duration;
    }
}
export class MatrixActionDef {
    formula;
    illegal;
    activation;
    access_level;
    specialization;
    constructor(formula, specialization, illegal, activation, access_level) {
        this.formula = formula;
        this.illegal = illegal;
        this.activation = activation;
        this.access_level = access_level;
        this.specialization = specialization;
    }
}
export class MatrixProgramDef {
    illegal;
    modifier;
    constructor(illegal, modifier) {
        this.illegal = illegal;
        this.modifier = modifier;
    }
}
export class SkillUse {
    skill;
    specialization;
}
export class SR6Config {
    GEAR_TYPES = ["ACCESSORY", "ARMOR", "ARMOR_ADDITION", "BIOWARE", "CYBERWARE", "TOOLS", "ELECTRONICS", "NANOWARE", "GENETICS", "WEAPON_CLOSE_COMBAT", "WEAPON_RANGED", "WEAPON_FIREARMS", "WEAPON_SPECIAL", "AMMUNITION", "CHEMICALS", "SOFTWARE", "SURVIVAL", "BIOLOGY", "VEHICLES", "DRONES", "MAGICAL"];
    GEAR_SUBTYPES = new Map([
        ["ACCESSORY", ["TOP_OR_UNDERBARREL", "TOP", "BARREL", "UNDERBARREL"]],
        ["ARMOR", ["ARMOR_BODY", "ARMOR_HELMET", "ARMOR_SHIELD"]],
        ["ARMOR_ADDITION", []],
        ["BIOWARE", ["BIOWARE_STANDARD", "BIOWARE_CULTURED", "BIOWARE_IMPLANT_WEAPON"]],
        ["CYBERWARE", ["CYBER_HEADWARE", "CYBERJACK", "CYBER_EYEWARE", "CYBER_BODYWARE", "CYBER_EARWARE", "CYBER_IMPLANT_WEAPON", "CYBER_LIMBS", "COMMLINK", "CYBERDECK"]],
        ["TOOLS", ["TOOLS"]],
        ["ELECTRONICS", ["COMMLINK", "CYBERDECK", "ELECTRONIC_ACCESSORIES", "RIGGER_CONSOLE", "RFID", "COMMUNICATION", "ID_CREDIT", "IMAGING", "OPTICAL", "AUDIO", "SENSOR_HOUSING", "SECURITY", "BREAKING", "TAC_NET"]],
        ["NANOWARE", []],
        ["GENETICS", []],
        ["SOFTWARE", ["AUTOSOFT", "SKILLSOFT"]],
        ["WEAPON_CLOSE_COMBAT", ["BLADES", "CLUBS", "WHIPS", "UNARMED", "OTHER_CLOSE"]],
        ["WEAPON_RANGED", ["BOWS", "CROSSBOWS", "THROWING"]],
        ["WEAPON_FIREARMS", ["TASERS", "HOLDOUTS", "PISTOLS_LIGHT", "MACHINE_PISTOLS", "PISTOLS_HEAVY", "SUBMACHINE_GUNS", "SHOTGUNS", "RIFLE_ASSAULT", "RIFLE_HUNTING", "RIFLE_SNIPER", "LMG", "MMG", "HMG", "ASSAULT_CANNON"]],
        ["WEAPON_SPECIAL", ["LAUNCHERS", "THROWERS", "OTHER_SPECIAL"]],
        ["AMMUNITION", ["AMMO_TASER", "AMMO_LIGHT", "AMMO_HEAVY", "AMMO_RIFLE", "AMMO_SHOTGUN", "AMMO_MG", "AMMO_ROCKETS", "AMMO_MISSILES", "AMMO_EXPLOSIVES", "AMMO_GRENADES"]],
        ["CHEMICALS", ["INDUSTRIAL_CHEMICALS", "TOXINS", "DRUGS", "BTL"]],
        ["SURVIVAL", ["SURVIVAL_GEAR", "GRAPPLE_GUN"]],
        ["BIOLOGY", ["BIOTECH", "SLAP_PATCHES"]],
        ["VEHICLES", ["BIKES", "CARS", "TRUCKS", "BOATS", "SUBMARINES", "FIXED_WING", "ROTORCRAFT", "VTOL", "WALKER"]],
        ["DRONES", ["MICRODRONES", "MINIDRONES", "SMALL_DRONES", "MEDIUM_DRONES", "LARGE_DRONES"]],
        ["MAGICAL", ["MAGIC_SUPPLIES"]]
    ]);
    matrix_programs = new Map([
        [Enums.MatrixProgram.browse, new MatrixProgramDef(false, "+1 Edge on Matrix Search")],
        [Enums.MatrixProgram.baby_monitor, new MatrixProgramDef(false, "Overwatch Score without Action")],
        [Enums.MatrixProgram.configurator, new MatrixProgramDef(false, "Store alternate deck configuration and swap to it")],
        [Enums.MatrixProgram.edit, new MatrixProgramDef(false, "+1 edge on Edit File Action")],
        [Enums.MatrixProgram.encryption, new MatrixProgramDef(false, "+2 pool when doing Encrypt File Action")],
        [Enums.MatrixProgram.signal_scrubber, new MatrixProgramDef(false, "Reduce noise level by 2")],
        [Enums.MatrixProgram.toolbox, new MatrixProgramDef(false, "+1 to Data Processing")],
        [Enums.MatrixProgram.virtual_machine, new MatrixProgramDef(false, "+2 extra program slots, +1 unresisted matrix damage when attacked")],
        [Enums.MatrixProgram.armor, new MatrixProgramDef(true, "+2 Matrix DR")],
        [Enums.MatrixProgram.biofeedback, new MatrixProgramDef(true, "Cuases Stun(ColdSim) or Physical(HotSim) damage on Attack")],
        [Enums.MatrixProgram.biofeedback_filter, new MatrixProgramDef(true, "Allow device rating or body roll to soak Matrix Damage.")],
        [Enums.MatrixProgram.blackout, new MatrixProgramDef(true, "Cuases Stun damage on Attack")],
        [Enums.MatrixProgram.decryption, new MatrixProgramDef(true, "+2 dice on Crack File Action")],
        [Enums.MatrixProgram.defuse, new MatrixProgramDef(true, "Allow Device Rating or Body roll to soak Data Bomb damage")],
        [Enums.MatrixProgram.exploit, new MatrixProgramDef(true, "-2 Defense Rating of hacking target")],
        [Enums.MatrixProgram.fork, new MatrixProgramDef(true, "Hit two targets with single matrix action without splitting dice.")],
        [Enums.MatrixProgram.lockdown, new MatrixProgramDef(true, "Cause link-lock when you do matrix damage.")],
        [Enums.MatrixProgram.overclock, new MatrixProgramDef(true, "Add two dice to matrix action")],
        [Enums.MatrixProgram.stealth, new MatrixProgramDef(true, "+1 Edge on Matrix Hide")],
        [Enums.MatrixProgram.trace, new MatrixProgramDef(true, "+11 Edge on Trace")]
    ]);
    matrix_actions = new Map([
        [
            Enums.MatrixAction.backdoor_entry,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.hacking, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.brute_force,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.cybercombat, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.change_icon,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.check_os,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.electronic_warfare, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.control_device,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.crack_file,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.hacking, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.crash_program,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.cybercombat, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.data_spike,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.cybercombat, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.disarm_data_bomb,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.edit_file,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.encrypt_file,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.enter_host,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.erase_matrix_signature,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.format_device,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.full_matrix_defense,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.hash_check,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.hacking, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.hide,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.electronic_warfare, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.jack_out,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.jam_signals,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.electronic_warfare, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.jump_rigged,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.matrix_perception,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.matrix_search,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.computer, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.probe,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.hacking, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.reboot_device,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.reconfigure,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.send_message,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.set_data_bomb,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.snoop,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.software, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.spoof_command,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.hacking, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.switch_ifmode,
            new MatrixActionDef(undefined, Enums.Specialization.hacking, false, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.tarpit,
            new MatrixActionDef("@actor.system.skills.cracking.pool", Enums.Specialization.cybercombat, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ],
        [
            Enums.MatrixAction.trace_icon,
            new MatrixActionDef("@actor.system.skills.electronics.pool", Enums.Specialization.software, true, new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin)
        ]
    ]);
    combat_actions = new Map([
        [Enums.CombatAction.change_focus, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.avoid_incoming, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.block, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.call_shot, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative), [{
                    key: "system.effect_modifiers.damage",
                    value: "2",
                    mode: EffectChangeMode.ADD,
                    priority: 1,
                },
                {
                    key: "system.effect_modifiers.attack_pool",
                    value: "-4",
                    mode: EffectChangeMode.ADD,
                    priority: 1,
                }])],
        [Enums.CombatAction.change_device_mode, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.command_drone, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.command_spirit, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.dodge, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.drop_object, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.drop_prone, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.hit_the_dirt, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.intercept, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.move, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.multiple_attacks, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.quick_draw, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.reload_smartgun, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.shift_perception, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.stand_up, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.take_aim, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.take_cover, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.trip, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.assist, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.astral_projection, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.attack, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.banish_spirit, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.cast_spell, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.cleanse, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.counterspell, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.full_defense, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.manifest, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.observe_in_detail, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.manipulate_object, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.ready_weapon, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.reload_weapon, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.rigger_jump_in, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.sprint, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.summon_spirit, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.use_simple_device, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
        [Enums.CombatAction.use_skill, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))]
    ]);
    skills = new Map([
        [
            Enums.Skill.astral,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.astral_combat),
                    new SkillSpecializationDef(Enums.Specialization.astral_signatures),
                    new SkillSpecializationDef(Enums.Specialization.emotional_states),
                    new SkillSpecializationDef(Enums.Specialization.spirit_types)
                ],
                pool: "@actor.system.attributes.intuition.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.athletics,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.climbing),
                    new SkillSpecializationDef(Enums.Specialization.flying),
                    new SkillSpecializationDef(Enums.Specialization.gymnastics),
                    new SkillSpecializationDef(Enums.Specialization.sprinting),
                    new SkillSpecializationDef(Enums.Specialization.swimming),
                    new SkillSpecializationDef(Enums.Specialization.throwing),
                    new SkillSpecializationDef(Enums.Specialization.archery)
                ],
                pool: "@actor.system.attributes.agility.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.biotech,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.biotechnology),
                    new SkillSpecializationDef(Enums.Specialization.cybertechnology),
                    new SkillSpecializationDef(Enums.Specialization.first_aid),
                    new SkillSpecializationDef(Enums.Specialization.medicine)
                ],
                pool: "@actor.system.attributes.logic.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.close_combat,
            {
                specializations: [new SkillSpecializationDef(Enums.Specialization.blades), new SkillSpecializationDef(Enums.Specialization.clubs), new SkillSpecializationDef(Enums.Specialization.unarmed)],
                pool: "@actor.system.attributes.agility.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.con,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.acting),
                    new SkillSpecializationDef(Enums.Specialization.disguise),
                    new SkillSpecializationDef(Enums.Specialization.impersonation),
                    new SkillSpecializationDef(Enums.Specialization.performance)
                ],
                pool: "@actor.system.attributes.charisma.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.conjuring,
            {
                specializations: [new SkillSpecializationDef(Enums.Specialization.banishing), new SkillSpecializationDef(Enums.Specialization.summoning)],
                pool: "@actor.system.attributes.magic.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.cracking,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.cybercombat),
                    new SkillSpecializationDef(Enums.Specialization.electronic_warfare),
                    new SkillSpecializationDef(Enums.Specialization.hacking)
                ],
                pool: "@actor.system.attributes.logic.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.electronics,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.computer),
                    new SkillSpecializationDef(Enums.Specialization.hardware),
                    new SkillSpecializationDef(Enums.Specialization.software),
                    new SkillSpecializationDef(Enums.Specialization.complex_forms)
                ],
                pool: "@actor.system.attributes.logic.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.enchanting,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.alchemy),
                    new SkillSpecializationDef(Enums.Specialization.artificing),
                    new SkillSpecializationDef(Enums.Specialization.disenchanting)
                ],
                pool: "@actor.system.attributes.magic.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.engineering,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.aeronautics_mechanic),
                    new SkillSpecializationDef(Enums.Specialization.armorer),
                    new SkillSpecializationDef(Enums.Specialization.automotive_mechanic),
                    new SkillSpecializationDef(Enums.Specialization.demolitions),
                    new SkillSpecializationDef(Enums.Specialization.gunnery),
                    new SkillSpecializationDef(Enums.Specialization.industrial_mechanic),
                    new SkillSpecializationDef(Enums.Specialization.lockpicking),
                    new SkillSpecializationDef(Enums.Specialization.nautical_mechanic)
                ],
                pool: "@actor.system.attributes.logic.pool",
                untrained: true
            }
        ],
        [Enums.Skill.exotic_weapons, { specializations: [], pool: "@actor.system.attributes.agility.pool", untrained: false }],
        [
            Enums.Skill.firearms,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.tasers),
                    new SkillSpecializationDef(Enums.Specialization.holdouts),
                    new SkillSpecializationDef(Enums.Specialization.pistols_light),
                    new SkillSpecializationDef(Enums.Specialization.pistols_heavy),
                    new SkillSpecializationDef(Enums.Specialization.machine_pistols),
                    new SkillSpecializationDef(Enums.Specialization.submachine_guns),
                    new SkillSpecializationDef(Enums.Specialization.rifles),
                    new SkillSpecializationDef(Enums.Specialization.shotguns),
                    new SkillSpecializationDef(Enums.Specialization.assault_cannons)
                ],
                pool: "@actor.system.attributes.agility.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.influence,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.etiquette),
                    new SkillSpecializationDef(Enums.Specialization.instruction),
                    new SkillSpecializationDef(Enums.Specialization.intimidation),
                    new SkillSpecializationDef(Enums.Specialization.leadership),
                    new SkillSpecializationDef(Enums.Specialization.negotiation)
                ],
                pool: "@actor.system.attributes.charisma.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.outdoors,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.navigation),
                    new SkillSpecializationDef(Enums.Specialization.survival),
                    new SkillSpecializationDef(Enums.Specialization.tracking_woods),
                    new SkillSpecializationDef(Enums.Specialization.tracking_desert),
                    new SkillSpecializationDef(Enums.Specialization.tracking_urban),
                    new SkillSpecializationDef(Enums.Specialization.tracking_other)
                ],
                pool: "@actor.system.attributes.intuition.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.perception,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.visual),
                    new SkillSpecializationDef(Enums.Specialization.aural),
                    new SkillSpecializationDef(Enums.Specialization.tactile),
                    new SkillSpecializationDef(Enums.Specialization.scent),
                    new SkillSpecializationDef(Enums.Specialization.taste),
                    new SkillSpecializationDef(Enums.Specialization.perception_woods),
                    new SkillSpecializationDef(Enums.Specialization.perception_desert),
                    new SkillSpecializationDef(Enums.Specialization.perception_urban),
                    new SkillSpecializationDef(Enums.Specialization.perception_other)
                ],
                pool: "@actor.system.attributes.intuition.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.piloting,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.ground_craft),
                    new SkillSpecializationDef(Enums.Specialization.aircraft),
                    new SkillSpecializationDef(Enums.Specialization.watercraft)
                ],
                pool: "@actor.system.attributes.reaction.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.sorcery,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.counterspelling),
                    new SkillSpecializationDef(Enums.Specialization.ritual_spellcasting),
                    new SkillSpecializationDef(Enums.Specialization.spellcasting)
                ],
                pool: "@actor.system.attributes.magic.pool",
                untrained: false
            }
        ],
        [
            Enums.Skill.stealth,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.disguise),
                    new SkillSpecializationDef(Enums.Specialization.palming),
                    new SkillSpecializationDef(Enums.Specialization.sneaking),
                    new SkillSpecializationDef(Enums.Specialization.camouflage)
                ],
                pool: "@actor.system.attributes.agility.pool",
                untrained: true
            }
        ],
        [
            Enums.Skill.tasking,
            {
                specializations: [
                    new SkillSpecializationDef(Enums.Specialization.compiling),
                    new SkillSpecializationDef(Enums.Specialization.decompiling),
                    new SkillSpecializationDef(Enums.Specialization.registering)
                ],
                pool: "@actor.system.attributes.resonance.pool",
                untrained: false
            }
        ]
    ]);
    getSkillOfSpecialization(ty) {
        return [...this.skills.keys()].find((key) => { this.skills.get(key).specializations.find((spec) => spec.id == ty) != undefined; });
    }
    getCombatActionDef(ty) {
        return this.combat_actions.get(ty);
    }
    getMatrixActionDef(ty) {
        return this.matrix_actions.get(ty);
    }
    getSkillDef(ty) {
        return this.skills.get(ty);
    }
    getSkillSpecializationDef(ty) {
        for (let key of this.skills.keys()) {
            for (let special of this.skills.get(key).specializations) {
                if (special.id == ty) {
                    return special;
                }
            }
        }
        throw "NEVER REACHED";
    }
}
export const SR6CONFIG = new SR6Config();
