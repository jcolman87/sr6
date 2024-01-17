<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import { EnumAttribute } from '@/actor/data';
import * as rollers from '@/roll/Rollers';

import { BaseRollData } from '@/roll/SR6Roll';
import Localized from '@/vue/components/Localized.vue';

const props = defineProps<{
	actor: SR6Actor<LifeformDataModel>;
	roll: BaseRollData;
}>();

const data = props.roll as rollers.AttributeRollData;
const attribute_name = EnumAttribute[data.attribute as keyof typeof EnumAttribute];

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Attribute (${attribute_name})`,
	hint: '',
});
</script>

<template>
	<label><Localized label="SR6.Labels.Attribute" /></label>
	<Localized :label="`SR6.Attributes.${attribute_name}`" />
</template>
