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
	<div class="matrix-action section">
		<div class="section-head">
			{{ props.name }}
		</div>
		<div class="section">
			<div class="section-head">Conditions</div>
			<table>
				<template v-for="condition in props.action.conditions" :key="condition.name">
					<tr>
						<a><img :src="condition.icon" :alt="condition.name" /></a>
						<td class="title">{{ condition.name }}</td>
						<td>When: {{ condition.activation }}</td>
					</tr>
					<tr>
						<td colspan="99">
							{{ condition.description }}
						</td>
					</tr>
				</template>
			</table>
		</div>
	</div>
</template>

<style lang="scss">
@use '@scss/sheets.scss';
@use '@scss/vars/colors.scss';

.matrix-action {
	img {
		width: 32px;
		height: 32px;
	}

	.title {
		font-weight: bold;
	}
}
</style>
