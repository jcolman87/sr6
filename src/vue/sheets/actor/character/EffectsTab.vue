<script lang="ts" setup>
import SR6Effect from '@/effect/SR6Effect';
import EffectsView from '@/vue/views/EffectsView.vue';
import ModifiersView from '@/vue/views/ModifiersView.vue';

import { inject, toRaw, ref, onBeforeMount, onBeforeUpdate, onUpdated } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;

// We have to:
//   1. Use an 'any' typing to skirt around TypeScript's complaints.
//   2. Keep a local ref that gets updated in onBeforeUpdate in order to work around some struggles with Foundry.
const effects = ref<SR6Effect[]>([]);
const effectsView = ref<typeof EffectsView>();
const componentKey = ref(0);

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

function updateEffects(): void {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	effects.value = [...toRaw(context.sheet.actor).allApplicableEffects()] as any;
}

async function deleteEffect(effect: SR6Effect): Promise<void> {
	await toRaw(effect).delete();
	updateEffects();
}

onBeforeMount(updateEffects);
onBeforeUpdate(updateEffects);
onUpdated(() => (componentKey.value += 1));
</script>

<template>
	<section v-if="context.user.isGM" class="tab-effects">
		<section class="section-modifiers">
			<ModifiersView :modifiers="context.data.actor.modifiers.all" />
		</section>
		<section v-if="context.user.isGM" class="section-effects">
			<EffectsView
				ref="effectsView"
				:key="componentKey"
				:effects="[...(effects as any)]"
				@add-effect="addEffect"
				@delete-effect="deleteEffect"
			/>
		</section>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
