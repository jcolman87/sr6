<script lang="ts" setup>
import { SR6Roll } from '@/roll/SR6Roll';
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import * as rollers from '@/roll/Rollers';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const matrix_actions = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'matrix_action')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<MatrixActionDataModel>[]
);

async function rollMatrixAction(action: SR6Item<MatrixActionDataModel>) {
	await rollers.rollMatrixAction(toRaw(context.data.actor).systemData, toRaw(action));
}

function addMatrixAction() {}

function addCoreActions() {
	toRaw(system.value)._addCoreMatrixActions();
}
</script>

<template>
	<section class="tab-matrix">
		<table
			class="field-table"
			style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 30%"
		>
			<thead>
				<tr class="field-table">
					<td>Skill</td>
					<td>Pool</td>
					<td>
						<a v-if="context.user.isGM" class="fas fa-plus" @click.prevent="addMatrixAction" /><a
							v-if="context.user.isGM && matrix_actions.length == 0"
							class="fas fa-infinity"
							@click.prevent="addCoreActions"
						/>
					</td>
				</tr>
			</thead>
			<tr v-for="action in matrix_actions" :key="action.id" :title="action.systemData.description">
				<td style="width: 100%">{{ action.name }}</td>
				<td>{{ action.systemData.pool }}</td>
				<td>
					<a @click="rollMatrixAction(action)" data-die="A"
						><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
					>
				</td>
			</tr>
		</table>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';
</style>
