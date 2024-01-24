/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { DamageType } from '@/data';
import RangedDefenseTest from '@/test/RangedDefenseTest';
import Localized from '@/vue/components/Localized.vue';
import { toRaw, ref } from 'vue';
import { Collapse } from 'vue-collapsed';
import SR6Item from '@/item/SR6Item';
import WeaponDataModel from '@/item/data/gear/WeaponDataModel';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
const props = defineProps<{
	test: RangedDefenseTest;
}>();

const visibility = ref({
	damageFormula: false,
});

const damageValue = ref(toRaw(props.test.opposedTest).damage(props.test.roll!.hits));

async function executeSoakTest() {
	showRoll.value = false;
	await toRaw(props.test.opposedTest).soak(toRaw(props.test)).execute();
}

emit('setText', {
	title: `Defense (${props.test.opposedTest.type})`,
	hint: ``,
});

function getDamageTypeForTest(test: RangedDefenseTest): DamageType {
	return toRaw(test.opposedTest.item! as SR6Item<WeaponDataModel>).systemData.damageData.damageType;
}

const showRoll = ref(true);
</script>

<template>
	<div class="flexrow chat-opposed-test">
		<div class="line">Defending against {{ test.opposedTest.actor.name }} {{ test.opposedTest.item?.name }}</div>
		<div v-if="!test.roll?.success">
			<hr />
			<div v-if="test.opposedTest.damage" class="line">
				<a
					@mouseenter.prevent="visibility.damageFormula = true"
					@mouseleave.prevent="visibility.damageFormula = false"
				>
					<Localized label="SR6.Combat.Damage" />:

					<i class="dv">{{ damageValue }} {{ getDamageTypeForTest(test) }}</i>
				</a>
				<Collapse class="formula" :when="visibility.damageFormula">
					{{ toRaw(test.opposedTest).damage?.(0) }} - {{ test.roll?.hits }} =
					{{ damageValue }}
				</Collapse>
			</div>
		</div>
		<input
			v-if="showRoll && test.isOwner && !test.roll?.success"
			class="dialog-button line"
			type="button"
			value="Soak Damage"
			@click.prevent="executeSoakTest"
		/>
	</div>
</template>

<style lang="scss" scoped>
.chat-opposed-test {
	padding-top: 5px;
	font-size: 12px;

	.line {
		min-width: 100%;
	}
}
</style>
