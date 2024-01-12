<script lang="ts" setup>
import { getCoreMatrixPrograms } from '@/item/data';
import { GearMatrixDataModel } from '@/item/data/gear/GearDataModel';
import MatrixProgramDataModel, { MatrixProgramType } from '@/item/data/MatrixProgramDataModel';
import SR6Item from '@/item/SR6Item';
import { computed, toRaw, ref } from 'vue';
import { Collapse } from 'vue-collapsed';

const emit = defineEmits<{
	(e: 'change', model: GearMatrixDataModel): void;
}>();
const props = defineProps<{
	model: GearMatrixDataModel;
}>();

const isGM = computed(() => game.user!.isGM);

const basicPrograms = computed(() =>
	toRaw(props.model)
		.actor!.items.filter((i) => i.type === 'matrix_program')
		.map((i) => i as SR6Item<MatrixProgramDataModel>)
		.filter((i) => i.systemData.type === MatrixProgramType.Basic)
		.sort((a, b) => a.name.localeCompare(b.name))
);
const hackingPrograms = computed(() =>
	toRaw(props.model)
		.actor!.items.filter((i) => i.type === 'matrix_program')
		.map((i) => i as SR6Item<MatrixProgramDataModel>)
		.filter((i) => i.systemData.type === MatrixProgramType.Hacking)
		.sort((a, b) => a.name.localeCompare(b.name))
);

const programRows = computed(() => Math.max(basicPrograms.value.length, hackingPrograms.value.length));
const showProgramDescription = ref({
	name: 'asdf',
	index: 0,
});
const isCollapsed = ref(false);

async function addAllPrograms() {
	await toRaw(props.model).actor!.createEmbeddedDocuments('Item', await getCoreMatrixPrograms());
	emit('change', props.model);
}

async function reset() {
	await props.model.clearProgramSlots();
	emit('change', props.model);
}

async function toggleProgram(ev: Event, program: SR6Item<MatrixProgramDataModel>): Promise<void> {
	if (props.model.programSlots.available <= 0) {
		ui.notifications.error!('Maximum program slots reached');
		(ev.target as HTMLInputElement).checked = false;
		return;
	}

	if (!isLoaded(program)) {
		await props.model.setProgramSlots([...props.model.programSlots.programs, program]);
	} else {
		await props.model.setProgramSlots(props.model.programSlots.programs.filter((p) => p.uuid !== program.uuid));
	}
	emit('change', props.model);
}

function isLoaded(program: SR6Item<MatrixProgramDataModel>): boolean {
	return props.model.programSlots.programs.find((p) => p.uuid === program.uuid) !== undefined;
}

function expandDescription(name: string, index: number) {
	if (showProgramDescription.value.name === name && showProgramDescription.value.index === index) {
		showProgramDescription.value = { name: 'asdf', index: 0 };
	} else {
		showProgramDescription.value = { name: name, index: index };
	}
}

function descriptionStyle(name: string, index: number): string {
	if (showProgramDescription.value.name === name && showProgramDescription.value.index === index) {
		return '';
	} else {
		return 'display: none';
	}
}
function nameStyle(name: string, index: number): string {
	if (showProgramDescription.value.name === name && showProgramDescription.value.index === index) {
		return 'font-weight: bold; font-style: italic';
	} else {
		return '';
	}
}
</script>

<template>
	<div class="section matrix-program-slots">
		<div class="section-head">
			<a @click="isCollapsed = !isCollapsed"> <i class="fa-solid fa-down-from-line"></i> Active Programs</a>
			&nbsp;
			<div class="slot-text">
				Available Slots:
				<i style="font-weight: bold"
					>{{ props.model.programSlots.available }} / {{ props.model.programSlots.total }}</i
				>
				&nbsp;<a @click.prevent="reset"><i class="fa fa-refresh" style="margin-left: auto"></i></a>
				<a v-if="isGM && basicPrograms.length == 0" class="fas fa-infinity" @click.prevent="addAllPrograms" />
			</div>
		</div>
		<Collapse :when="isCollapsed">
			<table>
				<template v-for="n in programRows" :key="n">
					<tr>
						<template v-if="basicPrograms[n]">
							<td :title="basicPrograms[n].systemData.description" class="selector">
								<label class="switch">
									<input
										type="checkbox"
										@change.prevent="(ev) => toggleProgram(ev, basicPrograms[n])"
										:checked="isLoaded(basicPrograms[n])"
									/>
									<span class="slider round"></span>
								</label>
							</td>
							<td
								class="program-name"
								:style="nameStyle('basic', n)"
								:title="basicPrograms[n].systemData.description"
							>
								<a @click="expandDescription('basic', n)">{{ basicPrograms[n].name }}</a>
							</td>
						</template>
						<template v-else>
							<td></td>
							<td></td>
						</template>

						<template v-if="hackingPrograms[n]">
							<td :title="hackingPrograms[n].systemData.description" class="selector">
								<label class="switch">
									<input
										type="checkbox"
										@change.prevent="(ev) => toggleProgram(ev, hackingPrograms[n])"
										:checked="isLoaded(hackingPrograms[n])"
									/>
									<span class="slider round"></span>
								</label>
							</td>
							<td
								class="program-name"
								:style="nameStyle('hacking', n)"
								:title="hackingPrograms[n].systemData.description"
							>
								<a @click="expandDescription('hacking', n)">{{ hackingPrograms[n].name }}</a>
							</td>
						</template>
						<template v-else>
							<td></td>
							<td></td>
						</template>
					</tr>
					<tr class="description" :style="descriptionStyle('basic', n)">
						<td colspan="4" class="description">
							{{ basicPrograms[n] ? basicPrograms[n].systemData.description : '' }}
						</td>
					</tr>
					<tr class="description" :style="descriptionStyle('hacking', n)">
						<td colspan="4" class="description">
							{{ hackingPrograms[n] ? hackingPrograms[n].systemData.description : '' }}
						</td>
					</tr>
				</template>
			</table>
		</Collapse>
	</div>
</template>

<style lang="scss">
@use '@scss/sheets.scss';
@use '@scss/vars/colors.scss';

.matrix-program-slots {
	width: fit-content;

	.slot-text {
		margin-left: auto;
		font-size: 10px;
		font-weight: normal;
	}

	table {
		padding: 0;
		margin: 0;
		table-layout: fixed;
		width: auto;

		.description {
			margin-left: auto;
			font-size: 10px;
			font-weight: normal;
			width: 0;
			overflow: hidden;
			max-width: 75px;
		}

		.selector {
			width: 30px;
		}

		.program-name {
			font-size: 11px;
			text-align: left;
			padding-right: 10px;
			white-space: nowrap;
		}
	}
}
</style>
