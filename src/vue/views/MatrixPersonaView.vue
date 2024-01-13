<script lang="ts" setup>
import { MatrixSimType } from '@/data/matrix';
import { AdjustableMatrixAttributesDataModel } from '@/data/MatrixAttributesDataModel';
import MatrixPersonaDataModel, { PersonaType } from '@/item/data/feature/MatrixPersonaDataModel';
import Localized from '@/vue/components/Localized.vue';
import MatrixAttributesView from '@/vue/views/MatrixAttributesView.vue';
import MonitorView from '@/vue/views/MonitorView.vue';
import { toRaw } from 'vue';

const emit = defineEmits<{
	(e: 'change', persona: MatrixPersonaDataModel): void;
	(e: 'togglePersona', status: boolean, cb: (checked: boolean) => void): void;
}>();

const props = defineProps<{
	persona: MatrixPersonaDataModel | null;
}>();

async function onAttributesUpdated(attributes: AdjustableMatrixAttributesDataModel) {
	if (props.persona) {
		props.persona.attributes = attributes;
		emit('change', props.persona);
	}
}

async function togglePersona(ev: Event) {
	const target = ev.target as HTMLInputElement;
	emit('togglePersona', target.checked, (checked: boolean): void => {
		target.checked = checked;
	});
}

async function setDeviceDamage(value: number) {
	if (props.persona!.sourceDevice?.systemData.monitors.matrix!.damage === value) {
		await toRaw(props.persona!).sourceDevice?.update({ ['system.monitors.matrix.damage']: 0 });
	} else {
		await toRaw(props.persona!).sourceDevice?.update({ ['system.monitors.matrix.damage']: value });
	}
}

function getPersonaName(): string {
	switch (props.persona!.type) {
		case PersonaType.Living: {
			return 'Living Persona';
		}
		case PersonaType.Device: {
			return props.persona!.sourceDevice!.name;
		}
		case PersonaType.IC: {
			return 'IC';
		}
	}
}
</script>

<template>
	<div class="section matrix-persona">
		<div class="section-head">
			Persona
			<i style="font-style: italic; margin-left: 20px" v-if="props.persona">({{ getPersonaName() }})</i>
			<span style="margin-left: auto; margin-right: 0"
				><label class="switch">
					<input type="checkbox" @change.prevent="togglePersona" :checked="props.persona != null" />
					<span class="slider round"></span> </label
			></span>
		</div>
		<template v-if="props.persona">
			<div class="flexrow">
				<table class="info-table">
					<tr>
						<td class="title">Mode</td>
						<td>
							<select v-model="props.persona.simType" @change.prevent="emit('change', props.persona)">
								<option
									v-for="simType in Object.keys(MatrixSimType)"
									v-bind:key="simType"
									:value="MatrixSimType[simType as keyof typeof MatrixSimType]"
								>
									<Localized :label="`SR6.Matrix.SimType.${simType}`" />
								</option>
							</select>
						</td>
					</tr>
					<tr>
						<td class="title">Initiative</td>
						<td>
							<i class="bold-value"
								>{{ props.persona.initiativeBasis }}
								<span v-if="props.persona.initiativeDice"
									>+ {{ props.persona.initiativeDice }}d6</span
								></i
							>
						</td>
					</tr>
					<tr>
						<td class="title">Attack Rating</td>
						<td class="bold-value">{{ props.persona.attackRating }}</td>
					</tr>
					<tr>
						<td class="title">Defense Rating</td>
						<td class="bold-value">{{ props.persona.defenseRating }}</td>
					</tr>
				</table>
				<div class="flex-break"></div>
				<MonitorView
					v-if="props.persona.sourceDevice"
					:icon="props.persona.sourceDevice.img"
					:monitor="props.persona.sourceDevice.systemData.monitors.matrix!"
					@setDamage="(idx) => setDeviceDamage(idx)"
				/>
				<div class="flex-break"></div>
				<MatrixAttributesView
					v-if="props.persona"
					:attributes="props.persona.attributes"
					@change="onAttributesUpdated"
				/>
			</div>
		</template>
	</div>
</template>

<style lang="scss">
@use '@scss/sheets.scss';
@use '@scss/vars/colors.scss';

.matrix-persona {
	width: 99%;

	.bold-value {
		font-weight: bold;
	}

	.info-table {
		padding: 0;
		margin: 0;

		.title {
			padding-right: 10px;
			width: 1%;
		}

		td {
			overflow: hidden;
			white-space: nowrap;
		}
	}
}
</style>
