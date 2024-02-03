/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import BaseTest from '@/test/BaseTest';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	src: foundry.abstract.Document;
	test: BaseTest;
}>();

emit('setText', {
	title: `Memory Test`,
	hint: ``,
});
</script>

<template>
	<div class="flexrow chat-attribute-test">
		<div class="attack-details">asdf</div>
	</div>
</template>

<style lang="scss" scoped>
.chat-attribute-test {
	font-size: 12px;

	.attack-details {
		padding-top: 5px;
		padding-bottom: 5px;
		min-width: 100%;
	}
}
</style>
