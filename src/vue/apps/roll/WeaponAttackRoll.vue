<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';
import { FireMode, Distance } from '@/data';
import { getItem } from '@/util';

import Localized from '@/vue/components/Localized.vue';

import { toRaw, computed, ref } from 'vue';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();
const roll = ref(props.roll as rollers.WeaponAttackRollData);
const weapon = computed(() => getItem(SR6Item<WeaponDataModel>, roll.value.attack.itemId)!);
const system = computed(() => toRaw(weapon.value).systemData);
const original_pool = roll.value.pool;

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

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Attack (${weapon.value.name})`,
	hint: `${system.value.description}`,
});
</script>

<template>
	<div style="display: flex; flex-flow: wrap">
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
