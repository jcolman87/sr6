<script lang="ts" setup>
import { ImportPromptContext } from '@/app/ImportPrompt';
import { RootContext } from '@/vue/SheetContext';
import { inject, toRaw } from 'vue';

const context = inject<ImportPromptContext>(RootContext)!;

async function click() {
	await new FilePicker({
		callback: async (path: string) => {
			await toRaw(context.app)._onImportGenesisActor(path);
		},
	}).render(true);
}
</script>

<template>
	<div>SR6 JSON: <input id="pick-file" type="button" value="Select File" @click.prevent="click()" /></div>
</template>

<style lang="scss" scoped></style>
