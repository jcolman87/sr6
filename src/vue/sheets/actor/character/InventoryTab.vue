<script lang="ts" setup>
import { createNewItem } from '@/vue/directives';
import { computed, inject, toRaw, ref } from 'vue';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

import InventoryItem from '@/vue/components/inventory/InventoryItem.vue';

const _EQUIPMENT_TYPES = ['gear', 'weapon'];

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
		<div>
			<label>Weapons</label>
			<TransitionGroup name="weapons">
				<template v-for="item in weapons" :key="item.id">
					<InventoryItem
						:actor="context.data.actor"
						:item="item"
						draggable="true"
						@dragstart="draggingItem = true"
						@dragend="draggingItem = false"
						:dragging="draggingItem"
					/>
				</template>
			</TransitionGroup>
		</div>
		<div>
			<label>Gear</label>
			<div><a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'gear')" /></div>
			<TransitionGroup name="weapons">
				<template v-for="item in gear" :key="item.id">
					<InventoryItem
						:actor="context.data.actor"
						:item="item"
						draggable="true"
						@dragstart="draggingItem = true"
						@dragend="draggingItem = false"
						:dragging="draggingItem"
					/>
				</template>
			</TransitionGroup>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
