<script lang="ts" setup>
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

import { rollSkill } from '@/roll/Rollers';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const isGM = game.user.isGM;

const skills = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'skill')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<SkillDataModel>[]
);

function updateSkill(skill: SR6Item<SkillDataModel>) {
	skill.update({ ['system']: skill.systemData });
}

async function roll(skill: SR6Item<SkillDataModel>) {
	await rollSkill(toRaw(context.data.actor), skill.id);
}

function addSkill() {}
function addCoreSkills() {
	toRaw(system.value)._addCoreSkills();
}
</script>

<template>
	<section class="tab-skills">
		<table
			class="field-table"
			style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 30%"
		>
			<thead>
				<tr class="field-table">
					<td>Skill</td>
					<td></td>
					<td></td>
					<td>
						<a v-if="isGM" class="fas fa-plus" @click.prevent="addSkill" /><a
							v-if="isGM && skills.length == 0"
							class="fas fa-infinity"
							@click.prevent="addCoreSkills"
						/>
					</td>
				</tr>
			</thead>
			<tr v-for="skill in skills" :key="skill.id">
				<td style="width: 100%">
					{{ skill.name }}
					<div v-if="skill.systemData.specialization != null">- {{ skill.systemData.specialization }}</div>
					<div v-if="skill.systemData.expertise != null">- {{ skill.systemData.expertise }}</div>
				</td>
				<td>
					<input
						class="field-number"
						type="number"
						v-model="skill.systemData.points"
						@change="updateSkill(skill)"
					/>
				</td>
				<td style="text-align: left">{{ skill.systemData.pool }}</td>
				<td>
					<a @click="roll(skill)" data-die="A"><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a>
				</td>
			</tr>
		</table>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';
</style>
