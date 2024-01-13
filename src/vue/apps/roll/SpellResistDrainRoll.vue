<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import SpellDataModel from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';
import { getItemSync } from '@/util';
import Localized from '@/vue/components/Localized.vue';

import { computed } from 'vue';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();

const data = props.roll as rollers.SpellCastRollData;
const spell = computed(() => getItemSync(SR6Item<SpellDataModel>, data.attack.itemId)! as SR6Item<SpellDataModel>);

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Resist Drain (${spell.value.name})`,
	hint: '',
});
</script>

<template>
	<div class="spell-resist-drain-roll">
		<div class="section">
			<label><Localized label="SR6.Labels.Drain" /></label>
			<input class="counter" type="number" :value="data.attack.damage" disabled />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/vars/sheet.scss';

.spell-resist-drain-roll {
	width: 100%;

	.counter {
		text-align: center;
		font-weight: bold;
	}
}
</style>
