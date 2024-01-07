<script lang="ts" setup>
import { MonitorDataModel } from '@/actor/data/MonitorsDataModel';
import { inject, toRaw, computed } from 'vue';

const emit = defineEmits<{
	(e: 'setDamage', value: number): void;
}>();

const props = defineProps<{
	monitor: MonitorDataModel;
	icon: string;
}>();

function setDamage(amount: number) {
	if (props.monitor.damage === amount) {
		emit('setDamage', 0);
	} else {
		emit('setDamage', amount);
	}
}

function boxStyle(idx: number) {
	if (idx <= props.monitor.damage) {
		return 'width: 32px; background: #FFCCCB';
	} else {
		return 'width: 32px';
	}
}
</script>

<template>
	<div style="width: 100%">
		<table>
			<tr>
				<td class="monitor-header physical-bar-header"></td>
				<td
					class="monitor-bar-box"
					:style="boxStyle(idx)"
					v-for="idx in props.monitor.max"
					:key="idx"
					@click.prevent="setDamage(idx)"
				>
					<template v-if="idx % 3 == 0">
						{{ -Math.round((idx + 1) / 3) }}
					</template>
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/reset.scss';
@use '@scss/vars/colors.scss';

.monitor-view {
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

	.monitor-header {
		font-weight: bold;
		width: 32px;
		background-repeat: no-repeat;
		height: 24px;
		background-image: url(v-bind(props.icon));
		background-size: 24px;
		text-align: center;
		border-left: solid black 1px;
	}
	.monitor-bar-box {
		text-align: center;
		border-left: solid black 1px;

		.damaged {
			background: #ffcccb;
		}
	}
}
</style>
