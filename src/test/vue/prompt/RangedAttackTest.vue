<script lang="ts" setup>
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { FireMode } from '@/data';
import { RangedAttackTest } from '@/test/RangedTests';
import { getActorSync } from '@/util';

import Localized from '@/vue/components/Localized.vue';

import { computed, toRaw } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: RangedAttackTest;
}>();

const weapon = computed(() => props.test.weapon);
const system = computed(() => toRaw(weapon.value).systemData);

const original_pool = props.test.data.pool!;

const targets = computed(
	() =>
		props.test.data.targetIds?.map((id) =>
			getActorSync(SR6Actor<BaseActorDataModel>, id),
		) as SR6Actor<BaseActorDataModel>[],
);

emit('setText', {
	title: `Roll Attack (${weapon.value.name})`,
	hint: `${system.value.description}`,
});

function onChangeDistance() {
	props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!);
}

function onChangeFiremode() {
	switch (props.test.data.firemode) {
		case FireMode.SS: {
			props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!);
			props.test.data.damage = system.value.damage;
			props.test.data.pool = original_pool;
			break;
		}
		case FireMode.SA: {
			props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!) - 2;
			props.test.data.damage = system.value.damage + 1;
			props.test.data.pool = original_pool;
			break;
		}
		case FireMode.BF_narrow: {
			props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!) - 4;
			props.test.data.damage = system.value.damage + 2;
			props.test.data.pool = original_pool;
			break;
		}
		case FireMode.BF_wide: {
			props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!) - 2;
			props.test.data.damage = system.value.damage + 1;
			props.test.data.pool = Math.ceil(original_pool / 2);
			break;
		}
		case FireMode.FA: {
			props.test.data.attackRating = system.value.attackRatings.atDistance(props.test.data.distance!) - 6;
			props.test.data.damage = system.value.damage;
			props.test.data.pool = original_pool;
			break;
		}
	}
}

async function focusTarget(target: SR6Actor<BaseActorDataModel>): Promise<void> {
	if (target.token) {
		await canvas.animatePan(target.token.object.center);
		await canvas.ping(target.token.object.center);
	}
}

/*
function updateEdgeGain() {
	if (targets.value.length === 0) {
		props.test.data.edgeGained = EdgeGainedTarget.None;
	} else {
		if (props.test.data.attackRating! >= targetDefenseRating.value + 4) {
			props.test.data.edgeGained = EdgeGainedTarget.Attacker;
		} else if (targetDefenseRating.value >= props.test.data.attackRating! + 4) {
			props.test.data.edgeGained = EdgeGainedTarget.Defender;
		}
	}
}
onMounted(updateEdgeGain);
onBeforeUpdate(updateEdgeGain);
*/
</script>

<template>
	<div class="roll-prompt" style="display: flex; flex-flow: wrap">
		<div class="section warning-box" v-if="test.data.targetIds?.length == 0">
			<div class="section-head warning-title">Warning: No targets selected</div>
			You did not have any targets selected for this roll. Automatic damage, conditions and effects will not be
			applied.
		</div>
		<div class="section" style="width: 100%" v-else>
			<div class="section-head">Targets</div>

			<div class="target-box">
				<template v-for="target in targets" :key="target.id"
					><div @click.prevent="focusTarget(target)" @dblclick.prevent="target.sheet?.render(true)">
						{{ target.name }}
					</div></template
				>
			</div>
		</div>
		<div class="section" style="width: 70%">
			<div class="section-title"><Localized label="SR6.Labels.Information" /></div>
			<table>
				<tr>
					<td>
						<Localized label="SR6.Combat.Damage" />: {{ test.data.damage
						}}{{ system.damageData.damageType }}
					</td>
					<td><Localized label="SR6.Combat.AttackRating" />: {{ test.data.attackRating }}</td>
				</tr>
				<tr>
					<td></td>
					<td><Localized label="SR6.Combat.DefenseRating" />: TODO</td>
				</tr>
			</table>
		</div>
		<!--
		<div class="section" style="width: 25%">
			<div class="section-title">
				<label><Localized label="SR6.RollPrompt.EdgeGained" /></label>
			</div>
			<table style="border: 0; padding: 0; margin: 0">
				<tr>
					<td>
						<input
							name="edgeGained"
							type="radio"
							:value="EdgeGainedTarget.None"
							:checked="data.edgeGained === EdgeGainedTarget.None"
						/>
					</td>
					<td><label for="edgeGainedTarget">None</label></td>
				</tr>
				<tr :class="data.edgeGained === EdgeGainedTarget.Attacker ? '.good' : ''">
					<td>
						<input
							name="edgeGained"
							type="radio"
							:value="EdgeGainedTarget.Attacker"
							:checked="data.edgeGained === EdgeGainedTarget.Attacker"
						/>
					</td>
					<td><label for="edgeGained">You</label></td>
				</tr>
				<tr :class="data.edgeGained === EdgeGainedTarget.Defender ? '.bad' : ''">
					<td>
						<input
							name="edgeGained"
							type="radio"
							:value="EdgeGainedTarget.Defender"
							:checked="data.edgeGained == EdgeGainedTarget.Defender"
						/>
					</td>
					<td><label for="edgeGainedTarget">Target(s)</label></td>
				</tr>
			</table>
		</div>
		-->
		<div class="section">
			<div class="section-title">
				<label><Localized label="SR6.Combat.Distance" /></label>
			</div>
			<select v-model="test.data.distance" @change.prevent="onChangeDistance">
				<option value="close"><Localized label="SR6.Combat.Distances.close" /></option>
				<option value="near"><Localized label="SR6.Combat.Distances.near" /></option>
				<option value="far"><Localized label="SR6.Combat.Distances.far" /></option>
				<option value="extreme"><Localized label="SR6.Combat.Distances.extreme" /></option>
			</select>
		</div>
		<div class="section">
			<div class="section-title">
				<label><Localized label="SR6.Combat.FireMode" /></label>
			</div>
			<select v-if="system.firemodes" v-model="test.data.firemode" @change.prevent="onChangeFiremode">
				<option value="SS"><Localized label="SR6.Combat.FireModes.SS.Name" /></option>
				<option value="SA"><Localized label="SR6.Combat.FireModes.SA.Name" /></option>
				<option value="BF_narrow"><Localized label="SR6.Combat.FireModes.BFNarrow.Name" /></option>
				<option value="BF_wide"><Localized label="SR6.Combat.FireModes.BFWide.Name" /></option>
				<option value="FA"><Localized label="SR6.Combat.FireModes.FA.Name" /></option>
			</select>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';

.roll-prompt {
	.warning-box {
		background-color: colors.$light-red;
		font-size: 16px;
		color: black;
		.warning-title {
			font-weight: bold;
		}
	}

	.good {
		background-color: colors.$green-bg;
	}
	.bad {
		background-color: colors.$red-bg;
	}

	.target-box {
		//background-color: colors.$light-green;
		display: grid;

		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));

		//gap: 1rem;

		div {
			text-align: center;
			background: colors.$light-red;
			padding: 0.5rem;
			border-radius: 1rem;

			&:hover {
				font-weight: bold;
				text-shadow: 0 0 5px #ff0000;
			}
		}
	}
}
</style>
