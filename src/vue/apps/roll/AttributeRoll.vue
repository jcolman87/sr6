<script lang="ts" setup>
import { toRaw } from 'vue';
import { EnumAttribute } from '@/actor/data';
import { RollType, AttributeRollData } from '@/roll';

import LifeformActor from '@/actor/LifeformActor';
import { SR6RollData } from '@/roll/SR6Roll';
import Localized from '@/vue/components/Localized.vue';

const props = defineProps<{
	actor: LifeformActor;
	roll: SR6RollData;
}>();
const data = props.roll as AttributeRollData;
const attribute_name = EnumAttribute[data.attribute as keyof typeof EnumAttribute];

const finishRoll = (pool_modifier: number) => {
	toRaw(props.actor).rollAttribute(data.attribute, pool_modifier);
};
defineExpose({ finishRoll });
</script>

<template>
	<label><Localized label="SR6.Labels.Attribute" /></label>
	{{ data.type }}, <Localized :label="`SR6.Attributes.${attribute_name}`" />
</template>
