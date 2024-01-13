<script lang="ts" setup>
import { getEventValue } from '@/vue/directives';
import { computed, inject, ref, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

import { rollSkill } from '@/roll/Rollers';
import { Collapse } from 'vue-collapsed';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const isGM = game.user.isGM;

const skills = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'skill')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<SkillDataModel>[],
);

const skillsVisible = ref(
	skills.value.map((skill) => {
		return {
			id: skill.id,
			visible: skill.systemData.specialization !== null,
		};
	}),
);
const isMaximized = ref(false);

async function updateSkill(skill: SR6Item<SkillDataModel>) {
	await skill.update({ ['system']: skill.systemData });
}

async function roll(skill: SR6Item<SkillDataModel>, special: null | string = null) {
	await rollSkill(toRaw(context.data.actor), skill.id, special);
}

function addSkill() {}
async function addCoreSkills() {
	await toRaw(system.value)._addCoreSkills();
}

async function selectSkillSpecialization(ev: Event, skill: SR6Item<SkillDataModel>) {
	skill.systemData.specialization = getEventValue(ev) as string;
	await updateSkill(skill);
}
async function selectSkillExpertise(ev: Event, skill: SR6Item<SkillDataModel>) {
	skill.systemData.expertise = getEventValue(ev) as string;
	await updateSkill(skill);
}

function maximize() {
	isMaximized.value = !isMaximized.value;
	skillsVisible.value.forEach((e) => (e.visible = isMaximized.value));
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
					<td colspan="3" style="text-align: right; margin-left: auto; margin-right: 0">
						<a v-if="isGM" class="fas fa-plus" @click.prevent="addSkill" /><a
							v-if="isGM && skills.length == 0"
							class="fas fa-infinity"
							@click.prevent="addCoreSkills"
						/>
						<a class="fa-solid fa-maximize" @click="maximize"></a>
					</td>
				</tr>
			</thead>
			<template v-for="skill in skills" :key="skill.id">
				<tr>
					<td style="width: 100%">
						<a
							@click="
								skillsVisible.find((v) => v.id == skill.id)!.visible = !skillsVisible.find(
									(v) => v.id == skill.id,
								)!.visible
							"
							><i class="fa-solid fa-down-from-line"></i> {{ skill.name }}</a
						>
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
				<tr class="skill-details">
					<td style="padding-left: 15px">
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">
							<i class="fa-solid fa-arrow-right"></i>
							<select
								:value="skill.systemData.specialization"
								@change.prevent="(ev) => selectSkillSpecialization(ev, skill)"
							>
								<option value="" :selected="!skill.systemData.specialization">-</option>
								<option v-for="special in skill.systemData.specializations" v-bind:key="special">
									{{ special }}
								</option>
							</select>
						</Collapse>
					</td>
					<td>
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">
							<input
								class="field-number"
								type="number"
								:value="skill.systemData.getPoints(skill.systemData.specialization)"
								disabled
							/>
						</Collapse>
					</td>
					<td style="text-align: left">
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">{{
							skill.systemData.getPool(skill.systemData.specialization)
						}}</Collapse>
					</td>
					<td>
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible"
							><a @click="roll(skill, skill.systemData.specialization)" data-die="A"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							></Collapse
						>
					</td>
				</tr>
				<tr class="skill-details">
					<td style="padding-left: 15px">
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">
							<i class="fa-solid fa-arrow-right"></i>
							<select
								:value="skill.systemData.expertise"
								@change.prevent="(ev) => selectSkillExpertise(ev, skill)"
								:disabled="skill.systemData.specialization == null"
							>
								<option value="" :selected="!skill.systemData.expertise">-</option>
								<option
									v-for="special in skill.systemData.specializations"
									v-bind:key="special"
									:disabled="special === skill.systemData.specialization"
								>
									{{ special }}
								</option>
							</select>
						</Collapse>
					</td>
					<td>
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">
							<input
								class="field-number"
								type="number"
								:value="skill.systemData.getPoints(skill.systemData.expertise)"
								disabled
							/>
						</Collapse>
					</td>
					<td style="text-align: left">
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible">{{
							skill.systemData.getPool(skill.systemData.expertise)
						}}</Collapse>
					</td>
					<td>
						<Collapse :when="skillsVisible.find((v) => v.id == skill.id)!.visible"
							><a @click="roll(skill, skill.systemData.expertise)" data-die="A"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							></Collapse
						>
					</td>
				</tr>
			</template>
		</table>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';

.tab-skills {
	.skill-details {
		font-size: 12px;
		white-space: nowrap;
		select {
			width: 90%;
		}
	}
}
</style>
