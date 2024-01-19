/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
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
	test: PhysicalSoakTest;
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
console.log('wtf', toRaw(props.test));
emit('setText', {
	title: `Soak Damage`,
	hint: ``,
});
</script>

<template>
	<div class="flexrow chat-physical-soak">
		<div class="attack-details">
			<div class="damage">
				<a
					@mouseenter.prevent="visibility.description.damage = true"
					@mouseleave.prevent="visibility.description.damage = false"
				>
					<Localized label="SR6.Combat.Damage" />:

					<i class="dv">{{ toRaw(test).damage() }}</i>
					&nbsp;
				</a>
				<Collapse class="formula" :when="visibility.description.damage">
					{{ toRaw(test).baseDamage() }} - {{ test.roll.hits }} = {{ toRaw(test).damage() }}
				</Collapse>
			</div>
		</div>
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
