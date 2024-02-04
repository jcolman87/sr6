<script lang="ts" setup>
import { createNewItem } from '@/vue/directives';
import { computed, inject, toRaw, ref } from 'vue';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const _system = computed(() => context.data.actor.systemData);

const weapons = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'weapon')
		.map((i) => i as SR6Item<WeaponDataModel>)
		.filter((i) => !i.systemData.isProxy),
);

const gear = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'gear')
		.map((i) => i as SR6Item<WeaponDataModel>)
		.filter((i) => !i.systemData.isProxy),
);

const draggingItem = ref(false);
</script>

<template>
	<section class="tab-inventory">
		<div class="section-weapons">
			<div class="section-head">
				<label>Weapons</label>
				<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'gear')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Name</td>
					</tr>
				</thead>
				<tr v-for="item in weapons" v-bind:key="item.uuid">
					<td>{{ item.name }}</td>
				</tr>
			</table>
		</div>
		<div class="section-gear">
			<div class="section-head">
				<label>Gear</label> <a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'gear')" />
			</div>
			<table>
				<thead>
					<tr>
						<td>Name</td>
					</tr>
				</thead>
				<tr v-for="item in gear" v-bind:key="item.uuid">
					<td>{{ item.name }}</td>
				</tr>
			</table>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
@use '@scss/sheets';

.section-weapons {
	@extend .section;
	width: 47%;
}

.section-gear {
	@extend .section;
	width: 47%;
}
</style>
