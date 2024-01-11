<script lang="ts" setup>
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActivationPeriod, ActivationType } from '@/data';
import GeneralActionDataModel, { GeneralActionCategory } from '@/item/data/action/GeneralActionDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import SR6Item from '@/item/SR6Item';
import { rollWeaponAttack } from '@/roll/Rollers';
import CombatInfo from '@/vue/components/combat/CombatInfo.vue';
import Weapons from '@/vue/components/combat/Weapons.vue';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { computed, inject, toRaw, onUpdated, ref } from 'vue';
import { Collapse } from 'vue-collapsed';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const colorStatus = ref(true);

function getWeapons(): WeaponDataModel[] {
	return toRaw(context.data.actor).systemData.weapons;
}

function sortActions(a: SR6Item<GeneralActionDataModel>, b: SR6Item<GeneralActionDataModel>) {
	return (
		Object.values(ActivationType).indexOf(b.systemData.limits.activationType) -
			Object.values(ActivationType).indexOf(a.systemData.limits.activationType) ||
		Object.values(ActivationPeriod).indexOf(b.systemData.limits.activationPeriod) -
			Object.values(ActivationPeriod).indexOf(a.systemData.limits.activationPeriod) ||
		a.name.localeCompare(b.name)
	);
}

const generalActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
			.filter((i) => i.systemData.category === GeneralActionCategory.General)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);
const combatActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
			.filter((i) => i.systemData.category === GeneralActionCategory.Combat)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);
const magicActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
			.filter((i) => i.systemData.category === GeneralActionCategory.Magic)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);

const actionsDescriptionVisible = ref(
	generalActions.value
		.map((c) => {
			return {
				id: c.id,
				visible: false,
			};
		})
		.concat(
			combatActions.value.map((c) => {
				return {
					id: c.id,
					visible: false,
				};
			})
		)
		.concat(
			magicActions.value.map((c) => {
				return {
					id: c.id,
					visible: false,
				};
			})
		)
);

function addGeneralAction() {}

async function addCoreActions() {
	await toRaw(system.value)._addCoreGeneralActions();
}

async function useGeneralAction(action: SR6Item<GeneralActionDataModel>) {
	// TODO: better dialog
	const consume = await Dialog.confirm({
		title: 'Consume action with use?',
		content: 'Do you want to consume an action with this use?',
		yes: () => true,
		no: () => false,
	});

	// Special case for Attack
	if (action.name == 'Attack') {
		const actor = toRaw(context.data.actor);
		const weapon = actor.systemData.equipped.weapon;
		if (!weapon) {
			ui.notifications.error('You have no equipped weapon. No action was consumed');
			return;
		}
		await action.systemData.use(consume, false);
		await rollWeaponAttack(actor.systemData, weapon);
	} else {
		await action.systemData.use(consume);
	}
}

function isActorTurn(): boolean {
	return context.data.combat?.combatant?.actor.uuid == context.data.actor.uuid;
}

function getActiveClass(action: SR6Item<GeneralActionDataModel>): string {
	if (colorStatus.value) {
		if (action.systemData.available) {
			return 'available';
		} else {
			return 'not-available';
		}
	} else {
		return '';
	}
}

function minimizeCategory(actions: SR6Item<GeneralActionDataModel>[]) {
	actions.forEach((a) => (actionsDescriptionVisible.value.find((c) => c.id == a.id)!.visible = false));
}
</script>

<template>
	<section class="tab-combat">
		<div class="active-combat">
			<div class="section-head">Active Combat</div>
			<CombatInfo ref="combatInfo" />
			<Weapons :actor="context.data.actor" :weapons="getWeapons()" />
		</div>
		<div class="actions">
			<div></div>
			<div class="combat-actions">
				<div class="section-head">
					Combat Actions
					<div style="margin-left: auto; font-weight: normal; font-size: 11px">
						Color Status
						<label class="switch">
							<input type="checkbox" @change="colorStatus = !colorStatus" :checked="colorStatus" />
							<span class="slider round"></span> </label
						>&nbsp;&nbsp;
						<a class="fa-solid fa-minimize" @click="minimizeCategory(combatActions)"></a>
					</div>
				</div>
				<table class="field-table">
					<thead>
						<tr class="field-table">
							<td>Action</td>
							<td>Use</td>
							<td>When</td>
							<td>
								<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addGeneralAction" />
								<a
									v-if="context.user.isGM && generalActions.length == 0"
									class="fas fa-infinity"
									@click.prevent="addCoreActions"
								/>
							</td>
						</tr>
					</thead>
					<template v-for="action in combatActions" :key="action.id">
						<tr :title="action.systemData.description" :class="getActiveClass(action)">
							<td style="width: 100%">
								<a
									@click="
										actionsDescriptionVisible.find((v) => v.id == action.id)!.visible =
											!actionsDescriptionVisible.find((v) => v.id == action.id)!.visible
									"
									><i class="fa-solid fa-down-from-line"></i> {{ action.name }}</a
								>
							</td>
							<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
							<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
							<td>
								<a v-if="action.systemData.available" @click="useGeneralAction(action)"
									><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
								>
								<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
							</td>
						</tr>
						<tr>
							<td colspan="5">
								<Collapse :when="actionsDescriptionVisible.find((v) => v.id == action.id)!.visible">
									<textarea
										id="aboutDescription"
										style="max-height: 100px; min-height: 50px; resize: none; font-size: 10px"
										disabled
										>{{ action.systemData.description }}</textarea
									>
								</Collapse>
							</td>
						</tr>
					</template>
				</table>
			</div>
			<div class="magic-general-section">
				<div class="general-actions">
					<div class="section-head">General Actions</div>
					<table class="field-table">
						<thead>
							<tr class="field-table">
								<td>Action</td>
								<td>Use</td>
								<td>When</td>
								<td>
									<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addGeneralAction" />
								</td>
							</tr>
						</thead>
						<template v-for="action in generalActions" :key="action.id">
							<tr :title="action.systemData.description" :class="getActiveClass(action)">
								<td style="width: 100%">{{ action.name }}</td>
								<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
								<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
								<td>
									<a v-if="action.systemData.available" @click="useGeneralAction(action)" data-die="A"
										><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
									>
									<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
								</td>
							</tr>
						</template>
					</table>
				</div>
				<div class="magic-actions">
					<div class="section-head">Magic Actions</div>
					<table class="field-table">
						<thead>
							<tr class="field-table">
								<td>Action</td>
								<td>Use</td>
								<td>When</td>
								<td>
									<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addGeneralAction" />
								</td>
							</tr>
						</thead>
						<template v-for="action in magicActions" :key="action.id">
							<tr :title="action.systemData.description" :class="getActiveClass(action)">
								<td style="width: 100%">{{ action.name }}</td>
								<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
								<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
								<td>
									<a v-if="action.systemData.available" @click="useGeneralAction(action)" data-die="A"
										><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
									>
									<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
								</td>
							</tr>
						</template>
					</table>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';

.tab-combat {
	display: flex;

	.active-combat {
		@extend .section;
		width: 30%;
	}

	.available {
		background-color: colors.$green-bg;
	}
	.not-available {
		background-color: colors.$red-bg;
	}

	.actions {
		display: flex;
		width: 70%;

		.combat-actions {
			@extend .section;
			width: 50%;
		}
		.magic-general-section {
			width: 50%;
		}
		.general-actions {
			@extend .section;
			width: 100%;
		}
		.magic-actions {
			@extend .section;
			width: 100%;
		}
	}
}
</style>
