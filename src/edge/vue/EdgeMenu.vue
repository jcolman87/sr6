<script lang="ts" setup>
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import SR6Actor from '@/actor/SR6Actor';
import { ActivationPhase } from '@/data';
import { EdgeBoostType, IEdgeBoost } from '@/edge';
import { ITest } from '@/test';
import Localized from '@/vue/components/Localized.vue';
import { getEventValue } from '@/vue/directives';
import { ref } from 'vue';
import { Collapse } from 'vue-collapsed';

const props = withDefaults(
	defineProps<{
		actor: SR6Actor<BaseActorDataModel>;
		test: Maybe<ITest>;
		phase: ActivationPhase;
		show: boolean;
	}>(),
	{
		phase: ActivationPhase.Any,
		show: true,
	},
);

const emit = defineEmits<{
	(e: 'setEdgeBoost', value: { boost: null | IEdgeBoost }): void;
}>();

const edgeBoost = ref<IEdgeBoost | null>(null);

function getBoostsForPhase(phase: ActivationPhase): IEdgeBoost[] {
	return (
		Object.keys(CONFIG.sr6.types.edge)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.map((key) => new (CONFIG.sr6.types.edge[key] as any)())
			.filter((boost) => boost.phase === phase || boost.phase === ActivationPhase.Any)
	);
}

function selectEdgeBoost(ev: Event) {
	const key = getEventValue(ev) as string;
	if (key) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		edgeBoost.value = new (CONFIG.sr6.types.edge[key] as any)();
	} else {
		edgeBoost.value = null;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit('setEdgeBoost', edgeBoost.value as any);
}

function getEdgeBoostKey(boost: IEdgeBoost): undefined | string {
	return Object.keys(EdgeBoostType).find((x) => EdgeBoostType[x as keyof typeof EdgeBoostType] === boost.type);
}

function localize(val: string): string {
	return game.i18n.localize(val);
}

const showMenu = ref(props.show);

function edgeAvailable(): number {
	if (props.test?.availableEdge) {
		return props.test?.availableEdge;
	}
	return props.actor.systemData.monitors.edge.value;
}
</script>

<template>
	<div class="edge-selection-menu">
		<div class="section-head"><a @click.prevent="showMenu = !showMenu">Spend Edge</a></div>
		<Collapse class="edge-selection-content" :when="showMenu">
			<div>
				<label><Localized label="SR6.Edge.EdgeBoost" /></label>
				<select @change="selectEdgeBoost">
					<option value="null">-</option>
					<template v-for="boost in getBoostsForPhase(props.phase)" v-bind:key="boost.type">
						<option
							:value="boost.type"
							:title="localize(`SR6.Edge.Boosts.${getEdgeBoostKey(boost)}.Description`)"
							:disabled="boost.cost > edgeAvailable()"
						>
							<Localized :label="`SR6.Edge.Boosts.${getEdgeBoostKey(boost)}.Name`" /> ({{ boost.cost }})
						</option>
					</template>
				</select>
				<label><Localized label="SR6.Edge.EdgeAction" /></label>
				<select :disabled="edgeBoost?.type !== EdgeBoostType.Action">
					<option>-</option>
					<option>Balls</option>
				</select>
				<Collapse :when="edgeBoost != null" v-if="edgeBoost != null">
					<div class="edge-description">
						<div class="section-head"><Localized label="SR6.Labels.Description" /></div>
						<Localized
							class="formula"
							:label="`SR6.Edge.Boosts.${getEdgeBoostKey(edgeBoost)}.Description`"
						/>
					</div>
				</Collapse>
				<label><Localized label="SR6.RollPrompt.ConsumeEdge" /></label>
				<label class="switch">
					<input type="checkbox" checked />
					<span class="slider round"></span>
				</label>
			</div>
		</Collapse>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';
@use '@/scss/sheets';

.edge-selection-menu {
	@extend .section;
	min-width: 100%;

	.edge-selection-content {
		display: flex;
		flex-direction: row;
	}

	.edge-description {
		@extend .section;
		min-width: 97%;
	}
}
</style>
