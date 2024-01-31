<script lang="ts" setup>
import { ImportAction, ImportPromptContext, ImportSettings } from '@/app/ImportPrompt';
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
	<div class="flexrow">
		<div class="section" style="width: auto" v-for="key in Object.keys(context.app.settings)">
			<div class="section-head">{{ key }}</div>
			<div style="white-space: nowrap">
				Skip
				<label class="switch">
					<input
						:name="key"
						type="radio"
						:checked="(context.app.settings as any)[key] === ImportAction.Skip"
					/>
					<span class="slider round"></span>
				</label>
			</div>
			<div style="white-space: nowrap">
				Replace
				<label class="switch">
					<input
						:name="key"
						type="radio"
						:checked="(context.app.settings as any)[key] === ImportAction.Replace"
					/>
					<span class="slider round"></span>
				</label>
			</div>
			<div style="white-space: nowrap">
				NoReplace
				<label class="switch">
					<input
						:name="key"
						type="radio"
						:checked="(context.app.settings as any)[key] === ImportAction.NoReplace"
					/>
					<span class="slider round"></span>
				</label>
			</div>
			<div style="white-space: nowrap">
				Merge
				<label class="switch">
					<input
						:name="key"
						type="radio"
						:checked="(context.app.settings as any)[key] === ImportAction.Merge"
					/>
					<span class="slider round"></span>
				</label>
			</div>
		</div>
	</div>
	<div>SR6 JSON: <input id="pick-file" type="button" value="Select File" @click.prevent="click()" /></div>
</template>

<style lang="scss" scoped></style>
