<script lang="ts" setup>
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import { inject, toRaw, ref, onMounted, computed } from 'vue';
import { RollPromptContext } from '@/app/RollPrompt';
import { RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';

import { RollType } from '@/roll';

import AttributeRoll from '@/vue/apps/roll/AttributeRoll.vue';
import SkillRoll from '@/vue/apps/roll/SkillRoll.vue';

import WeaponAttackRoll from '@/vue/apps/roll/WeaponAttackRoll.vue';
import WeaponDefendRoll from '@/vue/apps/roll/WeaponDefendRoll.vue';
import WeaponSoakRoll from '@/vue/apps/roll/WeaponSoakRoll.vue';

import MatrixActionRoll from '@/vue/apps/roll/MatrixActionRoll.vue';

import SpellCastRoll from '@/vue/apps/roll/SpellCastRoll.vue';
import { Collapse } from 'vue-collapsed';

const context = inject<RollPromptContext>(RootContext)!;
const baseSystem = computed(() => toRaw(context.actor).systemData as BaseActorDataModel);

let pool_modifier = ref(0);
let original_pool = context.rollData.pool;

function roll() {
	context.resolvePromise(toRaw(context.rollData));
}

let text = ref({
	title: 'Roll',
	hint: '',
});
function setText(value: { title: string; hint: string }) {
	text.value = value;
}

function onUpdatePool() {
	context.rollData.pool = original_pool + pool_modifier.value;
}

function onChangeEdgeBoost(ev: Event) {
	// Reset first
}

const woundModifiers = computed(() => Object.entries(toRaw(context.actor.systemData).woundModifiers));
const conditions = computed(() => baseSystem.value.getRollConditions(context.rollData.type));

const totalModifier = computed(
	() =>
		baseSystem.value
			.getRollConditions(context.rollData.type)
			.reduce((total, condition) => (total += condition.getPoolModifier(context.rollData.type)), 0) +
		toRaw(context.actor).systemData.woundModifier
);

let isDisplayConditions = ref(false);

const conditionsDescriptionsVisible = ref(
	conditions.value
		.map((condition) => {
			return {
				id: condition.name,
				visible: false,
			};
		})
		.concat(
			woundModifiers.value.map(([key, value]) => {
				return {
					id: key,
					visible: false,
				};
			})
		)
);

function toggleConditions() {
	isDisplayConditions.value = !isDisplayConditions.value;
}
function asModifierString(modifier: number): string {
	return modifier > 0 ? `+${modifier}` : modifier.toString();
}

const finishRollButton = ref();
onMounted(() => {
	setTimeout(() => {
		finishRollButton.value.focus();
	});
});
</script>

<template>
	<div class="sr6 roll-prompt">
		<table>
			<tr>
				<td>
					<div class="edge-roll" style="flex: 0.48; margin-right: 10px">
						<img
							src="/systems/sr6/assets/blank_dice.webp"
							style="
								border: 0;
								height: auto;
								width: 48px;
								z-index: 0;
								position: absolute;
								filter: drop-shadow(0 0 4px #000000);
							"
						/>
						<label name="pool" class="edge-value">{{ context.rollData.pool }}</label>
					</div>
				</td>
				<td>
					<header>
						<span>{{ text.title }}</span>
						<span class="hint">{{ text.hint }}</span>
					</header>
				</td>
			</tr>
		</table>
		<div v-if="conditions.length > 0 || woundModifiers.length > 0" class="section" style="width: 100%">
			<div class="section-title" style="width: 100%">
				<a @click.prevent="toggleConditions"
					><i class="fa-solid fa-down-from-line"></i>&nbsp;&nbsp;<Localized
						label="SR6.RollPrompt.Conditions"
					/>
					({{ totalModifier }})</a
				>
			</div>
			<table v-if="isDisplayConditions" style="width: 100%">
				<tr v-for="[key, value] in woundModifiers" v-bind:key="key">
					<table v-if="value != 0">
						<tr>
							<td style="width: 3em">{{ asModifierString(value) }}</td>
							<td>
								<a
									@click="
										conditionsDescriptionsVisible.find((v) => v.id == key)!.visible =
											!conditionsDescriptionsVisible.find((v) => v.id == key)!.visible
									"
									><i class="fa-solid fa-down-from-line"></i>&nbsp;&nbsp;<Localized
										:label="`SR6.RollPrompt.WoundModifiers.${key}.Name`"
								/></a>
							</td>
						</tr>
						<tr>
							<td class="hint" colspan="2">
								<Collapse :when="conditionsDescriptionsVisible.find((v) => v.id == key)!.visible">
									<Localized :label="`SR6.RollPrompt.WoundModifiers.${key}.Description`" />
								</Collapse>
							</td>
						</tr>
					</table>
				</tr>
				<tr v-for="condition in conditions" :key="condition.name">
					<table>
						<tr>
							<td style="width: 3em">
								{{ asModifierString(condition.getPoolModifier(context.rollData.type)) }}
							</td>
							<td>
								<a
									@click="
										conditionsDescriptionsVisible.find((v) => v.id == condition.name)!.visible =
											!conditionsDescriptionsVisible.find((v) => v.id == condition.name)!.visible
									"
									><i class="fa-solid fa-down-from-line"></i>&nbsp;&nbsp;{{ condition.name }}</a
								>
							</td>
						</tr>
						<tr>
							<td class="hint" colspan="2">
								<Collapse
									:when="conditionsDescriptionsVisible.find((v) => v.id == condition.name)!.visible"
								>
									{{ condition.description }}</Collapse
								>
							</td>
						</tr>
					</table>
				</tr>
			</table>
		</div>

		<section class="data-grid">
			<AttributeRoll
				ref="inner_roll"
				v-if="context.rollData.type == RollType.Attribute"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>
			<SkillRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.Skill"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>

			<WeaponAttackRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.WeaponAttack"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>
			<WeaponDefendRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.WeaponDefend"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>
			<WeaponSoakRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.WeaponSoak"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>

			<MatrixActionRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.MatrixAction"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>

			<SpellCastRoll
				ref="inner_roll"
				v-else-if="context.rollData.type == RollType.SpellCast"
				:roll="context.rollData"
				:actor="context.actor as any"
				@setText="setText"
			/>

			<div class="section">
				<label><Localized label="SR6.RollPrompt.PoolModifier" /></label>
				<input name="pool_modifier" type="number" v-model="pool_modifier" @change.prevent="onUpdatePool" />
			</div>

			<div class="section">
				<label><Localized label="SR6.Edge.EdgeBoost" /></label>
				<select @change.prevent="onChangeEdgeBoost">
					<option>-</option>
					<option value="action">Perform Edge Action</option>
					<option value="add_one">+1 to Roll</option>
					<option value="reroll_one">Reroll 1</option>
					<option value="buy_one">Buy 1 Hit</option>
					<option value="add_edge_pool">Add Edge + Explode</option>
					<option value="reroll_fail">Reroll failures</option>
				</select>
				<label><Localized label="SR6.Edge.EdgeAction" /></label>
				<select>
					<option>-</option>
					<option>Balls</option>
				</select>
			</div>

			<!-- Roll Button -->
			<div class="row">
				<button ref="finishRollButton" class="finish-roll-button" @click.prevent="roll">
					<Localized label="SR6.Labels.Roll" />
				</button>
			</div>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/backgrounds.scss';
@use '@scss/vars/colors.scss';
@use '@scss/vars/sheet.scss';

.app-roll-prompt {
	min-width: 500px;
	min-height: 500px;

	.window-content {
		@include backgrounds.crossboxes();
	}
}

.roll-prompt {
	header {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		grid-column: 1 / span all;
		grid-row: 1 / span 1;

		.hint {
			font-family: 'Roboto', serif;
			font-size: 0.8rem;
			color: colors.$dark-blue;
		}
	}

	header {
		color: colors.$blue;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2em;
	}

	.finish-roll-button {
		grid-column: 3 / span 1;
		grid-row: 4 / span 1;
		color: colors.$blue;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.25em;
	}

	.edge-roll {
		width: 48px;
		height: 48px;
		display: flex;
		flex-flow: column nowrap;
		justify-items: flex-start;
		position: relative;
		flex: 0.48;
		margin-right: 10px;
	}
	.edge-roll .edge-value {
		z-index: 1;
		position: relative;
		width: 48px;
		top: 10px;
		text-align: center;
		font-size: large;
		color: white;
		font-weight: bold;
	}
	.edge-roll input {
		background-color: transparent;
		width: 2em;
		color: white;
		border: 0;
		outline: 0;
	}
}
</style>
