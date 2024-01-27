/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import Targets from '@/chat/vue/Targets.vue';
import { isTargetOwner } from '@/test/AttackTestData';
import { MatrixActionTest } from '@/test/MatrixTests';
import { getSelfOrSelectedActors } from '@/util';
import FloatCollapse from '@/vue/components/FloatCollapse.vue';
import Localized from '@/vue/components/Localized.vue';
import { ref, toRaw } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	src: foundry.abstract.Document;
	test: MatrixActionTest;
}>();

const actionName = ref(props.test.matrixAction.name);
const actionDescription = ref(props.test.matrixAction.systemData.description);

const visibility = ref({
	description: false,
	damageFormula: false,
});

emit('setText', {
	title: `Matrix Action (${actionName.value})`,
	hint: ``,
});

async function executeOpposedTest() {
	for (const actor of getSelfOrSelectedActors()) {
		await toRaw(props.test).opposed?.(actor).execute();
	}
}
</script>

<template>
	<div class="flexcol chat-matrix-action-test">
		<div class="action-description">
			<a @mouseenter.prevent="visibility.description = true" @mouseleave.prevent="visibility.description = false"
				>Description</a
			>

			{{ actionDescription }}
		</div>
		<div class="attack-details">
			<div class="damage">
				<a
					@mouseenter.prevent="visibility.damageFormula = true"
					@mouseleave.prevent="visibility.damageFormula = false"
				>
					<Localized label="SR6.Combat.Damage" />:

					<i class="dv">{{ toRaw(test).damage }}</i>
					&nbsp;
				</a>
				<FloatCollapse class="formula" :when="visibility.damageFormula">
					{{ toRaw(test).baseDamage }} + {{ test.roll?.hits }} = {{ toRaw(test).damage }}
				</FloatCollapse>
			</div>
		</div>
		<Targets v-if="test.targets.length > 0" :targets="test.targets" />
		<input
			v-if="test.canDefend && isTargetOwner(test.data)"
			class="dialog-button"
			type="button"
			value="Roll Defense"
			@click.prevent="executeOpposedTest"
		/>
	</div>
</template>

<style lang="scss" scoped>
.chat-matrix-action-test {
	font-size: 12px;

	.attack-details {
		padding-top: 5px;
		padding-bottom: 5px;
		min-width: 100%;
	}
}
</style>
