<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SR6Item from '@/item/SR6Item';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';
import { getItemSync } from '@/util';

import { computed } from 'vue';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();

const data = props.roll as rollers.MatrixActionRollData;
const action = computed(() => getItemSync(SR6Item<MatrixActionDataModel>, data.attack.itemId)!);

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: action.value.name,
	hint: action.value.systemData.description,
});
</script>

<template>
	<div></div>
</template>
