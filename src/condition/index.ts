import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import ConditionDataModel from '@/condition/ConditionDataModel';
import { basicSheet } from '@/item/sheets';
import SR6Item from '@/item/SR6Item';
import BasicItemSheet from '@/vue/sheets/item/BasicItemSheet.vue';

function registerStatusEffects() {
	CONFIG.statusEffects = [
		{
			id: 'dead',
			label: 'EFFECT.StatusDead',
			icon: 'icons/svg/skull.svg',
		},
		{
			id: 'unconscious',
			label: 'EFFECT.StatusUnconscious',
			icon: 'icons/svg/unconscious.svg',
		},
		{
			id: 'sr6.condition.chilled',
			label: 'SR6.Effect.Chilled',
			icon: 'systems/sr6/assets/status/chilled.svg',
		},
		{
			id: 'sr6.condition.cover1',
			label: 'SR6.Effect.Cover1',
			icon: 'systems/sr6/assets/status/cover1.webp',
		},
		{
			id: 'sr6.condition.cover2',
			label: 'SR6.Effect.Cover2',
			icon: 'systems/sr6/assets/status/cover2.webp',
		},
		{
			id: 'sr6.condition.cover3',
			label: 'SR6.Effect.Cover3',
			icon: 'systems/sr6/assets/status/cover3.webp',
		},
		{
			id: 'sr6.condition.cover4',
			label: 'SR6.Effect.Cover4',
			icon: 'systems/sr6/assets/status/cover4.webp',
		},
	];
}

function registerSheets() {
	Items.registerSheet('sr6', basicSheet(BasicItemSheet), {
		types: ['condition'],
		makeDefault: true,
	});
}

function registerDataModels(): void {
	// Functionality
	CONFIG.Item.dataModels.condition = ConditionDataModel;
}

export function register(): void {
	CONFIG.ActiveEffect.legacyTransferral = false;

	registerStatusEffects();
	registerDataModels();
	registerSheets();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).getCoreConditions = getCoreConditions;
}

export async function getCoreConditions(): Promise<SR6Item<ConditionDataModel>[]> {
	return Array.from(
		(await game.packs.get('sr6.sr6-crb-conditions')!.getDocuments()).map(
			(i) => i as unknown as SR6Item<ConditionDataModel>,
		),
	);
}

export async function toggleStatusEffectCondition(
	statusEffectId: string,
	actor: SR6Actor<BaseActorDataModel>,
): Promise<boolean> {
	const conditions = await getCoreConditions();
	const condition = conditions
		.filter((c) => c.systemData.statusEffectId)
		.find((condition) => condition.systemData.statusEffectId === statusEffectId);
	if (condition) {
		// Does the actor already have the condition?
		const existing = actor.systemData.conditions.find(
			(c) => c.statusEffectId === condition!.systemData.statusEffectId,
		);
		if (existing) {
			// Toggle is a remove
			await actor.deleteEmbeddedDocuments('Item', [existing.item!.id]);

			return false;
		} else {
			await condition.systemData.applyToActor(actor);
			return true;
		}
	} else {
		ui.notifications.error('Status effect is marked as a condition, but has no associated ConditionDataModel');
		return false;
	}
}

/*
[
    {
        id: "dead",
        label: "EFFECT.StatusDead",
        icon: "icons/svg/skull.svg"
    },
    {
        id: "unconscious",
        label: "EFFECT.StatusUnconscious",
        icon: "icons/svg/unconscious.svg"
    },
    {
        id: "sleep",
        label: "EFFECT.StatusAsleep",
        icon: "icons/svg/sleep.svg"
    },
    {
        id: "stun",
        label: "EFFECT.StatusStunned",
        icon: "icons/svg/daze.svg"
    },
    {
        id: "prone",
        label: "EFFECT.StatusProne",
        icon: "icons/svg/falling.svg"
    },
    {
        id: "restrain",
        label: "EFFECT.StatusRestrained",
        icon: "icons/svg/net.svg"
    },
    {
        id: "paralysis",
        label: "EFFECT.StatusParalysis",
        icon: "icons/svg/paralysis.svg"
    },
    {
        id: "fly",
        label: "EFFECT.StatusFlying",
        icon: "icons/svg/wing.svg"
    },
    {
        id: "blind",
        label: "EFFECT.StatusBlind",
        icon: "icons/svg/blind.svg"
    },
    {
        id: "deaf",
        label: "EFFECT.StatusDeaf",
        icon: "icons/svg/deaf.svg"
    },
    {
        id: "silence",
        label: "EFFECT.StatusSilenced",
        icon: "icons/svg/silenced.svg"
    },
    {
        id: "fear",
        label: "EFFECT.StatusFear",
        icon: "icons/svg/terror.svg"
    },
    {
        id: "burning",
        label: "EFFECT.StatusBurning",
        icon: "icons/svg/fire.svg"
    },
    {
        id: "frozen",
        label: "EFFECT.StatusFrozen",
        icon: "icons/svg/frozen.svg"
    },
    {
        id: "shock",
        label: "EFFECT.StatusShocked",
        icon: "icons/svg/lightning.svg"
    },
    {
        id: "corrode",
        label: "EFFECT.StatusCorrode",
        icon: "icons/svg/acid.svg"
    },
    {
        id: "bleeding",
        label: "EFFECT.StatusBleeding",
        icon: "icons/svg/blood.svg"
    },
    {
        id: "disease",
        label: "EFFECT.StatusDisease",
        icon: "icons/svg/biohazard.svg"
    },
    {
        id: "poison",
        label: "EFFECT.StatusPoison",
        icon: "icons/svg/poison.svg"
    },
    {
        id: "curse",
        label: "EFFECT.StatusCursed",
        icon: "icons/svg/sun.svg"
    },
    {
        id: "regen",
        label: "EFFECT.StatusRegen",
        icon: "icons/svg/regen.svg"
    },
    {
        id: "degen",
        label: "EFFECT.StatusDegen",
        icon: "icons/svg/degen.svg"
    },
    {
        id: "upgrade",
        label: "EFFECT.StatusUpgrade",
        icon: "icons/svg/upgrade.svg"
    },
    {
        id: "downgrade",
        label: "EFFECT.StatusDowngrade",
        icon: "icons/svg/downgrade.svg"
    },
    {
        id: "invisible",
        label: "EFFECT.StatusInvisible",
        icon: "icons/svg/invisible.svg"
    },
    {
        id: "target",
        label: "EFFECT.StatusTarget",
        icon: "icons/svg/target.svg"
    },
    {
        id: "eye",
        label: "EFFECT.StatusMarked",
        icon: "icons/svg/eye.svg"
    },
    {
        id: "bless",
        label: "EFFECT.StatusBlessed",
        icon: "icons/svg/angel.svg"
    },
    {
        id: "fireShield",
        label: "EFFECT.StatusFireShield",
        icon: "icons/svg/fire-shield.svg"
    },
    {
        id: "coldShield",
        label: "EFFECT.StatusIceShield",
        icon: "icons/svg/ice-shield.svg"
    },
    {
        id: "magicShield",
        label: "EFFECT.StatusMagicShield",
        icon: "icons/svg/mage-shield.svg"
    },
    {
        id: "holyShield",
        label: "EFFECT.StatusHolyShield",
        icon: "icons/svg/holy-shield.svg"
    }
]
 */
