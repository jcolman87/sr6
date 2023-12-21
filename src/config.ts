import type { EffectChangeDataConstructorData as EffectChangeData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData";
import * as Rules from "./rules.js";

import { SR6Actor } from "./actors/SR6Actor.js";
import * as Rolls from "./rolls/Rolls.js";

export { Rules, EffectChangeData };
export type EffectChangeMode = foundry.CONST.ACTIVE_EFFECT_MODES;
export const EffectChangeMode = foundry.CONST.ACTIVE_EFFECT_MODES;

export namespace Enums {
	export enum Initiative {
		Physical = "physical",
		Astral = "astral",
		Matrix = "matrix"
	}

	export enum WeaponAccessoryLocation {
		Under = "under",
		Barrel = "barrel",
		Top = "top"
	}

	export enum Attribute {
		body,
		agility,
		reaction,
		strength,
		willpower,
		logic,
		intuition,
		charisma,
		magic,
		resonance,
		essense,
		edge
	}

	export enum Specialization {
		astral_combat,
		astral_signatures,
		spirit_types,
		climbing,
		flying,
		emotional_states,
		gymnastics,
		sprinting,
		swimming,
		throwing,
		archery,
		biotechnology,
		cybertechnology,
		first_aid,
		medicine,
		blades,
		clubs,
		unarmed,
		acting,
		disguise,
		impersonation,
		performance,
		banishing,
		summoning,
		cybercombat,
		electronic_warfare,
		hacking,
		computer,
		hardware,
		software,
		complex_forms,
		alchemy,
		artificing,
		disenchanting,
		aeronautics_mechanic,
		armorer,
		automotive_mechanic,
		demolitions,
		gunnery,
		industrial_mechanic,
		lockpicking,
		nautical_mechanic,
		tasers,
		holdouts,
		pistols_light,
		pistols_heavy,
		machine_pistols,
		submachine_guns,
		rifles,
		shotguns,
		assault_cannons,
		etiquette,
		instruction,
		intimidation,
		leadership,
		negotiation,
		navigation,
		survival,
		tracking_woods,
		tracking_desert,
		tracking_urban,
		tracking_other,
		visual,
		aural,
		tactile,
		scent,
		taste,
		perception_woods,
		perception_desert,
		perception_urban,
		perception_other,
		ground_craft,
		aircraft,
		watercraft,
		counterspelling,
		ritual_spellcasting,
		spellcasting,
		palming,
		sneaking,
		camouflage,
		compiling,
		decompiling,
		registering
	}

	export enum Skill {
		astral,
		athletics,
		biotech,
		close_combat,
		con,
		conjuring,
		cracking,
		electronics,
		enchanting,
		engineering,
		exotic_weapons,
		firearms,
		influence,
		outdoors,
		perception,
		piloting,
		sorcery,
		stealth,
		tasking
	}

	export enum CombatAction {
		change_focus,
		avoid_incoming,
		block,
		call_shot,
		change_device_mode,
		command_drone,
		command_spirit,
		dodge,
		drop_object,
		drop_prone,
		hit_the_dirt,
		intercept,
		move,
		multiple_attacks,
		quick_draw,
		reload_smartgun,
		shift_perception,
		stand_up,
		take_aim,
		take_cover,
		trip,
		assist,
		astral_projection,
		attack,
		banish_spirit,
		cast_spell,
		cleanse,
		counterspell,
		full_defense,
		manifest,
		observe_in_detail,
		manipulate_object,
		ready_weapon,
		reload_weapon,
		rigger_jump_in,
		sprint,
		summon_spirit,
		use_simple_device,
		use_skill
	}

	export enum MatrixAction {
		backdoor_entry,
		brute_force,
		change_icon,
		check_os,
		control_device,
		crack_file,
		crash_program,
		data_spike,
		disarm_data_bomb,
		edit_file,
		encrypt_file,
		enter_host,
		erase_matrix_signature,
		format_device,
		full_matrix_defense,
		hash_check,
		hide,
		jack_out,
		jam_signals,
		jump_rigged,
		matrix_perception,
		matrix_search,
		probe,
		reboot_device,
		reconfigure,
		send_message,
		set_data_bomb,
		snoop,
		spoof_command,
		switch_ifmode,
		tarpit,
		trace_icon,

		// IC actions
		ic_blaster_attack
	}

	export enum MatrixProgram {
		// Legal
		browse,
		baby_monitor,
		configurator,
		edit,
		encryption,
		signal_scrubber,
		toolbox,
		virtual_machine,
		// Hacking
		armor,
		biofeedback,
		biofeedback_filter,
		blackout,
		decryption,
		defuse,
		exploit,
		fork,
		lockdown,
		overclock,
		stealth,
		trace
	}

	export enum EdgeBoost {
		add_edge_pool,
		buy_auto_hit,
		count_2_glitch,
		create_special,
		heal_1_physic,
		heal_1_stun,
		negate_1_edge,
		plus_1_roll,
		plus_3_ini,
		reroll_failed,
		reroll_one
	}

	export enum EdgeAction {
		anticipation,
		big_speech,
		bring_the_drama,
		called_shot_disarm,
		called_shot_vitals,
		fire_from_cover,
		knockout_blow,
		shank,
		sudden_insight,
		tactical_roll,
		tumble,
		wrest
	}

	export enum Activation {
		Passive = 0,
		Minor = 1,
		Major = 2
	}

	export enum ActivationLimit {
		Initiative = "initiative",
		Any = "any",
		Pre = "pre",
		Post = "post"
	}

	export enum AccessLevel {
		Outsider = 1 << 0,
		User = 1 << 1,
		Admin = 1 << 2
	}

	export enum Distance {
		Close,
		Near,
		Medium,
		Far,
		Extreme
	}

	export enum FireMode {
		SS = "SS",
		SA = "SA", // -2 AR +1 DR
		BF_narrow = "BF_narrow", // narrow -4 AR +2 DR, wide=split dice pool
		BF_wide = "BF_wide", // narrow -4 AR +2 DR, wide=split dice pool
		FA = "FA" // -6 AR
	}

	export enum DamageType {
		Physical = "Physical",
		Stun = "Stun",
		Matrix = "Matrix",
		Astral = "Astral"
	}

	export enum DamageForm {
		Physical,
		Fire,
		Cold,
		Acid,
		Magic
	}

	export enum Size {
		Large = 0,
		Bulky = 1,
		Tuckable = 2,
		Pocket = 3,
		Hand = 4,
		Slim = 5,
		Palmable = 6,
		Small = 7,
		Mini = 8,
		Fine = 9,
		Microscopic = 10
	}

	export enum Lifestyle {
		Street = 0,
		Squatter = 1,
		Low = 2,
		Middle = 3,
		High = 4,
		Luxury = 5
	}

	export enum SpellCombatType {
		Direct = 0,
		Indirect = 1
	}

	export enum SpellRangeType {
		Touch = 0,
		LineOfSight = 1,
		Perceived = 2
	}

	export enum SpellDurationType {
		Instantaneous = 0,
		Sustained = 1,
		Permanent = 2,
		Limited = 3
	}

	export enum AugmentationQuality {
		Standard = 0,
		Alpha = 1,
		Beta = 2
	}

	export enum VRType {
		AR,
		Cold,
		Hot
	}
}

export class SkillUse {
	skill: undefined | Enums.Skill;
	specialization: undefined | Enums.Specialization;
}

export class SkillSpecializationDef {
	id: Enums.Specialization;
	pool: string | undefined;

	constructor(id: Enums.Specialization, pool: undefined | string = undefined) {
		this.id = id;
		this.pool = pool;
	}
}

export class SkillDef {
	specializations: SkillSpecializationDef[] = [];
	pool: string = "0";
	untrained: boolean = true;
}

export class Activation {
	type: Enums.Activation;
	when: Enums.ActivationLimit;

	constructor(type: Enums.Activation, when: Enums.ActivationLimit) {
		this.type = type;
		this.when = when;
	}
}

export class CombatActionDef {
	activation: Activation;
	changes: EffectChangeData[];
	duration: number;

	constructor(activation: Activation, changes: EffectChangeData[] = [], duration: number = 1) {
		this.activation = activation;
		this.changes = changes;
		this.duration = duration;
	}
}

export class EdgeBoostDef {
	cost: number;
	changes: EffectChangeData[];
	activation_limit: Enums.ActivationLimit;

	condition(activation: Enums.ActivationLimit, roll: Rolls.SR6RollData): boolean {
		return activation == this.activation_limit || this.activation_limit == Enums.ActivationLimit.Any;
	}
	async prepareData(roll: Rolls.SR6RollData) {}
	async apply(roll: Rolls.SR6Roll) {}

	constructor(
		cost: number,
		activation_limit: Enums.ActivationLimit,
		changes: EffectChangeData[] = [],
		condition: null | ((activation: Enums.ActivationLimit, roll: Rolls.SR6RollData) => boolean) = null,
		prepareData: null | ((roll: Rolls.SR6RollData) => Promise<void>) = null,
		apply: null | ((roll: Rolls.SR6Roll) => Promise<void>) = null
	) {
		this.cost = cost;
		this.activation_limit = activation_limit;
		if (condition != null) this.condition = condition;
		if (prepareData != null) this.prepareData = prepareData;
		if (apply != null) this.apply = apply;
		this.changes = changes;
	}
}

export class EdgeActionDef {
	cost: number;
	changes: EffectChangeData[] = [];

	constructor(cost: number, changes: EffectChangeData[]) {
		this.cost = cost;
		this.changes = changes;
	}
}

export class MatrixActionDef {
	formula: null | string;
	illegal: boolean;
	is_player_action: boolean;
	activation: Activation;
	access_level: Enums.AccessLevel;

	specialization: Enums.Specialization;

	defendAgainstFormula: null | string;
	damageFormula: null | string;

	async apply(roll: Rolls.SR6MatrixDefenseRoll) {}

	constructor(formula: string | null, 
		specialization: Enums.Specialization, 
		illegal: boolean, 
		activation: Activation, 
		access_level: Enums.AccessLevel, 
		is_player_action: boolean = true, 
		defendAgainstFormula: string | null = null, 
		damageFormula: null | string = null, 
		apply: null | ((roll: Rolls.SR6MatrixDefenseRoll) => Promise<void>) = null) {
		this.formula = formula;
		this.illegal = illegal;
		this.activation = activation;
		this.access_level = access_level;
		this.specialization = specialization;
		this.is_player_action = is_player_action;

		this.defendAgainstFormula = defendAgainstFormula;
		this.damageFormula = damageFormula;

		if(apply != null) this.apply = apply;
	}
}

export class MatrixProgramDef {
	illegal: boolean;
	modifier: string;

	constructor(illegal: boolean, modifier: string) {
		this.illegal = illegal;
		this.modifier = modifier;
	}
}

export class SR6Config {
	GEAR_TYPES = [
		"ACCESSORY",
		"ARMOR",
		"ARMOR_ADDITION",
		"BIOWARE",
		"CYBERWARE",
		"TOOLS",
		"ELECTRONICS",
		"NANOWARE",
		"GENETICS",
		"WEAPON_CLOSE_COMBAT",
		"WEAPON_RANGED",
		"WEAPON_FIREARMS",
		"WEAPON_SPECIAL",
		"AMMUNITION",
		"CHEMICALS",
		"SOFTWARE",
		"SURVIVAL",
		"BIOLOGY",
		"VEHICLES",
		"DRONES",
		"MAGICAL"
	];

	GEAR_SUBTYPES = new Map([
		["ACCESSORY", ["TOP_OR_UNDERBARREL", "TOP", "BARREL", "UNDERBARREL"]],
		["ARMOR", ["ARMOR_BODY", "ARMOR_HELMET", "ARMOR_SHIELD"]],
		["ARMOR_ADDITION", []],
		["BIOWARE", ["BIOWARE_STANDARD", "BIOWARE_CULTURED", "BIOWARE_IMPLANT_WEAPON"]],
		["CYBERWARE", ["CYBER_HEADWARE", "CYBERJACK", "CYBER_EYEWARE", "CYBER_BODYWARE", "CYBER_EARWARE", "CYBER_IMPLANT_WEAPON", "CYBER_LIMBS", "COMMLINK", "CYBERDECK"]],
		["TOOLS", ["TOOLS"]],
		[
			"ELECTRONICS",
			["COMMLINK", "CYBERDECK", "ELECTRONIC_ACCESSORIES", "RIGGER_CONSOLE", "RFID", "COMMUNICATION", "ID_CREDIT", "IMAGING", "OPTICAL", "AUDIO", "SENSOR_HOUSING", "SECURITY", "BREAKING", "TAC_NET"]
		],
		["NANOWARE", []],
		["GENETICS", []],
		["SOFTWARE", ["AUTOSOFT", "SKILLSOFT"]],
		["WEAPON_CLOSE_COMBAT", ["BLADES", "CLUBS", "WHIPS", "UNARMED", "OTHER_CLOSE"]],
		["WEAPON_RANGED", ["BOWS", "CROSSBOWS", "THROWING"]],
		[
			"WEAPON_FIREARMS",
			[
				"TASERS",
				"HOLDOUTS",
				"PISTOLS_LIGHT",
				"MACHINE_PISTOLS",
				"PISTOLS_HEAVY",
				"SUBMACHINE_GUNS",
				"SHOTGUNS",
				"RIFLE_ASSAULT",
				"RIFLE_HUNTING",
				"RIFLE_SNIPER",
				"LMG",
				"MMG",
				"HMG",
				"ASSAULT_CANNON"
			]
		],
		["WEAPON_SPECIAL", ["LAUNCHERS", "THROWERS", "OTHER_SPECIAL"]],
		["AMMUNITION", ["AMMO_TASER", "AMMO_LIGHT", "AMMO_HEAVY", "AMMO_RIFLE", "AMMO_SHOTGUN", "AMMO_MG", "AMMO_ROCKETS", "AMMO_MISSILES", "AMMO_EXPLOSIVES", "AMMO_GRENADES"]],
		["CHEMICALS", ["INDUSTRIAL_CHEMICALS", "TOXINS", "DRUGS", "BTL"]],
		["SURVIVAL", ["SURVIVAL_GEAR", "GRAPPLE_GUN"]],
		["BIOLOGY", ["BIOTECH", "SLAP_PATCHES"]],
		["VEHICLES", ["BIKES", "CARS", "TRUCKS", "BOATS", "SUBMARINES", "FIXED_WING", "ROTORCRAFT", "VTOL", "WALKER"]],
		["DRONES", ["MICRODRONES", "MINIDRONES", "SMALL_DRONES", "MEDIUM_DRONES", "LARGE_DRONES"]],
		["MAGICAL", ["MAGIC_SUPPLIES"]]
	]);

	edge_boosts: Map<Enums.EdgeBoost, EdgeBoostDef> = new Map([
		[Enums.EdgeBoost.plus_1_roll, new EdgeBoostDef(2, Enums.ActivationLimit.Post, [], null, null, Rules.EdgeBoosts.plus_1_roll.apply)],
		[Enums.EdgeBoost.reroll_one, new EdgeBoostDef(1, Enums.ActivationLimit.Post, [], null, null, Rules.EdgeBoosts.reroll_one.apply)],
		[Enums.EdgeBoost.buy_auto_hit, new EdgeBoostDef(3, Enums.ActivationLimit.Any, [], null, Rules.EdgeBoosts.buy_auto_hit.prepareData, Rules.EdgeBoosts.buy_auto_hit.apply)],
		[Enums.EdgeBoost.add_edge_pool, new EdgeBoostDef(4, Enums.ActivationLimit.Pre, [], null, Rules.EdgeBoosts.add_edge_pool.prepareData, Rules.EdgeBoosts.add_edge_pool.apply)],
		[Enums.EdgeBoost.reroll_failed, new EdgeBoostDef(5, Enums.ActivationLimit.Post, [], null, null, Rules.EdgeBoosts.reroll_failed.apply)]
	]);

	matrix_programs: Map<Enums.MatrixProgram, MatrixProgramDef> = new Map([
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

	/*
		formula: string | null, 
		specialization: Enums.Specialization, 
		illegal: boolean, 
		activation: Activation, 
		access_level: Enums.AccessLevel, 
		player_action: boolean = true, 
		defendAgainstFormula: string | null = null, 
		damageFormula: null | string = null, 
		apply: null | ((roll: Rolls.SR6MatrixDefenseRoll) => Promise<void>) = null
	*/

	matrix_actions: Map<Enums.MatrixAction, MatrixActionDef> = new Map([
		[
			Enums.MatrixAction.ic_blaster_attack,
			new MatrixActionDef(
				"@actor.rating * 2", //attack
				0, // specialization
				false, // illegal
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative), //activation
				0, // access
				false, //player usable
				"@actor.system.attributes.logic.pool + @actor.matrix_persona.attributes.f", //defend
				"@actor.rating" //damage

			)
		],
		[
			Enums.MatrixAction.backdoor_entry,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.hacking,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.brute_force,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.cybercombat,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.change_icon,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null
			)
		],
		[
			Enums.MatrixAction.check_os,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.electronic_warfare,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.control_device,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.crack_file,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.hacking,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.crash_program,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.cybercombat,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.data_spike,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.cybercombat,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				"ceil(@actor.matrix_persona.attributes.a / 2)"

			)
		],
		[
			Enums.MatrixAction.disarm_data_bomb,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.edit_file,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.encrypt_file,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.enter_host,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null

			)
		],
		[
			Enums.MatrixAction.erase_matrix_signature,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.format_device,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.full_matrix_defense,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null

			)
		],
		[
			Enums.MatrixAction.hash_check,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.hacking,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.hide,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.electronic_warfare,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.jack_out,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.jam_signals,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.electronic_warfare,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.jump_rigged,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.matrix_perception,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.matrix_search,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.computer,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.probe,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.hacking,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.reboot_device,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.reconfigure,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null

			)
		],
		[
			Enums.MatrixAction.send_message,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null

			)
		],
		[
			Enums.MatrixAction.set_data_bomb,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.snoop,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.software,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.spoof_command,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.hacking,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.switch_ifmode,
			new MatrixActionDef(
				null,
				Enums.Specialization.hacking,
				false,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				null,
				null

			)
		],
		[
			Enums.MatrixAction.tarpit,
			new MatrixActionDef(
				"@actor.system.skills.cracking.pool",
				Enums.Specialization.cybercombat,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		],
		[
			Enums.MatrixAction.trace_icon,
			new MatrixActionDef(
				"@actor.system.skills.electronics.pool",
				Enums.Specialization.software,
				true,
				new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative),
				Enums.AccessLevel.Outsider | Enums.AccessLevel.User | Enums.AccessLevel.Admin,
				true,
				"@actor.system.attributes.willpower.pool + @actor.matrix_persona.attributes.f",
				null

			)
		]
	]);

	combat_actions: Map<Enums.CombatAction, CombatActionDef> = new Map([
		[Enums.CombatAction.change_focus, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.avoid_incoming, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.block, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[
			Enums.CombatAction.call_shot,
			new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative), [
				{
					key: "system.effect_modifiers.damage",
					value: "2",
					mode: EffectChangeMode.ADD,
					priority: 1
				},
				{
					key: "system.effect_modifiers.attack_pool",
					value: "-4",
					mode: EffectChangeMode.ADD,
					priority: 1
				}
			])
		],
		[Enums.CombatAction.change_device_mode, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.command_drone, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.command_spirit, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.dodge, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.drop_object, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.drop_prone, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.hit_the_dirt, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.intercept, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.move, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.multiple_attacks, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.quick_draw, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.reload_smartgun, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.shift_perception, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.stand_up, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.take_aim, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.take_cover, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.trip, new CombatActionDef(new Activation(Enums.Activation.Minor, Enums.ActivationLimit.Initiative))],
		// Major
		[Enums.CombatAction.assist, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.astral_projection, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.attack, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.banish_spirit, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.cast_spell, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.cleanse, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.counterspell, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.full_defense, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Any))],
		[Enums.CombatAction.manifest, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.observe_in_detail, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.manipulate_object, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.ready_weapon, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.reload_weapon, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.rigger_jump_in, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.sprint, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.summon_spirit, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.use_simple_device, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))],
		[Enums.CombatAction.use_skill, new CombatActionDef(new Activation(Enums.Activation.Major, Enums.ActivationLimit.Initiative))]
	]);

	skills: Map<Enums.Skill, SkillDef> = new Map([
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

	getSkillOfSpecialization(ty: Enums.Specialization): Enums.Skill {
		return [...this.skills.keys()].find((key: Enums.Skill) => {
			this.skills.get(key)!.specializations.find((spec) => spec.id == ty) != undefined;
		})!;
	}

	getCombatActionDef(ty: Enums.CombatAction): CombatActionDef {
		return this.combat_actions.get(ty)!;
	}

	getMatrixActionDef(ty: Enums.MatrixAction): MatrixActionDef {
		return this.matrix_actions.get(ty)!;
	}

	getSkillDef(ty: Enums.Skill): SkillDef {
		return this.skills.get(ty)!;
	}

	getSkillSpecializationDef(ty: Enums.Specialization): SkillSpecializationDef {
		for (let key of this.skills.keys()) {
			for (let special of this.skills.get(key)!.specializations) {
				if (special.id == ty) {
					return special;
				}
			}
		}

		throw "NEVER REACHED";
	}
}
export const SR6CONFIG: SR6Config = new SR6Config();
