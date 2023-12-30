<script lang="ts" setup>
import SR6Effect from '@/effects/SR6Effect';
import { computed, inject, toRaw, ref, onBeforeMount, onBeforeUpdate } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import EffectsView from '@/vue/views/EffectsView.vue';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;

// We have to:
//   1. Use an 'any' typing to skirt around TypeScript's complaints.
//   2. Keep a local ref that gets updated in onBeforeUpdate in order to work around some struggles with Foundry.
const effects = ref<any>([]);
const effectsView = ref();

async function addEffect(category: string) {

	await toRaw(context.sheet.actor).createEmbeddedDocuments('ActiveEffect', [
		{
			label: 'New Effect',
			icon: 'icons/svg/aura.svg',
			disabled: category === 'suppressed',
			duration: category === 'temporary' ? { rounds: 1 } : undefined,
		},
	]);
	updateEffects();
}

function updateEffects() {
	effects.value = [...toRaw(context.sheet.actor).effects];
}

function deleteEffect(effect: SR6Effect) {
	toRaw(effect).delete();
	updateEffects();
}

onBeforeMount(updateEffects);
onBeforeUpdate(updateEffects);
</script>

<template>
	<section class="tab-effects"><EffectsView ref="effectsView" :effects="[...effects]" @add-effect="addEffect" @delete-effect="deleteEffect" /></section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
