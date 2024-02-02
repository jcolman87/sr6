<script lang="ts" setup>
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import SkillUseDataModel from '@/data/SkillUseDataModel';
import KnowledgeDataModel from '@/item/data/feature/KnowledgeDataModel';
import SkillDataModel, { SkillCategory } from '@/item/data/feature/SkillDataModel';

import SR6Item from '@/item/SR6Item';
import SkillTest from '@/test/SkillTest';
import { getEventValue, updateItem } from '@/vue/directives';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { computed, inject, ref, toRaw } from 'vue';

import { Collapse } from 'vue-collapsed';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const isGM = game.user.isGM;

const skills = ref(
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

const knowledges = ref(
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'knowledge')
		.map((i) => i as SR6Item<KnowledgeDataModel>)
		.filter((i) => i.systemData.category == 'knowledge')
		.sort((a, b) => a.name.localeCompare(b.name)),
);
const languages = ref(
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'knowledge')
		.map((i) => i as SR6Item<KnowledgeDataModel>)
		.filter((i) => i.systemData.category == 'language')
		.sort((a, b) => a.name.localeCompare(b.name)),
);

async function updateSkill(skill: SR6Item<SkillDataModel | KnowledgeDataModel>) {
	await skill.update({ ['system']: skill.systemData });
}

async function roll(skill: SR6Item<SkillDataModel | KnowledgeDataModel>, specialization: null | string = null) {
	const skillUse = new SkillUseDataModel(
		{ skill: skill.name, specialization, attribute: skill.systemData.attribute },
		{ parent: toRaw(context.data.actor) },
	);
	console.log('rolling with', skillUse);
	await new SkillTest({ actor: toRaw(context.data.actor), data: { skillUse } }).execute();
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
	<section class="flexrow tab-skills">
		<div class="skills">
			<div class="section-head">Skills</div>
			<table class="field-table skills-table">
				<thead>
					<tr class="field-table">
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
		</div>
		<div>
			<div class="knowledge">
				<div class="section-head">Knowledge</div>
				<table class="field-table">
					<thead>
						<tr>
							<td>Name</td>
							<td></td>
						</tr>
					</thead>
					<tr v-for="skill in knowledges">
						<td>
							<input
								type="text"
								:value="skill.name"
								@change="(ev) => updateItem(context.data.actor, skill.id, 'name', ev)"
							/>
						</td>
						<td>
							<input
								class="field-number"
								type="number"
								v-model="skill.systemData.points"
								@change="updateSkill(skill)"
							/>
						</td>
						<td>
							<a @click="roll(skill)" data-die="A"><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a>
						</td>
					</tr>
				</table>
			</div>
			<div>
				<div class="languages">
					<div class="section-head">Languages</div>
					<table class="field-table">
						<thead>
							<tr>
								<td>Name</td>
								<td></td>
							</tr>
						</thead>
						<tr v-for="skill in languages">
							<td>
								<input
									type="text"
									:value="skill.name"
									@change="(ev) => updateItem(context.data.actor, skill.id, 'name', ev)"
								/>
							</td>
							<td>
								<input
									class="field-number"
									type="number"
									v-model="skill.systemData.points"
									@change="updateSkill(skill)"
								/>
							</td>
							<td>
								<a @click="roll(skill)" data-die="A"
									><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
								>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets.scss';

.tab-skills {
	.skills {
		@extend .section;
		width: 30%;

		.skills-table {
			align-self: start;
			border-collapse: collapse;
			margin: 0;
			padding: 0;

			.skill-details {
				font-size: 12px;
				white-space: nowrap;

				select {
					width: 90%;
				}
			}
		}
	}

	.knowledge {
		@extend .section;
		width: 97%;
	}
	.languages {
		@extend .knowledge;
	}
}
</style>
