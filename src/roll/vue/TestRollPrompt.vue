<script lang="ts" setup>
import { ActivationPhase } from '@/data';
import { IEdgeBoost } from '@/edge';
import EdgeGainMenu from '@/edge/vue/EdgeGainMenu.vue';
import { IModifier } from '@/modifier';
import EdgeMenu from '@/edge/vue/EdgeMenu.vue';
import { inject, toRaw, ref, onMounted } from 'vue';
import { TestRollPromptContext } from '@/roll/TestRollPrompt';
import { RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';

import { Collapse } from 'vue-collapsed';
import * as images from '@/vue/images';

const context = inject<TestRollPromptContext>(RootContext)!;
const edgeBoost = ref<IEdgeBoost | null>(null);

const text = ref({
	title: 'Roll',
	hint: '',
});

const poolModifier = ref(0);
const originalPool = context.test.data.pool!;
const edgeGainMenu = ref(null);

const finishRollButton = ref();
const isDisplayConditions = ref(false);
const conditionsDescriptionsVisible = ref(
	context.test.activeModifiers.map((_modifier: IModifier, idx: number) => {
		return {
			id: idx,
			visible: false,
		};
	}),
);

async function roll() {
	if (edgeBoost.value) {
		await toRaw(context.test).applyEdgeBoost(toRaw(edgeBoost.value));
	}
	context.resolvePromise(toRaw(context.test.data));
}
function setText(value: { title: string; hint: string }) {
	text.value = value;
}

function onUpdatePool() {
	context.test.data.pool = originalPool + poolModifier.value;
}

onMounted(() => {
	setTimeout(() => {
		finishRollButton.value.focus();
	});
});

async function toggleModifier(status: boolean, idx: number) {
	context.test.allModifiers[idx].disabled = status;
	await context.test.reset();
	edgeGainMenu.value?.reset();
	poolModifier.value = 0;
}
</script>

<template>
	<table>
		<tr class="roll-header">
			<td class="roll-numbers flexrow">
				<div class="edge-roll">
					<img
						:src="images.blank_dice"
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
				<div class="edge-roll">
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
					<label name="pool" class="edge-value">{{ context.test.availableEdge }}</label>
				</div>
			</td>
			<td class="roll-title">
				<header>
					<span>{{ text.title }}</span>
					<span class="hint">{{ text.hint }}</span>
				</header>
			</td>
		</tr>
	</table>
	<div v-if="context.test.allModifiers.length > 0" class="section" style="width: 100%">
		<div class="section-title" style="width: 100%">
			<a @click.prevent="isDisplayConditions = !isDisplayConditions"
				><i class="fa-solid fa-down-from-line"></i>&nbsp;&nbsp;<Localized label="SR6.RollPrompt.Conditions" />
				({{ context.test.activeModifiers.length }})</a
			>
		</div>
		<table v-if="isDisplayConditions" style="width: 100%">
			<tr v-for="({ disabled, modifier }, idx) in context.test.allModifiers" v-bind:key="idx">
				<table :class="disabled ? 'disabled' : ''">
					<tr>
						<td v-if="!disabled">
							<a @click.prevent="toggleModifier(!disabled, idx)"><i class="fa-solid fa-ban"></i></a>
						</td>
						<td v-else>
							<a @click.prevent="toggleModifier(!disabled, idx)"><i class="fa-solid fa-play"></i></a>
						</td>
						<td style="width: 3em">
							{{ modifier.displayValue }}
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
						<td class="hint" colspan="3">
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

		<div class="global-modifiers">
			<div class="section">
				<div class="section-head"><Localized label="SR6.RollPrompt.PoolModifier" /></div>

				<input name="pool_modifier" type="number" v-model="poolModifier" @change.prevent="onUpdatePool" />
			</div>
			<EdgeGainMenu ref="edgeGainMenu" :test="context.test" />
			<div class="section">
				<div class="section-head">
					<label><Localized label="SR6.RollPrompt.ConsumeAction" /></label>
				</div>
				<label class="switch">
					<input type="checkbox" checked />
					<span class="slider round"></span>
				</label>
				<div class="section-head">
					<label><Localized label="SR6.RollPrompt.ConsumeEdge" /></label>
				</div>
				<label class="switch">
					<input type="checkbox" checked />
					<span class="slider round"></span>
				</label>
			</div>
		</div>

		<Suspense>
			<EdgeMenu
				@setEdgeBoost="(boost) => (edgeBoost = boost as unknown as IEdgeBoost)"
				:test="context.test"
				:actor="context.test.actor"
				:phase="ActivationPhase.PreRoll"
				:show="false"
			/>
		</Suspense>

		<!-- Roll Button -->
		<div class="row">
			<div class="section warning-box" v-if="context.test.pool === 0">
				<div class="section-head warning-title">Warning: Pool is Zero</div>
				A zero pool becomes an automatic failure.
			</div>
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

	.disabled {
		font-style: italic;
		background-color: colors.$disabled;
	}

	.global-modifiers {
		@extend .section;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.roll-header {
		background: var(--section-background);

		.roll-numbers {
			white-space: nowrap;
			width: 125px;
		}
		.roll-title {
			text-align: center;
			width: 100%;
		}
	}

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
			text-align: left;
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
}
</style>
