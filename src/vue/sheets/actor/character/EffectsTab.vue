<script lang="ts" setup>
import SR6Item from '@/item/SR6Item';
import ConditionDataModel from '@/condition/ConditionDataModel';
import SR6Effect from '@/effects/SR6Effect';
import EffectsView from '@/vue/views/EffectsView.vue';

import { computed, inject, toRaw, ref, onBeforeMount, onBeforeUpdate } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const conditions = computed(
	() => toRaw(context.data.actor).items.filter((i) => i.type === 'condition') as SR6Item<ConditionDataModel>[]
);
// We have to:
//   1. Use an 'any' typing to skirt around TypeScript's complaints.
//   2. Keep a local ref that gets updated in onBeforeUpdate in order to work around some struggles with Foundry.
const effects = ref<SR6Effect[]>([]);
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	effects.value = [...toRaw(context.sheet.actor).allApplicableEffects()] as any;
}

function deleteEffect(effect: SR6Effect) {
	toRaw(effect).delete();
	updateEffects();
}

function deleteCondition(condition: SR6Item<ConditionDataModel>) {
	toRaw(context.data.actor).deleteEmbeddedDocuments('Item', [condition.id]);
}

onBeforeMount(updateEffects);
onBeforeUpdate(updateEffects);
</script>

<template>
	<div class="section" style="width: 100%">
		<div class="section-head">Conditions</div>
		<table>
			<tr v-for="condition in conditions" :key="condition.id">
				<td>
					<a @click.prevent="condition.sheet!.render(true)">{{ condition.name }}</a>
				</td>
				<td>
					<div v-if="context.data.editable" class="buttons">
						<a @click="deleteCondition(condition)"><i class="fas fa-trash"></i></a>
					</div>
				</td>
			</tr>
		</table>
	</div>
	<section v-if="context.user.isGM" class="tab-effects">
		<EffectsView
			ref="effectsView"
			:effects="[...effects as any]"
			@add-effect="addEffect"
			@delete-effect="deleteEffect"
		/>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
