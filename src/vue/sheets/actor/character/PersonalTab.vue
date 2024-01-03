<script lang="ts" setup>
import { computed, inject, toRaw, ref } from 'vue';

import SR6Item from '@/item/SR6Item';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import { createNewItem, updateItem } from '@/vue/directives';
import LifestyleDataModel from '@/item/data/feature/LifestyleDataModel';
import ContactDataModel from '@/item/data/feature/ContactDataModel';
import SINDataModel from '@/item/data/feature/SINDataModel';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;

const system = computed(() => context.data.actor.systemData);
const lifestyles = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'lifestyle')
		.map((i) => i as SR6Item<LifestyleDataModel>),
);
const sins = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'sin')
		.map((i) => i as SR6Item<SINDataModel>),
);
const contacts = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'contact')
		.map((i) => i as SR6Item<ContactDataModel>),
);
</script>

<template>
	<div class="tab-magic">
		<div class="section" style="width: 58%">
			<div class="section-head">
				<h2 class="section-title">Lifestyles</h2>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'lifestyle')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Lifestyle</td>
						<td>SIN</td>
						<td></td>
					</tr>
				</thead>
				<tr v-for="item in lifestyles" :key="item.id">
					<td class="entry">
						<input type="text" :value="item.name" @change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)" />
					</td>
					<td>
						<select width="50px" :value="item.systemData.sin" @change="(ev) => updateItem(context.data.actor, item.id, 'system.sin', ev)">
							<option value="">-</option>
							<option v-for="sin in sins" :key="sin.id" :value="sin.id">{{ sin.name }}</option>
						</select>
					</td>
					<td class="actions"><a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a class="fas fa-minus" @click.prevent="item.delete()" /></td>
				</tr>
			</table>
		</div>
		<div class="section" style="width: 30%">
			<div class="section-head">
				<h2 class="section-title">SIN</h2>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'sin')" />
			</div>
			<table>
				<tr v-for="item in sins" :key="item.id">
					<td class="entry">
						<input type="text" :value="item.name" @change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)" />
					</td>
					<td class="actions"><a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a class="fas fa-minus" @click.prevent="item.delete()" /></td>
				</tr>
			</table>
		</div>
		<div class="section" style="width: 31%">
			<div class="section-head">
				<h2 class="section-title">Contacts</h2>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'contact')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Contact</td>
						<td>Rating</td>
						<td>Loyalty</td>
						<td></td>
					</tr>
				</thead>
				<tr v-for="item in contacts" :key="item.id">
					<td class="entry"><input type="text" :value="item.name" @change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)" /></td>
					<td><input type="number" :value="item.system.rating" @change="(ev) => updateItem(context.data.actor, item.id, 'system.rating', ev)" /></td>
					<td><input type="number" :value="item.system.loyalty" @change="(ev) => updateItem(context.data.actor, item.id, 'system.loyalty', ev)" /></td>
					<td class="actions"><a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a class="fas fa-minus" @click.prevent="item.delete()" /></td>
				</tr>
			</table>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';

.tab-magic {
}
</style>
