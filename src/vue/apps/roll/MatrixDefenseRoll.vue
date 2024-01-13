<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();

const _data = props.roll as rollers.MatrixDefenseRollData;

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Defense (${props.roll.threshold})`,
	hint: '',
});
</script>

<template>
	<div></div>
</template>
