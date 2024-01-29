<script lang="ts" setup>
import { ITest } from '@/test';
import { Target } from '@/test/BaseTest';
import { ref } from 'vue';

const props = defineProps<{
	test: ITest;
}>();

const edgeGainTarget = ref<Target>(Target.None);

async function setEdgeGainTarget(newTarget: Target) {
	const currentEdgeGain = props.test.data.edge!.gain!;

	if (edgeGainTarget.value !== Target.None) {
		currentEdgeGain[edgeGainTarget.value] = Math.max(0, currentEdgeGain[edgeGainTarget.value] - 1);
	}
	edgeGainTarget.value = newTarget;
	if (newTarget !== Target.None) {
		currentEdgeGain[newTarget] += 1;
	}
	props.test.data.edge!.gain = currentEdgeGain;
}
</script>

<template>
	<div class="edge-gain-menu">
		<div class="section-head">Edge Gain</div>
		<table>
			<tr>
				<td>
					<label class="switch">
						<input
							id="edgeGainNone"
							name="edgeGain"
							type="radio"
							:checked="edgeGainTarget === Target.None"
							@change.prevent="setEdgeGainTarget(Target.None)"
						/>
						<span class="slider round"></span>
					</label>
				</td>
				<td><label for="">None</label></td>
			</tr>
			<tr>
				<td>
					<label class="switch">
						<input
							id="edgeGainSelf"
							name="edgeGain"
							type="radio"
							:checked="edgeGainTarget === Target.Self"
							@change.prevent="setEdgeGainTarget(Target.Self)"
						/>
						<span class="slider round"></span>
					</label>
				</td>
				<td><label for="edgeGainSelf">Self</label></td>
			</tr>
			<tr>
				<td>
					<label class="switch">
						<input
							id="edgeGainTarget"
							name="edgeGain"
							type="radio"
							:checked="edgeGainTarget === Target.Target"
							@change.prevent="setEdgeGainTarget(Target.Target)"
						/>
						<span class="slider round"></span>
					</label>
				</td>
				<td><label for="edgeGainTarget">Target(s)</label></td>
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';
@use '@/scss/sheets';

.edge-gain-menu {
	@extend .section;
}
</style>
