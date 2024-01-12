<script lang="ts" setup>
import { EnumAttribute } from '@/actor/data';
import QualityDataModel from '@/item/data/feature/QualityDataModel';
import CredstickDataModel, { CredstickCapacity, CredstickRating } from '@/item/data/gear/CredstickDataModel';
import SR6Item from '@/item/SR6Item';
import Localized from '@/vue/components/Localized.vue';
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import AttributesView from '@/vue/sheets/actor/character/AttributesView.vue';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { createNewItem, deleteItem, updateItem } from '@/vue/directives';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = context.data.actor.systemData;

const credsticks = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'credstick')
		.map((i) => i as SR6Item<CredstickDataModel>)
);
const qualities = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'quality')
		.map((i) => i as SR6Item<QualityDataModel>)
);
const augmentations = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'augmentation')
		.map((i) => i as SR6Item<QualityDataModel>)
);
</script>

<template>
	<section class="tab-basics">
		<AttributesView />

		<div class="flexrow" style="width: 100%">
			<div class="section" style="width: 30%">
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
					<tr v-for="item in qualities" :key="item.id" :title="item.systemData.description">
						<td class="entry">
							<input
								type="text"
								:value="item.name"
								@change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)"
							/>
						</td>
						<td class="actions">
							<a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a
								class="fas fa-minus"
								@click.prevent="deleteItem(item)"
							/>
						</td>
					</tr>
				</table>
			</div>
			<div style="width: 40%">
				<div class="section" style="width: 100%">
					<div class="section-head">
						<h2 class="section-title"><Localized :label="`SR6.Items.Credstick.Plural`" /></h2>
						<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'credstick')" />
					</div>
					<table>
						<thead>
							<tr>
								<td>Rating</td>
								<td>Value</td>
								<td></td>
							</tr>
						</thead>
						<tr v-for="item in credsticks" :key="item.id" :title="item.systemData.description">
							<td class="entry">
								<Localized
									:label="`SR6.Items.Credstick.Ratings.${CredstickRating[item.systemData.rating]}`"
								/>
							</td>
							<td class="entry" style="white-space: nowrap">
								<input
									type="number"
									:value="item.systemData.nuyen"
									@change="(ev) => updateItem(context.data.actor, item.id, 'system.nuyen', ev)"
									style="width: 4em"
								/>
								/ {{ item.systemData.capacity }}
							</td>
							<td class="actions">
								<a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a
									class="fas fa-minus"
									@click.prevent="deleteItem(item)"
								/>
							</td>
						</tr>
					</table>
				</div>
				<div class="section" style="width: 100%">
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
						<tr v-for="item in augmentations" :key="item.id" :title="item.systemData.description">
							<td class="entry">
								<input
									type="text"
									:value="item.name"
									@change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)"
								/>
							</td>
							<td class="actions">
								<a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a
									class="fas fa-minus"
									@click.prevent="deleteItem(item)"
								/>
							</td>
						</tr>
					</table>
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
}
</style>
