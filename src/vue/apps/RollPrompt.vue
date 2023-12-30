<script lang="ts" setup>
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

const context = inject<RollPromptContext>(RootContext)!;

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

const finishRollButton = ref();
onMounted(() => {
	setTimeout(() => {
		finishRollButton.value.focus();
	});
});

const conditions = computed(() => toRaw(context.actor).systemData.getRollConditions(context.rollData.type));

let isDisplayConditions = ref(false);
function toggleConditions() {
	isDisplayConditions.value = !isDisplayConditions.value;
}
function asModifierString(modifier: number): string {
	return modifier > 0 ? `+${modifier}` : modifier.toString();
}
</script>

<template>
	<div class="sr6 roll-prompt">
		<table>
			<tr>
				<td>
					<div class="edge-roll" style="flex: 0.48; margin-right: 10px">
						<img src="/systems/sr6/assets/blank_dice.png" style="border: 0; height: auto; width: 48px; z-index: 0; position: absolute; filter: drop-shadow(0 0 4px #000000)" />
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
		<div v-if="conditions.length > 0" class="section" @click.prevent="toggleConditions">
			<div class="section-title" style="width: 400px"><Localized label="SR6.RollPrompt.Conditions" /></div>
			<table v-if="isDisplayConditions">
				<tr v-for="condition in conditions">
					<td>{{ condition.name }}</td>
					<td>{{ asModifierString(condition.getPoolModifier(context.rollData.type)) }}</td>
				</tr>
			</table>
		</div>

		<section class="data-grid">
			<AttributeRoll ref="inner_roll" v-if="context.rollData.type == RollType.Attribute" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />
			<SkillRoll ref="inner_roll" v-else-if="context.rollData.type == RollType.Skill" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />

			<WeaponAttackRoll ref="inner_roll" v-else-if="context.rollData.type == RollType.WeaponAttack" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />
			<WeaponDefendRoll ref="inner_roll" v-else-if="context.rollData.type == RollType.WeaponDefend" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />
			<WeaponSoakRoll ref="inner_roll" v-else-if="context.rollData.type == RollType.WeaponSoak" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />

			<MatrixActionRoll ref="inner_roll" v-else-if="context.rollData.type == RollType.MatrixAction" :roll="context.rollData" :actor="context.actor as any" @setText="setText" />

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
