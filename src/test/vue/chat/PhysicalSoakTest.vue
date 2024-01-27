/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import PhysicalSoakTest from '@/test/PhysicalSoakTest';
import Localized from '@/vue/components/Localized.vue';
import { Collapse } from 'vue-collapsed';
import { toRaw, ref } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

defineProps<{
	src: foundry.abstract.Document;
	test: PhysicalSoakTest;
}>();

const visibility = ref({
	description: {
		damage: false,
	},
});

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
					{{ toRaw(test).baseDamage() }} - {{ test.roll?.hits }} = {{ toRaw(test).damage() }}
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
