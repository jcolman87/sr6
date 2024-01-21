/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import MarixActionTest from '@/test/MatrixActionTest';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: MarixActionTest;
}>();

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
