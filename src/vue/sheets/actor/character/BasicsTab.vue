<script lang="ts" setup>
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

</script>

<template>
	<section class="tab-basics">
		<div class="attributes">
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Body</p>
				<span>{{ system.attributes.body.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.body.base" :value="system.attributes.body.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.body.mod" :value="system.attributes.body.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Agility</p>
				<span>{{ system.attributes.agility.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.agility.base" :value="system.attributes.agility.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.agility.mod" :value="system.attributes.agility.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Reaction</p>
				<span>{{ system.attributes.reaction.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.reaction.base" :value="system.attributes.reaction.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.reaction.mod" :value="system.attributes.reaction.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Strength</p>
				<span>{{ system.attributes.strength.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.strength.base" :value="system.attributes.strength.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.strength.mod" :value="system.attributes.strength.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Willpower</p>
				<span>{{ system.attributes.willpower.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.willpower.base" :value="system.attributes.willpower.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.willpower.mod" :value="system.attributes.willpower.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Logic</p>
				<span>{{ system.attributes.logic.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.logic.base" :value="system.attributes.logic.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.logic.mod" :value="system.attributes.logic.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Intuition</p>
				<span>{{ system.attributes.intuition.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.intuition.base" :value="system.attributes.intuition.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.intuition.mod" :value="system.attributes.intuition.mod" />
				</div>
			</div>
			<div class="attribute" augmented-ui="b-clip-x exe">
				<p>Charisma</p>
				<span>{{ system.attributes.charisma.value }}</span>
				<div class="field">
					<label>Base</label>
					<input type="number" name="system.attributes.charisma.base" :value="system.attributes.charisma.base" />
				</div>
				<div class="field">
					<label>Mod</label>
					<input type="number" name="system.attributes.charisma.mod" :value="system.attributes.charisma.mod" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';

.tab-basics {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	gap: 0.5em;
	padding: 0.5em;

	// Attributes layout copied from shadowrun6
	.attributes {
		height: 4.75rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: stretch;

	}
	.attributes .attribute {
		min-width: 5.25rem;
		text-align: center;
		padding: .25rem;
		display: flex;
		flex-flow: column nowrap;
		justify-items: flex-start;
		--aug-border: 1px;
		--aug-inset: 2px;
		--aug-border-bg: rgb(82, 81, 78);
		--aug-inset-bg: rgba(255, 255, 255, 0);
		--aug-b-width: 33%;
		--aug-b-height: 10px;
		position: relative;
		background-color: var(--section-background);
	}
	.attributes .attribute p {
		text-align: center;
		margin: 0; }
	.attributes .attribute span {
		font-size: 1.125rem;
		margin-top: .25rem;
		color: var(--highlight-color);
	}
	.attributes .attribute .field {
		display: flex;
		flex-flow: column nowrap; }
	.attributes .attribute input::placeholder,
	.attributes .attribute label {
		font-size: .75rem;
	}
	.attributes .attribute .field:nth-of-type(1) {
		font-size: .89rem;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 2em;
	}
	.attributes .attribute .field:nth-of-type(2) {
		font-size: .89rem;
		position: absolute;
		bottom: 0;
		right: 0;
		width: 2em;
	}
}

</style>
