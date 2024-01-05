<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import SpellDataModel from '@/item/data/SpellDataModel';
import * as rollers from '@/roll/Rollers';
import { SR6RollData } from '@/roll/SR6Roll';

import { toRaw, computed } from 'vue';

const props = defineProps<{
	actor: SR6Actor;
	roll: SR6RollData;
}>();

const data = props.roll as rollers.SpellRollData;
const spell = computed(() => toRaw(props.actor).item<SpellDataModel>(data.spellId)!);

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();
emit('setText', {
	title: `Roll Spell (${spell.value.name})`,
	hint: '',
});
</script>

<template>
	<div class="section">
		<div class="section-head">Adjust Spell</div>
		<table>
			<tr>
				<td style="width: 1%">
					<label class="switch">
						<input type="checkbox" />
						<span class="slider round"></span>
					</label>
				</td>
				<td>Amp Up</td>
				<td>
					This is for Combat spells only. For each point of base damage the caster wants to add to a Combat
					spell, increase the drain of that casting by 2.
				</td>
			</tr>
			<tr>
				<td style="width: 1%">
					<label class="switch">
						<input type="checkbox" />
						<span class="slider round"></span>
					</label>
				</td>
				<td>Increase Area</td>
				<td>
					Area-effect spells have a base ef- fect of a sphere with a two-meter radius. For each increase of 2
					meters in the radius of the area of effect, increase the drain of the casting by 1.
				</td>
			</tr>
			<tr>
				<td style="width: 1%">
					<label class="switch">
						<input type="checkbox" />
						<span class="slider round"></span>
					</label>
				</td>
				<td>Shift Area</td>
				<td>
					This can only be done with certain area-effect spells. The caster can shift the area a sustained
					spell is affecting to another area within spell range. Spells that can have the area shifted are
					noted in the spell description. This requires a Minor Action and can be done any time. It does not
					cause drain.
				</td>
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/mixins/backgrounds.scss';
@use '@scss/vars/colors.scss';
@use '@scss/vars/sheet.scss';
</style>
