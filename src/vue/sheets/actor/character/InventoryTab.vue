<script lang="ts" setup>
import GearDataModel from '@/item/data/gear/GearDataModel';
import Selector from '@/vue/components/Selector.vue';
import { createNewItem, deleteItem } from '@/vue/directives';
import { computed, inject, toRaw, ref } from 'vue';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

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

function toggleEquipWeapon(weapon: SR6Item<WeaponDataModel>) {
	if (system.value.equipped._weapon === weapon.uuid) {
		system.value.equipped.weapon = null;
	} else {
		system.value.equipped.weapon = weapon as unknown as SR6Item<WeaponDataModel>;
	}
}

function dragStart(ev: DragEvent, item: SR6Item<GearDataModel>) {
	const data: DragEventData = {
		type: 'Item',
		uuid: item.uuid,
	};

	ev.dataTransfer?.setData('text/plain', JSON.stringify(data));
}
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
					<td>
						<Selector
							:selected="system.equipped.weapon?.uuid === item.uuid"
							@click="toggleEquipWeapon(item)"
						/>
					</td>
					<td>
						<a @click.prevent="item.sheet?.render(true)"><i class="fas fa-edit" /></a
						><a @click.prevent="deleteItem(item)"><i class="fas fa-trash" /></a>
					</td>
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
				<tr
					v-for="item in gear"
					v-bind:key="item.uuid"
					@dragstart="(ev) => dragStart(ev, item)"
					draggable="true"
				>
					<td>{{ item.name }}</td>
					<td>
						<i
							v-if="item.systemData.attached"
							class="fas fa-link"
							:title="item.systemData.attachedTo?.name"
						/>
						<i v-else class="fas fa-link-slash" />
					</td>
					<td>
						<a @click.prevent="item.sheet?.render(true)"><i class="fas fa-edit" /></a
						><a @click.prevent="deleteItem(item)"><i class="fas fa-trash" /></a>
					</td>
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
	width: 97%;
}

.section-gear {
	@extend .section;
	width: 97%;
}
</style>
