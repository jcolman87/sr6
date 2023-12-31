<script lang="ts" setup>
import LifestyleDataModel from '@/item/data/feature/LifestyleDataModel';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import SR6Item from '@/item/SR6Item';
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import AttributesView from '@/vue/sheets/actor/character/AttributesView.vue';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { createNewItem, updateItem } from '@/vue/directives';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = context.data.actor.systemData;

const qualities = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type == 'quality')
		.map((i) => i as SR6Item<QualityDataModel>),
);
const augmentations = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type == 'augmentation')
		.map((i) => i as SR6Item<QualityDataModel>),
);
</script>

<template>
	<section class="tab-basics">
		<AttributesView />

		<div class="section" style="width: 58%">
			<div class="section-head">
				<h2 class="section-title">Qualities</h2>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'quality')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Qualities</td>
						<td></td>
					</tr>
				</thead>
				<tr v-for="item in qualities">
					<td class="entry">
						<input type="text" :value="item.name" @change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)" />
					</td>
					<td class="actions"><a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a class="fas fa-minus" @click.prevent="item.delete()" /></td>
				</tr>
			</table>
		</div>

		<div class="section" style="width: 58%">
			<div class="section-head">
				<h2 class="section-title">Augmentations</h2>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'augmentation')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Augmentations</td>
						<td></td>
					</tr>
				</thead>
				<tr v-for="item in augmentations">
					<td class="entry">
						<input type="text" :value="item.name" @change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)" />
					</td>
					<td class="actions"><a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a class="fas fa-minus" @click.prevent="item.delete()" /></td>
				</tr>
			</table>
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
}
</style>
