<script lang="ts" setup>
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import { inject, toRaw, computed, ref } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { vLocalize } from '@/vue/directives';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';
import Localized from '@/vue/components/Localized.vue';
import CharacterSheet from '@/actor/sheets/CharacterSheet';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => toRaw(context.data.actor).systemData);

function setDamage(monitor: MonitorDataModel, field: string, amount: number) {
	console.log('Setting damage', monitor, field, amount);
	if (monitor.damage === amount) {
		toRaw(context.data.actor).update({ [field]: 0 });
	} else {
		toRaw(context.data.actor).update({ [field]: amount });
	}
}

function boxStyle(monitor: MonitorDataModel, idx: number) {
	if (idx <= monitor.damage) {
		return 'width: 32px; background: #FFCCCB';
	} else {
		return 'width: 32px';
	}
}
</script>

<template>
	<header class="character-meta">
		<div class="section">
			<div class="section-head">
				<div class="title">
					<Localized label="Character" /><input
						type="text"
						name="name"
						:value="context.data.actor.name"
						v-localize:placeholder="'SR6.Labels.CharacterName'"
					/>
				</div>
			</div>
			<div class="section" style="align-self: start; width: 95%">
				<div class="physical-bar" style="width: 100%">
					<table>
						<tr>
							<td class="physical-bar-header"></td>
							<td
								class="physical-bar-box"
								:style="boxStyle(system.monitors.physical, idx)"
								v-for="idx in system.monitors.physical.max"
								:key="idx"
								@click.prevent="
									setDamage(system.monitors.physical, 'system.monitors.physical.damage', idx)
								"
							>
								<template v-if="idx % 3 == 0">
									{{ -Math.round((idx + 1) / 3) }}
								</template>
							</td>
						</tr>
					</table>
				</div>
				<div class="physical-bar" style="width: 100%">
					<table>
						<tr>
							<td class="stun-bar-header"></td>
							<td
								class="physical-bar-box"
								:style="boxStyle(system.monitors.stun, idx)"
								v-for="idx in system.monitors.stun.max"
								:key="idx"
								@click.prevent="setDamage(system.monitors.stun, 'system.monitors.stun.damage', idx)"
							>
								<template v-if="idx % 3 == 0">
									{{ -Math.round((idx + 1) / 3) }}
								</template>
							</td>
						</tr>
					</table>
				</div>
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

	.physical-bar-header {
		font-weight: bold;
		width: 32px;
		background-repeat: no-repeat;
		height: 24px;
		background-image: url('/systems/sr6/assets/heart.svg');
		text-align: center;
		border-left: solid black 1px;
	}
	.stun-bar-header {
		font-weight: bold;
		width: 32px;
		background-repeat: no-repeat;
		height: 24px;
		background-image: url('/systems/sr6/assets/brain.svg');
		text-align: center;
		border-left: solid black 1px;
	}

	.physical-bar-box {
		text-align: center;
		border-left: solid black 1px;

		.damaged {
			background: #ffcccb;
		}
	}
}
</style>
