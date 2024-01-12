<script lang="ts" setup>
import * as images from '@/vue/images';
import MonitorView from '@/vue/views/MonitorView.vue';
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import { inject, toRaw, computed } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { getEventValue, vLocalize } from '@/vue/directives';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => toRaw(context.data.actor).systemData);

async function setDamage(monitor: MonitorDataModel, field: string, amount: number) {
	// If we arnt maxed on physical, reset overflow
	if (toRaw(system.value).monitors.physical.value > 0) {
		await toRaw(context.data.actor).update({ ['system.monitors.overflow.damage']: 0 });
	}

	if (monitor.damage === amount) {
		await toRaw(context.data.actor).update({ [field]: 0 });
	} else {
		await toRaw(context.data.actor).update({ [field]: amount });
	}
}

function setEdge(ev: Event) {
	const actor = toRaw(context.data.actor);

	let value = getEventValue(ev)!;

	if (value > actor.systemData.monitors.edge.max) {
		value = actor.systemData.monitors.edge.max;
	}
	actor.update({ ['system.monitors.edge.damage']: actor.systemData.monitors.edge.max - (value as number) });
}
</script>

<template>
	<header class="character-meta">
		<div class="section">
			<div class="section-head">
				<div class="title">
					<Localized label="Character" /><br /><input
						type="text"
						name="name"
						:value="context.data.actor.name"
						v-localize:placeholder="'SR6.Labels.CharacterName'"
						style="width: 10em"
					/>
				</div>
				<div class="section" style="display: flex; flex-flow: row nowrap">
					<div class="text-atop">
						<img :src="images.karma" alt="" />
						<label class="text-atop-value"
							><input type="number" name="system.karma" :value="system.karma"
						/></label>
					</div>
					<div class="text-atop">
						<img :src="images.edge" alt="" />
						<label class="text-atop-value" style="white-space: nowrap"
							><input
								type="number"
								@change="setEdge"
								:value="system.monitors.edge.value"
								style="width: 1em" />/<input
								type="number"
								name="system.monitors.edge.max"
								:value="system.monitors.edge.max"
								style="width: 1em"
						/></label>
					</div>
					<div class="text-atop">
						<img :src="images.yen" alt="" />
						<label class="text-atop-value">{{ system.totalNuyen }}</label>
					</div>
				</div>
			</div>
			<div class="section" style="align-self: start; width: 95%">
				<MonitorView
					:monitor="system.monitors.physical"
					@setDamage="(idx) => setDamage(system.monitors.physical, 'system.monitors.physical.damage', idx)"
				/>
				<MonitorView
					v-if="system.monitors.physical.value <= 0"
					:monitor="system.monitors.overflow"
					icon="/icons/svg/skull.svg"
					:showModifiers="false"
					@setDamage="(idx) => setDamage(system.monitors.overflow, 'system.monitors.overflow.damage', idx)"
				/>
				<MonitorView
					:monitor="system.monitors.stun"
					icon="/systems/sr6/assets/brain.webp"
					@setDamage="(idx) => setDamage(system.monitors.stun, 'system.monitors.stun.damage', idx)"
				/>
			</div>
		</div>
		<img :src="context.data.actor.img" data-edit="img" :alt="context.data.actor.name" />
	</header>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/reset.scss';
@use '@scss/vars/colors.scss';

// Container for the character's meta information; name, archetype, career, etc. as well as the Actor's image
.character-meta {
	display: grid;
	grid-template-columns: 1fr min(110px, 20%);
	gap: 1rem;
	margin-bottom: 0.5em;

	@include reset.input;

	// Actor's image
	img {
		border: 1px solid colors.$gold;
		background: transparentize(colors.$gold, 0.5);
		border-radius: 1em;
	}

	.text-atop {
		width: 48px;
		height: 48px;
		display: flex;
		flex-flow: row nowrap;
		position: relative;
		flex: 0.48;
		margin-right: 10px;
	}

	.text-atop img {
		border: 0;
		height: auto;
		width: 48px;
		z-index: 0;
		position: absolute;
		filter: drop-shadow(0 0 4px #000000);
	}
	.text-atop input {
		width: 2em;
		color: white;
	}

	.text-atop-value {
		z-index: 1;
		position: relative;
		width: 48px;
		top: 10px;
		text-align: center;
		font-size: large;
		color: white;
		font-weight: bold;
	}

	.nuyen-icon {
		position: relative;
		width: 32px;
		line-height: 32px;
		float: left;
		margin-right: 1px;
		background-repeat: no-repeat;
		background-size: 32px 32px;
		font-size: 24px;
		color: #000;
		font-weight: bold;
		background-image: url(/systems/sr6/assets/yen.webp);
	}

	.edge-icon {
		position: relative;
		width: 32px;
		line-height: 32px;
		float: left;
		margin-right: 1px;
		background-repeat: no-repeat;
		background-size: 32px 32px;
		font-size: 24px;
		color: #000;
		font-weight: bold;
		background-image: url(/systems/sr6/assets/edge.webp);
	}
}
</style>
