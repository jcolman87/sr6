<script lang="ts" setup>
import SpellDataModel from '@/item/data/SpellDataModel';
import { SR6Roll } from '@/roll/SR6Roll';
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const skills = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'spell')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<SpellDataModel>[],
);

async function rollSpell(action: SR6Item<SpellDataModel>) {}
</script>

<template>
	<section class="tab-skills">
		<table class="field-table" style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 30%">
			<thead>
				<tr class="field-table">
					<td colspan="3">Spells</td>
				</tr>
			</thead>
			<tr v-for="skill in skills" :key="skill.id">
				<td style="width: 100%">{{ skill.name }}</td>
				<td>
					<a @click="rollSpell(skill)" data-die="A"><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a>
				</td>
			</tr>
		</table>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';
</style>
