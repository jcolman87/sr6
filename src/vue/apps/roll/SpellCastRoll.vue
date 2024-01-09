<script lang="ts" setup>
import { EnumAttribute } from '@/actor/data';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import SR6Actor from '@/actor/SR6Actor';
import SpellDataModel, {
	drainFromAdjustments,
	damageFromAdjustments,
	SpellAdjustmentType,
} from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';
import { getItemSync } from '@/util';
import Localized from '@/vue/components/Localized.vue';

import { computed, ref, toRaw } from 'vue';
import { Collapse } from 'vue-collapsed';

const props = defineProps<{
	actor: SR6Actor<CharacterDataModel>;
	roll: SR6RollData;
}>();

const data = props.roll as rollers.SpellCastRollData;
const spell = computed(() => getItemSync(SR6Item<SpellDataModel>, data.attack.itemId)! as SR6Item<SpellDataModel>);
const showAdjustments = ref(false);

const maxAdjustments = computed(() =>
	Math.max(
		toRaw(props.actor).systemData.attribute(EnumAttribute.magic).value,
		toRaw(props.actor).skill('Sorcery')!.systemData.points
	)
);

const adjustments = ref(data.adjustments);

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Spell (${spell.value.name})`,
	hint: '',
});

function addAdjustment(value: SpellAdjustmentType) {
	if (adjustments.value.length < maxAdjustments.value) {
		adjustments.value.push(value);
	}
}
function removeAdjustment(value: SpellAdjustmentType) {
	let index = adjustments.value.indexOf(value);
	if (index !== -1) {
		if (index !== 0) {
			adjustments.value = adjustments.value.splice(index, 1);
		} else {
			adjustments.value.shift();
		}
	}
}

console.log('drain', drainFromAdjustments(adjustments.value), data.drain);
</script>

<template>
	<div class="spell-cast-roll">
		<div class="section adjustments-section">
			<div class="section-head">
				<a @click="showAdjustments = !showAdjustments"
					><i class="fa-solid fa-down-from-line" />&nbsp;&nbsp; Adjust Spell</a
				><span style="margin-left: auto; margin-right: 10px"
					>Available: {{ adjustments.length }}/{{ maxAdjustments }}</span
				>
			</div>
			<Collapse :when="showAdjustments">
				<table>
					<template v-for="[adjKey, adjValue] in Object.entries(SpellAdjustmentType)" v-bind:key="adjKey">
						<tr>
							<td>
								<a @click.prevent="addAdjustment(adjValue)"
									><div class="plus"><i class="fa fa-plus" aria-hidden="true" /></div
								></a>
								<a @click.prevent="removeAdjustment(adjValue)"
									><div class="minus"><i class="fa fa-minus" aria-hidden="true" /></div
								></a>
							</td>
							<td>
								<div>
									<input
										type="text"
										:value="adjustments.filter((adj) => adj == adjValue).length"
										class="counter"
										disabled
									/>
								</div>
								<div class="title">
									<Localized :label="`SR6.Magic.SpellAdjustments.${adjKey}.Name`" />
								</div>
							</td>
							<td>
								<Localized :label="`SR6.Magic.SpellAdjustments.${adjKey}.Description`" />
							</td>
						</tr>
						<tr>
							<td colspan="5" class="break"></td>
						</tr>
					</template>
				</table>
			</Collapse>
		</div>
		<div class="section">
			<label><Localized label="SR6.Labels.Drain" /></label>
			<input class="counter" type="number" :value="drainFromAdjustments(adjustments) + data.drain" disabled />
		</div>
		<div class="section">
			<label><Localized label="SR6.Combat.AttackRating" /></label>
			<input class="counter" type="number" :value="data.attack.attackRating" disabled />
		</div>
		<div class="section">
			<label><Localized label="SR6.Labels.Damage" /></label>
			<input
				class="counter"
				type="number"
				:value="damageFromAdjustments(adjustments) + data.attack.damage"
				disabled
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/vars/sheet.scss';

.spell-cast-roll {
	width: 100%;

	.adjustments-section {
		width: 100%;

		.break {
			border-bottom: 1px solid;
		}

		.title {
			font-weight: bold;
			text-align: center;
			white-space: nowrap;
		}
		.plus {
		}
		.minus {
		}
	}

	.counter {
		text-align: center;
		font-weight: bold;
	}
}
</style>
