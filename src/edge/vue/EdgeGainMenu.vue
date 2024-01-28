<script lang="ts" setup>
import { ITest } from '@/test';
import { EdgeGainTarget } from '@/test/BaseTest';
import { ref, toRaw } from 'vue';

const props = defineProps<{
	test: ITest;
}>();

const edgeGainTarget = ref<EdgeGainTarget>(EdgeGainTarget.None);

async function setEdgeGainTarget(newTarget: EdgeGainTarget) {
	const currentEdgeGain = props.test.data.edgeGain!;

	if (edgeGainTarget.value != EdgeGainTarget.None) {
		currentEdgeGain[edgeGainTarget.value] = Math.max(0, currentEdgeGain[edgeGainTarget.value] - 1);
	}
	edgeGainTarget.value = newTarget;
	if (newTarget != EdgeGainTarget.None) {
		currentEdgeGain[newTarget] += 1;
	}
	props.test.data.edgeGain = currentEdgeGain;
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
							:checked="edgeGainTarget === EdgeGainTarget.None"
							@change.prevent="setEdgeGainTarget(EdgeGainTarget.None)"
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
							:checked="edgeGainTarget === EdgeGainTarget.Self"
							@change.prevent="setEdgeGainTarget(EdgeGainTarget.Self)"
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
							:checked="edgeGainTarget === EdgeGainTarget.Target"
							@change.prevent="setEdgeGainTarget(EdgeGainTarget.Target)"
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
