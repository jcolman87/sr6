/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import MarixActionTest from '@/roll/test/MatrixActionTest';
import PhysicalSoakTest from '@/roll/test/PhysicalSoakTest';
import RangedAttackTest from '@/roll/test/RangedAttackTest';
import { getSelfOrSelectedActors } from '@/util';
import Targets from '@/vue/chat/Targets.vue';
import Localized from '@/vue/components/Localized.vue';
import { Collapse } from 'vue-collapsed';
import { toRaw, ref } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: MarixActionTest;
}>();

async function executeOpposedTest() {
	for (const actor of getSelfOrSelectedActors()) {
		await toRaw(props.test).opposed?.(actor).execute();
	}
}

const visibility = ref({
	description: {
		damage: false,
	},
});

emit('setText', {
	title: props.test.matrixAction.name,
	hint: ``,
});
</script>

<template>
	<div class="flexrow chat-physical-soak">
		<div class="attack-details">balls</div>
	</div>
</template>

<style lang="scss" scoped>
.chat-physical-soak {
	font-size: 12px;

	.attack-details {
		padding-top: 5px;
		padding-bottom: 5px;
		min-width: 100%;
	}
}
</style>
