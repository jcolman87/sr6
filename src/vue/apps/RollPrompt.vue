<script lang="ts" setup>
import { inject } from 'vue';
import { RollPromptContext } from '@/app/RollPrompt';
import { RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';

import { RollType } from '@/roll';
import AttributeRoll from '@/vue/apps/roll/AttributeRoll.vue';

const context = inject<RollPromptContext>(RootContext)!;

let pool_modifier: number = 0;
</script>

<template>
	<div class="sr6 roll-prompt">
		<AttributeRoll ref="inner_roll" v-if="context.rollData.type == RollType.Attribute" :roll="context.rollData" :actor="context.actor as any" />

		<input name="pool_modifier" type="number" v-model="pool_modifier" />
		<!-- Roll Button -->
		<button
			class="finish-roll-button"
			@click.prevent="
				($refs.inner_roll as any).finishRoll(pool_modifier);
				context.app.close();
			"
		>
			<Localized label="SR6.Labels.Roll" />
		</button>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/backgrounds.scss';
@use '@scss/vars/colors.scss';
@use '@scss/vars/sheet.scss';

.app-roll-prompt {
	min-width: 500px;
	min-height: 300px;

	.window-content {
		@include backgrounds.crossboxes();
	}

	.roll-prompt {
		display: grid;
		grid-template-columns: 2fr 1fr 2fr;
		grid-template-rows: /* Header */ auto /* Dice Pool */ 1fr /* Skill & Characteristic */ auto /* Roll Button */ auto;
		gap: 0.5em;

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
	}
}
</style>
