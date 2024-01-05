<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';

import { toRaw, computed } from 'vue';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();

const data = props.roll as rollers.SkillRollData;
const skill = computed(() => toRaw(props.actor).skill(data.skillId)!);

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Skill (${skill.value.name})`,
	hint: '',
});
</script>

<template>
	<div></div>
</template>
