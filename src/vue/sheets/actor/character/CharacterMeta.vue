<script lang="ts" setup>
import { inject,  toRaw, computed } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { vLocalize } from '@/vue/directives';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';
import CharacterSheet from '@/actor/sheets/CharacterSheet';

//import ContextMenu from '@/vue/components/ContextMenu.vue';
//import MenuItem from '@/vue/components/MenuItem.vue';

const context = inject<ActorSheetContext<CharacterDataModel, CharacterSheet>>(RootContext)!;
const system = computed(() => toRaw(context.data.actor).systemData);

</script>

<template>
	<header class="character-meta">
		<div class="data">
			<div class="title"><Localized label="ACTOR.TypeCharacter" /></div>

			<label><Localized label="SR6.Labels.CharacterName" /></label>
			<input type="text" name="name" :value="context.data.actor.name" v-localize:placeholder="'SR6.Labels.CharacterName'" />
			<div class="underline"></div>

			asdf
			<div class="underline"></div>
		</div>

		<img :src="context.data.actor.img" data-edit="img" :alt="context.data.actor.name" />
	</header>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/reset.scss';
@use '@scss/vars/colors.scss';

// Container for the character's meta information; name, archetype, career, etc. as well as the Actor's image
.character-meta {
	display: grid;
	grid-template-columns: 1fr min(110px, 20%);
	gap: 1rem;
	margin-bottom: 0.5em;

	@include reset.input;

	// Actor's image
	img {
		border: 1px solid colors.$gold;
		background: transparentize(colors.$gold, 0.5);
		border-radius: 1em;
	}

	// Container for the input fields to actually handle inputting character data.
	.data {
		// Pull the data container to be flush with the top, matching the official sheet.
		margin-top: -8px;
		$padding: 8px;
		padding: $padding;

		// Ensure the input fields are evenly aligned.
		display: grid;
		grid-template-columns: auto 1fr;
		grid-auto-rows: auto 1.5em;
		column-gap: 1em;
		align-items: center;

		// Style-match the original sheet's meta box.
		background: transparentize(colors.$light-blue, 0.8);
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;

		label,
		.title {
			font-family: 'Bebas Neue', sans-serif;
		}

		.title {
			grid-column: 1 / span 2;
			color: #6d6e7a;
			text-transform: uppercase;
		}

		// An empty div that provides an underline effect for each row.
		// Allows us to have the benefits of both the alignment from display: grid and underlining we could get by containing each row in its own div.
		.underline {
			grid-column: 1 / span 2;
			border-top: 1px solid black;

			// Style-match the originals; pull the underline to the left side of the box and ensure it fills to the right side.
			margin-left: -1 * $padding;
			width: calc(100% + ($padding * 2));
		}

		// All non-label elements should appear in the second column; expect them to be input fields.
		* {
			grid-column: 2 / span 1;
		}

		// Labels should only be used as the row label.
		label {
			grid-column: 1 / span 1;
		}
	}
}
</style>
