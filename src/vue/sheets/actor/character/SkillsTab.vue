<script lang="ts" setup>
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import SkillDataModel from '@/item/data/SkillDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const skills = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type == 'skill')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<SkillDataModel>[],
);

function updateSkill(skill: SR6Item<SkillDataModel>) {
	skill.update({ ['system']: skill.systemData });
}

function rollSkill(skill: SR6Item<SkillDataModel>) {}
</script>

<template>
	<section class="tab-skills">
		<table class="field-table" style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 30%">
			<thead>
				<tr class="field-table">
					<td>Skill</td>
					<td>Points</td>
					<td></td>
				</tr>
			</thead>
			<tr v-for="skill in skills">
				<td style="width: 100%">{{ skill.name }}</td>
				<td><input class="field-number" type="number" v-model="skill.systemData.points" @change="updateSkill(skill)" /></td>
				<td>
					<a @click="rollSkill(skill)" data-die="A"><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a>
				</td>
			</tr>
		</table>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';
</style>
