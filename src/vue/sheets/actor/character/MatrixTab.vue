<script lang="ts" setup>
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { MagicAwakenedType } from '@/data/magic';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import MatrixPersonaDataModel from '@/item/data/feature/MatrixPersonaDataModel';
import GearDataModel, { GearMatrixDataModel } from '@/item/data/gear/GearDataModel';

import SR6Item from '@/item/SR6Item';
import * as rollers from '@/roll/Rollers';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import MatrixAttributesView from '@/vue/views/MatrixAttributesView.vue';
import MatrixProgramSlotsView from '@/vue/views/MatrixProgramSlotsView.vue';
import { computed, inject, toRaw } from 'vue';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const matrixActions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'matrix_action')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<MatrixActionDataModel>[]
);

const matrixDevices = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'gear')
		.map((i) => i as SR6Item<GearDataModel>)
		.filter((i) => i.systemData.matrix)
		.sort((a, b) => a.name.localeCompare(b.name))
);

const persona = computed(() => {
	let persona = toRaw(context.data.actor).items.find((i) => i.type === 'matrix_persona');
	if (persona) {
		return persona as SR6Item<MatrixPersonaDataModel>;
	} else {
		return null;
	}
});
const hasPersona = computed(() => persona.value !== null);

async function rollMatrixAction(action: SR6Item<MatrixActionDataModel>) {
	await rollers.rollMatrixAction(toRaw(context.data.actor).systemData, toRaw(action));
}

function addMatrixAction() {}

function addCoreActions() {
	toRaw(system.value)._addCoreMatrixActions();
}

async function toggleMatrixDevice(device: SR6Item<GearDataModel>): Promise<boolean> {
	return device.systemData.toggleWireless();
}

async function togglePersona(ev: Event): Promise<void> {
	// Find an active device to activate with
	if (!(ev.target as HTMLInputElement).checked) {
		await toRaw(system.value).deactivateMatrixPersona();
	} else {
		if (context.data.actor.systemData.magicAwakened == MagicAwakenedType.Technomancer) {
			const newPersona = await toRaw(system.value).activateMatrixPersona(null);
			newPersona.systemData.attributes.reset();
		} else {
			const activeDevice = matrixDevices.value.find((i) =>
				i.systemData.matrix
					? i.systemData.matrix!.active && i.systemData.matrix!.supportsModes.length > 0
					: false
			);
			if (!activeDevice) {
				ui.notifications.error('You do not have an active matrix device to enter the matrix with!');
				(ev.target as HTMLInputElement).checked = false;
				return;
			}
			const newPersona = await toRaw(system.value).activateMatrixPersona(activeDevice);
			newPersona.systemData.attributes.reset();
		}
	}
}

async function onAttributesUpdated(attributes: AdjustableMatrixAttributesDataModel) {
	await toRaw(persona.value!).update({ ['system.attributes']: attributes });
}
async function onProgramSlotsUpdated(model: GearMatrixDataModel) {
	await toRaw(model.item!).update({ ['system.matrix']: model });
}
</script>

<template>
	<section class="tab-matrix">
		<div class="section" style="width: 30%">
			<div class="section-head">Matrix Actions</div>
			<table
				class="field-table"
				style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 100%"
			>
				<thead>
					<tr class="field-table">
						<td>Skill</td>
						<td>Pool</td>
						<td>
							<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addMatrixAction" /><a
								v-if="context.user.isGM && matrixActions.length == 0"
								class="fas fa-infinity"
								@click.prevent="addCoreActions"
							/>
						</td>
					</tr>
				</thead>
				<tr v-for="action in matrixActions" :key="action.id" :title="action.systemData.description">
					<td style="width: 100%">{{ action.name }}</td>
					<td>{{ action.systemData.pool }}</td>
					<td>
						<a @click="rollMatrixAction(action)" data-die="A"
							><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
						>
					</td>
				</tr>
			</table>
		</div>
		<div class="section">
			<div class="section-head">
				Persona&nbsp;&nbsp;&nbsp;<label class="switch">
					<input type="checkbox" @change.prevent="togglePersona" :checked="hasPersona" />
					<span class="slider round"></span>
				</label>
			</div>
			<template v-if="hasPersona">
				<MatrixAttributesView
					v-if="persona"
					:attributes="persona.systemData.attributes"
					@change="onAttributesUpdated"
				/>
			</template>
		</div>
		<div class="section">
			<div class="section-head">Wireless Devices</div>
			<table>
				<template v-for="device in matrixDevices" :key="device.id">
					<tr>
						<td style="width: 1%">
							<label class="switch">
								<input
									type="checkbox"
									@change.prevent="toggleMatrixDevice(device)"
									:checked="device.systemData.matrix!.active"
								/>
								<span class="slider round"></span>
							</label>
						</td>
						<td style="width: 100%">{{ device.name }}</td>
					</tr>
					<tr v-if="device.systemData.matrix!.programSlots.total > 0 && device.systemData.matrix!.active">
						<td colspan="5">
							<MatrixProgramSlotsView
								:model="device.systemData.matrix!"
								@change="onProgramSlotsUpdated"
							/>
						</td>
					</tr>
				</template>
			</table>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';
</style>
