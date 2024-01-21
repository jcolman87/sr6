/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { SR6ChatMessage } from '@/chat/SR6ChatMessage';
import ContactTest from '@/roll/test/ContactTest';
import { toRaw } from 'vue';
const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: ContactTest;
	message: SR6ChatMessage;
}>();

emit('setText', {
	title: 'adsfasdf',
	hint: ``,
});

console.log('asdf', toRaw(props.test));
</script>

<template>
	<div class="flexrow chat-contact-test">
		<div class="contact-details">Conneciton Hits: {{ test.data.connectionHits }}</div>
	</div>
</template>

<style lang="scss" scoped>
.chat-contact-test {
	font-size: 12px;

	.contact-details {
		padding-top: 5px;
		padding-bottom: 5px;
		min-width: 100%;
	}
}
</style>
