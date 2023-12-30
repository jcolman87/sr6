<script lang="ts" setup>
import { computed, inject, toRaw, ref } from 'vue';
import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

import InventoryItem from '@/vue/components/inventory/InventoryItem.vue';

const EQUIPMENT_TYPES = ['gear', 'weapon'];

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const gear = computed(() => toRaw(context.data.actor).items.filter((i) => i.type == 'gear') as SR6Item<GearDataModel>[]);
const weapons = computed(() => toRaw(context.data.actor).items.filter((i) => i.type == 'weapon') as SR6Item<WeaponDataModel>[]);

const draggingItem = ref(false);
</script>

<template>
	<section class="tab-inventory">
		<div>
			<label>Weapons</label>
			<TransitionGroup name="weapons">
				<template v-for="item in weapons" :key="item.id">
					<InventoryItem :actor="context.data.actor" :item="item" draggable="true" @dragstart="draggingItem = true" @dragend="draggingItem = false" :dragging="draggingItem" />
				</template>
			</TransitionGroup>
		</div>
		<div>
			<label>Gear</label>
			<TransitionGroup name="weapons">
				<template v-for="item in gear" :key="item.id">
					<InventoryItem :actor="context.data.actor" :item="item" draggable="true" @dragstart="draggingItem = true" @dragend="draggingItem = false" :dragging="draggingItem" />
				</template>
			</TransitionGroup>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
