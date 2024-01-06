<script lang="ts" setup>
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import Editor from '@/vue/components/Editor.vue';

const emit = defineEmits<{
	(e: 'change', category: MatrixActionDataModel): void;
}>();

const props = defineProps<{
	name: string;
	action: MatrixActionDataModel;
}>();
</script>

<template>
	<div class="section">
		<div class="section-head">{{ props.name }}</div>
	</div>
</template>

<style lang="scss">
@use '@scss/sheets.scss';
@use '@scss/vars/colors.scss';

.matrix-action {
}
</style>
