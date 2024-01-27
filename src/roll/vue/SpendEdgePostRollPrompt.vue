<script lang="ts" setup>
import { ActivationPhase } from '@/data';
import { IEdgeBoost } from '@/edge';
import { SpendEdgePostRollPromptContext } from '@/roll/SpendEdgePostRollPrompt';
import EdgeMenu from '@/roll/vue/EdgeMenu.vue';
import Localized from '@/vue/components/Localized.vue';
import { RootContext } from '@/vue/SheetContext';
import { inject, ref, toRaw } from 'vue';

const context = inject<SpendEdgePostRollPromptContext>(RootContext)!;
const edgeBoost = ref<IEdgeBoost | null>(null);

async function roll() {
	context.resolvePromise(toRaw(edgeBoost.value));
}
</script>

<template>
	<EdgeMenu
		@setEdgeBoost="(boost) => (edgeBoost = boost as unknown as IEdgeBoost)"
		:actor="context.actor"
		:phase="ActivationPhase.PostRoll"
	/>

	<div class="flexcol">
		<!-- Roll Button -->
		<div class="row">
			<button ref="finishRollButton" class="dialog-button finish-roll-button" @click.prevent="roll">
				Spend Edge
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';
@use '@/scss/sheets';

.spend-edge-prompt {
	min-width: 500px;
	min-height: 500px;

	.window-content {
		color: white;
	}

	.finish-roll-button {
		grid-column: 3 / span 1;
		grid-row: 4 / span 1;
		color: colors.$purple;
		font-family: var(--font-header);
		font-size: 1.25em;
	}
}
</style>
