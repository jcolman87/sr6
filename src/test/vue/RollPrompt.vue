<script lang="ts" setup>
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { IModifier, TestPoolModifier } from '@/modifier';
import { getEventValue } from '@/vue/directives';
import { inject, toRaw, ref, onMounted, computed } from 'vue';
import { RollPromptContext } from '@/test/RollPrompt';
import { RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';

import { Collapse } from 'vue-collapsed';
import * as images from '@/vue/images';

const context = inject<RollPromptContext>(RootContext)!;
const baseSystem = computed(() => toRaw(context.actor).systemData as BaseActorDataModel);

const text = ref({
	title: 'Roll',
	hint: '',
});
const edgeBoost = ref<string | null>(null);
const poolModifier = ref(0);
const originalPool = context.test.data.pool!;

const finishRollButton = ref();
const isDisplayConditions = ref(false);
const conditionsDescriptionsVisible = ref(
	context.test.modifiers.map((_modifier: IModifier, idx: number) => {
		return {
			id: idx,
			visible: false,
		};
	}),
);

async function roll() {
	// Apply edge action to the roll
	switch (edgeBoost.value) {
		case 'buy_one':
			context.test.data.autoHits = 1;
			break;
		case 'add_edge_pool':
			if (context.test.data.pool) {
				context.test.data.pool += (baseSystem.value as LifeformDataModel).monitors.edge.max;
			} else {
				context.test.data.pool = (baseSystem.value as LifeformDataModel).monitors.edge.max;
			}
			context.test.data.explode = true;
			break;
	}

	context.resolvePromise(toRaw(context.test.data));
}
function setText(value: { title: string; hint: string }) {
	text.value = value;
}

function onUpdatePool() {
	console.log('onUpdatePool1', toRaw(context.test.data));
	context.test.data.pool = originalPool + poolModifier.value;
	console.log('onUpdatePool2', toRaw(context.test.data));
}

function toggleConditions() {
	isDisplayConditions.value = !isDisplayConditions.value;
}
function asModifierString(modifier: number): string {
	return modifier > 0 ? `+${modifier}` : modifier.toString();
}

onMounted(() => {
	setTimeout(() => {
		finishRollButton.value.focus();
	});
});
</script>

<template>
	<table>
		<tr>
			<td>
				<div class="edge-roll" style="flex: 0.48; margin-right: 10px">
					<img
						:src="images.edge"
						style="
							border: 0;
							height: auto;
							width: 48px;
							z-index: 0;
							position: absolute;
							filter: drop-shadow(0 0 4px #000000);
						"
					/>
					<label name="pool" class="edge-value">{{ context.test.data.pool }}</label>
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
	<div v-if="context.test.modifiers.length > 0" class="section" style="width: 100%">
		<div class="section-title" style="width: 100%">
			<a @click.prevent="toggleConditions"
				><i class="fa-solid fa-down-from-line"></i>&nbsp;&nbsp;<Localized label="SR6.RollPrompt.Conditions" />
				({{ context.test.modifiers.length }})</a
			>
		</div>
		<table v-if="isDisplayConditions" style="width: 100%">
			<tr v-for="(modifier, idx) in context.test.modifiers" v-bind:key="idx">
				<table>
					<tr>
						<td style="width: 3em">
							<template v-if="modifier.class == 'TestPoolModifier'">{{
								asModifierString((modifier as TestPoolModifier).value)
							}}</template>
							<template v-else>-</template>
						</td>
						<td>
							<a
								@click="
									conditionsDescriptionsVisible.find((v) => v.id == idx)!.visible =
										!conditionsDescriptionsVisible.find((v) => v.id == idx)!.visible
								"
								>{{ modifier.name }}</a
							>
						</td>
					</tr>
					<tr>
						<td class="hint" colspan="2">
							<Collapse :when="conditionsDescriptionsVisible.find((v) => v.id == idx)!.visible">
								<div v-html="modifier.description"></div>
							</Collapse>
						</td>
					</tr>
				</table>
			</tr>
		</table>
	</div>

	<section class="data-grid">
		<component
			v-if="context.test.promptComponent"
			:is="context.test.promptComponent?.()"
			:test="context.test"
			@setText="setText"
		/>

		<div class="section" style="width: 100%; display: flex; justify-content: space-between">
			<div>
				<label><Localized label="SR6.RollPrompt.PoolModifier" /></label>
				<input name="pool_modifier" type="number" v-model="poolModifier" @change.prevent="onUpdatePool" />
			</div>
			<div>
				<label><Localized label="SR6.RollPrompt.ConsumeAction" /></label>
				<label class="switch">
					<input type="checkbox" checked />
					<span class="slider round"></span>
				</label>
			</div>
		</div>

		<div class="section">
			`
			<label><Localized label="SR6.Edge.EdgeBoost" /></label>
			<select @change="(ev) => (edgeBoost = getEventValue(ev) as string)">
				<option value="null">-</option>
				<!-- TODO  -->
				<!--These are post roll actions
					<option value="add_one">+1 to Roll</option>
					<option value="reroll_one">Reroll 1</option>
					<option value="reroll_fail">Reroll failures</option> -->
				<option value="action">Perform Edge Action</option>
				<option value="buy_one">Buy 1 Hit</option>
				<option value="add_edge_pool">Add Edge + Explode</option>
			</select>
			<label><Localized label="SR6.Edge.EdgeAction" /></label>
			<select :disabled="edgeBoost != 'action'">
				<option>-</option>
				<option>Balls</option>
			</select>
		</div>

		<!-- Roll Button -->
		<div class="row">
			<button ref="finishRollButton" class="dialog-button finish-roll-button" @click.prevent="roll">
				<Localized label="SR6.Labels.Roll" />
			</button>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';
@use '@/scss/sheets';

.app-roll-prompt {
	min-width: 500px;
	min-height: 500px;

	.window-content {
		color: white;
	}

	header {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		grid-column: 1 / span all;
		grid-row: 1 / span 1;

		.hint {
			font-size: 0.8rem;
			color: white;
		}
	}

	header {
		color: colors.$purple;
		font-family: var(--font-header);
		font-size: 2em;
	}

	.finish-roll-button {
		grid-column: 3 / span 1;
		grid-row: 4 / span 1;
		color: colors.$purple;
		font-family: var(--font-header);
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
