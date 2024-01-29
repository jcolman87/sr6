<script lang="ts" setup>
import VehicleDataModel from '@/actor/data/VehicleDataModel';
import { getEventValue } from '@/vue/directives';
import { computed, toRaw, inject } from 'vue';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import BasicActorSheet from '@/vue/sheets/actor/BasicActorSheet.vue';

const context = inject<ActorSheetContext<VehicleDataModel>>(RootContext)!;
const system = computed(() => toRaw(context.data.actor).systemData);

async function setAcceleration(ev: Event) {
	let newAccel = getEventValue(ev) as number;
	await toRaw(system.value).setAcceleration(newAccel);
}

async function setSpeed(ev: Event) {
	let newSpeed = getEventValue(ev) as number;
	await toRaw(system.value).setSpeed(newSpeed);
}

async function pilotRoll() {}
</script>

<template>
	<BasicActorSheet show-effects-tab>
		<template v-slot:data>
			<div class="vehicle-sheet">
				<div class="vehicle-info">
					<div class="section-head">Information</div>
					<div>Max Acceleration: {{ system.acceleration }}</div>
					<div>Max Speed: {{ system.maxSpeed }}</div>
				</div>
				<div class="vehicle-current">
					<div class="section">
						<div class="section-head">
							Movement
							<div class="section-head-button">
								Next Round<a class="fa-solid fa-arrow-right" @click.prevent="system.nextRound()" />
							</div>
							<div style="font-size: 10px">
								Reset<a class="fa-solid fa-recycle" @click.prevent="system.resetSpeed()" />
							</div>
						</div>
						<!--<a class="fa-solid fa-plus" @click.prevent="changeSpeed(1)"></a
						><a class="fa-solid fa-minus" @click.prevent="changeSpeed(-1)"></a>-->
						<div>
							Acceleration:
							<input
								class="speed-input"
								type="number"
								:value="system.current.acceleration"
								@change.prevent="setAcceleration"
							/>
						</div>
						<div>
							Speed:
							<input
								class="speed-input"
								type="number"
								:value="system.current.speed"
								@change.prevent="setSpeed"
							/>m/s
						</div>
						<div>
							Combat Round Movement:
							{{ system.current.speed + Math.ceil(system.current.acceleration * 0.5) }}m/round
						</div>
					</div>
					<div class="section">
						<div class="section-head">Rolls</div>
						Piloting Roll ({{ system.speedPoolModifier }})
						<a @click.prevent="pilotRoll"><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a>
					</div>
					<div class="vehicle-occupants">
						<div class="section-head">Passangers</div>
						<div class="vehicle-pilot">
							<div class="section-head">Pilot</div>
							<img
								:src="context.data.actor.img"
								data-edit="img"
								:alt="context.data.actor.name"
								width="64"
								height="64"
							/>
						</div>
						<div class="vehicle-passengers">
							<div class="section-head">Occupants</div>
							<img
								:src="context.data.actor.img"
								data-edit="img"
								:alt="context.data.actor.name"
								width="64"
								height="64"
							/><img
								:src="context.data.actor.img"
								data-edit="img"
								:alt="context.data.actor.name"
								width="64"
								height="64"
							/><img
								:src="context.data.actor.img"
								data-edit="img"
								:alt="context.data.actor.name"
								width="64"
								height="64"
							/>
						</div>
					</div>
				</div>
			</div>
		</template>
	</BasicActorSheet>
</template>

<style lang="scss" scoped>
@use '@/scss/sheets';
.vehicle-sheet {
	@extend .section;

	width: 100%;
	height: 100%;

	.vehicle-current {
		@extend .section;
		min-width: 98%;

		.speed-input {
			width: 3em;
		}

		.vehicle-occupants {
			@extend .section;
			min-width: 98%;
			.vehicle-pilot {
				@extend .section;
			}
			.vehicle-passengers {
				@extend .section;
			}
		}
	}

	.vehicle-info {
		@extend .section;
		min-width: 98%;
	}
}
</style>
