/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { MatrixActionTest } from '@/test/MatrixTests';
import Localized from '@/vue/components/Localized.vue';
import { ref } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: MatrixActionTest;
}>();

const actionName = ref(props.test.matrixAction.name);
const actionDescription = ref(props.test.matrixAction.systemData.description);

emit('setText', {
	title: `Matrix Action (${actionName.value})`,
	hint: ``,
});
</script>

<template>
	<div class="flexcol matrix-action-test-prompt">
		<div class="section">
			<div class="section-head">Description</div>
			{{ actionDescription }}
		</div>
		<div class="section">
			<div class="section-title"><Localized label="SR6.Labels.Information" /></div>
			<table>
				<tr>
					<td>
						<template v-if="test.matrixAction.systemData.formulas.damage">
							<Localized label="SR6.Combat.Damage" /> Formula:
							{{ test.matrixAction.systemData.formulas.damage }}
						</template>
					</td>
					<td>Base <Localized label="SR6.Combat.Damage" />: {{ test.data.damage }}</td>
				</tr>
				<tr>
					<td><Localized label="SR6.Combat.AttackRating" />: {{ test.data.attackRating }}</td>
					<td><Localized label="SR6.Combat.DefenseRating" />: TODO</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.matrix-action-test-prompt {
	font-size: 12px;
}
</style>
