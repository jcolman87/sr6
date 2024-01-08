<script lang="ts" setup>
import { ref, computed, toRaw } from 'vue';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import GearDataModel from '@/item/data/gear/GearDataModel';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import { rollWeaponAttack } from '@/roll/Rollers';

const props = withDefaults(
	defineProps<{
		actor: SR6Actor;
		item: SR6Item<GearDataModel>;
		dragging?: boolean;
	}>(),
	{
		dragging: false,
	}
);

const weaponData = computed(() => props.item.systemData as WeaponDataModel);

const isBasicItem = ref(false);
const dragCounter = ref(0);
const isBeingDragged = ref(false);
const dimForDrag = computed(() => props.dragging && props.item.type !== 'container');

function dragEnter(event: DragEvent) {}
function dragLeave(event: DragEvent) {}
function dragStart(event: DragEvent) {}
function dragEnd(event: DragEvent) {}

function drop(event: DragEvent) {}

function openItem() {
	void toRaw(props.item).sheet.render(true);
}

function rollWeapon(item: SR6Item<WeaponDataModel>) {
	void rollWeaponAttack(toRaw(props.actor).systemData, toRaw(item));
}
</script>

<template>
	<div
		:class="{
			'inventory-item': true,
			hover: dragCounter > 0,
			'drag-dim': dimForDrag && !isBeingDragged,
			'drag-source': isBeingDragged,
		}"
		@dragenter="dragEnter"
		@dragleave="dragLeave"
		@dragstart="dragStart"
		@dragend="dragEnd"
		@drop="drop"
	>
		<a @click="openItem"><img :src="item.img" :alt="item.name" /></a>

		<!-- Basic, single-row item -->
		<span v-if="isBasicItem" class="name" @dragenter="dragEnter" @dragleave="dragLeave">
			<a @click="openItem">{{ item.name }}</a>
		</span>
		<!-- Complex item with additional details row -->
		<div v-else class="details" @dragenter="dragEnter" @dragleave="dragLeave">
			<span class="name">
				<div v-if="item.type === 'weapon'">
					<button class="attack" @click.prevent="rollWeapon(item as SR6Item<WeaponDataModel>)">Attack</button>
				</div>
				<a @click="openItem"
					><i class="name-text">{{ item.name }}</i></a
				>

				<div v-if="item.type === 'weapon'">
					{{ weaponData.damage }}{{ weaponData.damageData.damageType }} ({{
						weaponData.attackRatings.close
					}}-{{ weaponData.attackRatings.near }}-{{ weaponData.attackRatings.medium }}-{{
						weaponData.attackRatings.far
					}}-{{ weaponData.attackRatings.extreme }})
				</div>
			</span>
			<div :data-item-type="item.type">
				<template v-if="item.type === 'weapon'">{{ item.systemData.description }}</template>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors.scss';

.inventory-item {
	display: grid;
	grid-template-columns: [icon] 2rem [name] auto [spacer] 1fr [quantity] 2.5em [weight] 2.5em [damage] 2em [actions] auto;
	grid-template-rows: auto auto;
	align-items: center;
	column-gap: 0.5em;

	background: transparentize(colors.$light-blue, 0.85);
	border: 1px solid transparentize(colors.$light-blue, 0.7);
	border-radius: 0.25em;
	padding: 2px;

	user-select: none;
	transition: all 0.25s ease-in-out;

	margin-bottom: 0.25em;

	&:not(.mini) {
		&.hover {
			background: transparentize(colors.$light-blue, 0.4) !important;
			border: 1px solid transparentize(colors.$light-blue, 0.2) !important;
		}

		&.drag-source {
			background: transparentize(colors.$light-blue, 0.6) !important;
			border: 1px solid transparentize(colors.$light-blue, 0.4) !important;
		}

		&.dropped {
			background: transparentize(#333, 0.9);
			border: 1px solid transparentize(#333, 0.85);

			& > :not(.actions) {
				opacity: 65%;
			}

			&:hover {
				background: transparentize(#333, 0.75);
				border: 1px solid transparentize(#333, 0.5);
			}
		}

		&.drag-dim {
			position: relative;

			background: transparentize(#333, 0.85);
			border: 1px solid transparentize(#333, 0.7);

			opacity: 65%;
		}
	}

	&.mini {
		grid-template-columns: [icon] 1.5em [name] auto [spacer] 1fr [quantity] 2.5em [weight] 2.5em [damage] 2em [actions] auto;
		height: 2em;
		overflow: hidden;
		font-size: 0.8em;
		margin-left: 1.5em;

		background: transparentize(colors.$blue, 0.8);
		border: 1px solid transparentize(colors.$blue, 0.5);

		&:hover {
			background: transparentize(colors.$blue, 0.6);
			border: 1px solid transparentize(colors.$blue, 0.5);
		}

		.quantity,
		.weight {
			color: colors.$blue;
		}
	}

	&:hover {
		background: transparentize(colors.$light-blue, 0.75);
		border: 1px solid transparentize(colors.$light-blue, 0.5);
	}

	img {
		grid-column: icon / span 1;
		border-radius: 0.25em;
	}

	& > .name {
		grid-column: name / span 1;
	}

	.contents {
		grid-column: icon / span all;
		grid-row: 2 / span all;
		transform-origin: top center;
		max-height: 100px;
		overflow-y: auto;
		padding-right: 0.5em;

		&:empty {
			display: none;
		}
	}

	.name {
		font-family: 'Roboto Serif', serif;
		font-size: 1.15em;
		display: flex;
		align-items: center;
		gap: 0.25em;

		.name-text {
			font-style: italic;
			font-weight: bold;
		}

		button.attack {
			height: 1.5em;
			margin: 0;
			width: auto !important;
			line-height: 1em;
			padding: 2px;

			background: colors.$purple;
			color: white;
		}
	}

	.details {
		display: grid;
		grid-template-rows: auto auto;
		grid-column: name / span 2;
		font-family: 'Roboto Serif', serif;

		& > div {
			grid-row: 2 / span 1;
			display: flex;
			flex-wrap: wrap;
			font-size: 0.9em;
			color: colors.$dark-blue;
			gap: 0.25em;

			&:not([data-item-type='container']) {
				margin-left: 0.5em;
			}

			& > div {
				&:after {
					display: inline;
					content: ';';
				}

				&:last-child:after {
					display: none;
				}
			}
		}
	}

	.weight,
	.quantity,
	.damage {
		grid-row: 1 / span 1;
		display: flex;
		align-items: center;
		column-gap: 0.25em;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.25em;
		text-align: center;
		color: colors.$dark-blue;
		width: 100%;
		justify-content: flex-end;

		i {
			position: relative;
			top: -1px;
			font-size: 0.75em;
		}
	}

	.weight {
		grid-column: weight / span 1;
	}

	.quantity {
		grid-column: quantity / span 1;
	}

	.damage {
		grid-column: damage / span 1;
		font-size: 1.5em;
	}

	.actions {
		grid-column: actions / span 1;
		width: 1.25em;
		text-align: center;
	}
}

.container-contents-enter-active {
	animation: expand 0.5s;
}

.container-contents-leave-active {
	animation: expand 0.5s reverse;
}

@keyframes expand {
	0% {
		transform: scaleY(0);
		max-height: 0;
	}
	100% {
		transform: scaleY(1);
		max-height: 100px;
	}
}
</style>
