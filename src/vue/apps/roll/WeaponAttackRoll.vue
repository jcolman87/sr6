<script lang="ts" setup>
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';
import { FireMode, Distance } from '@/data';
import { getActor, getItemSync } from '@/util';

import Localized from '@/vue/components/Localized.vue';

import { toRaw, computed, ref } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();
const roll = ref(props.roll as rollers.WeaponAttackRollData);
const weapon = computed(() => getItemSync(SR6Item<WeaponDataModel>, roll.value.attack.itemId)!);
const system = computed(() => toRaw(weapon.value).systemData);
const original_pool = roll.value.pool;

const targets = computed(
	() =>
		roll.value.attack.targetIds.map((id) =>
			getActor(SR6Actor<BaseActorDataModel>, id)
		) as SR6Actor<BaseActorDataModel>[]
);

emit('setText', {
	title: `Roll Attack (${weapon.value.name})`,
	hint: `${system.value.description}`,
});

function onChangeDistance() {
	roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance!);
}

function onChangeFiremode() {
	switch (roll.value.attack.firemode) {
		case FireMode.SS: {
			roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance);
			roll.value.attack.damage = system.value.damage;
			roll.value.pool = original_pool;
			break;
		}
		case FireMode.SA: {
			roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance) - 2;
			roll.value.attack.damage = system.value.damage + 1;
			roll.value.pool = original_pool;
			break;
		}
		case FireMode.BF_narrow: {
			roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance) - 4;
			roll.value.attack.damage = system.value.damage + 2;
			roll.value.pool = original_pool;
			break;
		}
		case FireMode.BF_wide: {
			roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance) - 2;
			roll.value.attack.damage = system.value.damage + 1;
			roll.value.pool = Math.ceil(original_pool / 2);
			break;
		}
		case FireMode.FA: {
			roll.value.attack.attackRating = system.value.attackRatings.atDistance(roll.value.attack.distance) - 6;
			roll.value.attack.damage = system.value.damage;
			roll.value.pool = original_pool;
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
</script>

<template>
	<div class="roll-prompt" style="display: flex; flex-flow: wrap">
		<div class="section warning-box" v-if="roll.attack.targetIds.length == 0">
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
		<div class="section">
			<div class="section-title" style="width: 400px"><Localized label="SR6.Labels.Information" /></div>
			<table>
				<tr>
					<td>
						<Localized label="SR6.Combat.Damage" />: {{ roll.attack.damage
						}}{{ system.damageData.damageType }}
					</td>
					<td><Localized label="SR6.Combat.AttackRating" />: {{ roll.attack.attackRating }}</td>
				</tr>
			</table>
		</div>
		<div class="section">
			<div class="section-title">
				<label><Localized label="SR6.Combat.Distance" /></label>
			</div>
			<select v-model="roll.attack.distance" @change.prevent="onChangeDistance">
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
			<select v-if="system.firemodes" v-model="roll.attack.firemode" @change.prevent="onChangeFiremode">
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
@use '@scss/vars/colors.scss';

.roll-prompt {
	.warning-box {
		background-color: colors.$light-red;
		font-size: 16px;
		.warning-title {
			font-weight: bold;
		}
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
