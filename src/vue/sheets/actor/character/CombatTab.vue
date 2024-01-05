<script lang="ts" setup>
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActivationPeriod, ActivationType } from '@/data';
import GeneralActionDataModel, { GeneralActionCategory } from '@/item/data/action/GeneralActionDataModel';
import SR6Item from '@/item/SR6Item';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { computed, inject, toRaw } from 'vue';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

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
			.filter((i) => i.systemData.category == GeneralActionCategory.General)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);
const combatActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
			.filter((i) => i.systemData.category == GeneralActionCategory.Combat)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);
const magicActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'general_action')
			.map((i) => i as SR6Item<GeneralActionDataModel>)
			.filter((i) => i.systemData.category == GeneralActionCategory.Magic)
			.sort(sortActions) as SR6Item<GeneralActionDataModel>[]
);

//const generalActions = computed(() =>
//	allActions.data.filter((i) => i.systemData.category == GeneralActionCategory.General)
//);
function addGeneralAction() {}

function addCoreActions() {
	toRaw(system.value)._addCoreGeneralActions();
}

async function useGeneralAction(action: SR6Item<GeneralActionDataModel>) {
	console.log('use', action);

	// TODO: better dialog
	const consume = await Dialog.confirm({
		title: 'Consume action with use?',
		content: 'Do you want to consume an action with this use?',
		yes: () => true,
		no: () => false,
	});
	await action.systemData.use(consume);
}
</script>

<template>
	<section class="tab-combat">
		<div class="section" style="width: 40%">
			<div class="section-head">Combat Actions</div>
			<table
				class="field-table"
				style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 100%"
			>
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
				<template v-for="action in combatActions" :key="action.id">
					<tr :title="action.systemData.description">
						<td style="width: 100%">{{ action.name }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
						<td>
							<a v-if="action.systemData.available()" @click="useGeneralAction(action)" data-die="A"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							>
							<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
						</td>
					</tr>
					<!--<tr>
						<td colspan="4">
							<textarea
								rows="15"
								cols="50"
								id="aboutDescription"
								style="max-height: 100px; min-height: 100px; resize: none"
								>{{ action.systemData.description }}</textarea
							>
						</td>
					</tr>-->
				</template>
			</table>
		</div>
		<div class="section" style="width: 40%">
			<div class="section-head">Combat Actions</div>
			<table
				class="field-table"
				style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 100%"
			>
				<thead>
					<tr class="field-table">
						<td>Action</td>
						<td>Use</td>
						<td>When</td>
						<td>
							<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addGeneralAction" /><a
								v-if="context.user.isGM && generalActions.length == 0"
								class="fas fa-infinity"
								@click.prevent="addCoreActions"
							/>
						</td>
					</tr>
				</thead>
				<template v-for="action in generalActions" :key="action.id">
					<tr :title="action.systemData.description">
						<td style="width: 100%">{{ action.name }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
						<td>
							<a v-if="action.systemData.available()" @click="useGeneralAction(action)" data-die="A"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							>
							<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
						</td>
					</tr>
				</template>
			</table>
			<div class="section-head">Magic Actions</div>
			<table
				class="field-table"
				style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 100%"
			>
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
					<tr :title="action.systemData.description">
						<td style="width: 100%">{{ action.name }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationType }}</td>
						<td style="padding-right: 5px">{{ action.systemData.limits.activationPeriod }}</td>
						<td>
							<a v-if="action.systemData.available()" @click="useGeneralAction(action)" data-die="A"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							>
							<i v-else class="roll-button roll-disabled">&nbsp;&nbsp;&nbsp;&nbsp;</i>
						</td>
					</tr>
				</template>
			</table>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
