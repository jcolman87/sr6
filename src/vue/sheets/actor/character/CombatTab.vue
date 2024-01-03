<script lang="ts" setup>
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);
</script>

<template>
	<section class="tab-combat">Hello World Combat</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';
</style>
