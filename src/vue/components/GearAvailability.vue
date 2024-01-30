<script setup lang="ts">
import { GearAvailabilityDataModel } from '@/item/data/gear/GearDataModel';
import { getEventValue } from "@/vue/directives";
import { toRaw } from 'vue';

const props = defineProps<{
	avail: GearAvailabilityDataModel;
}>();
const emit = defineEmits<{
	(e: 'change', value: GearAvailabilityDataModel): void;
}>();
</script>

<template>
	<div class="section-head">Availability</div>
	<table>
		<tr>
			<tr>
				<td>Rating:</td>
				<td><input type="number" width="2em" @change="(ev) => {
					avail.rating = getEventValue(ev);
					emit('change', toRaw(props.avail));
				}
				"
				:value="props.avail.rating"
				/></td>
			</tr>
			<td>Illegal:</td>
			<td>
				<label class="switch">
					<input type="checkbox" :checked="avail.illegal" @click="(_ev) => {
						avail.illegal = !avail.illegal;
						emit('change', toRaw(props.avail));
					}"
					/>
					<span class="slider round"></span>
				</label>
			</td>
			<tr>
				<td>License:</td>
				<td><input type="text" @change="(ev) => {
					avail.license = getEventValue(ev)
					emit('change', toRaw(props.avail));
				}"
						   :value="props.avail.license"
				/></td>
			</tr>
		</tr>

	</table>
</template>

<style lang="scss" scoped></style>
