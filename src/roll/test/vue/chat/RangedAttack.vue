/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import RangedAttackTest from '@/roll/test/RangedAttackTest';
import { getSelfOrSelectedActors } from '@/util';
import Targets from '@/vue/chat/Targets.vue';
import Localized from '@/vue/components/Localized.vue';
import { Collapse } from 'vue-collapsed';
import { toRaw, ref } from 'vue';

const emit = defineEmits<{
	(e: 'setText', value: { title: string; hint: string }): void;
}>();

const props = defineProps<{
	test: RangedAttackTest;
}>();

async function executeOpposedTest() {
	for (const actor of getSelfOrSelectedActors()) {
		await toRaw(props.test).opposed?.(actor).execute();
	}
}

const visibility = ref({
	description: {
		distance: false,
		damage: false,
		firemode: false,
	},
});

function isTargetOwner(): boolean {
	if (props.test.targets.length == 0) {
		return true;
	}
	return props.test.targets.find((target: SR6Actor) => target.isOwner) != undefined;
}

emit('setText', {
	title: `Roll Attack (${props.test.weapon.name})`,
	hint: ``,
});
</script>

<template>
	<div class="flexrow chat-ranged-attack">
		<div class="attack-details">
			<div class="damage">
				<a
					@mouseenter.prevent="visibility.description.damage = true"
					@mouseleave.prevent="visibility.description.damage = false"
				>
					<Localized label="SR6.Combat.Damage" />:

					<i class="dv"
						>{{ toRaw(test).damage() }} {{ toRaw(test.weapon).systemData.damageData.damageType }}</i
					>
					&nbsp;
				</a>
				<Collapse class="formula" :when="visibility.description.damage">
					{{ toRaw(test).baseDamage() }} + {{ test.roll.hits }} = {{ toRaw(test).damage() }}
				</Collapse>
			</div>
			<div class="distance">
				<a
					@mouseenter.prevent="visibility.description.distance = true"
					@mouseleave.prevent="visibility.description.distance = false"
				>
					<Localized label="SR6.Combat.Distance" />:
					<Localized
						class="data-value"
						label="SR6.Combat.Distances.{key}"
						:args="{ key: test.data.distance }"
					/>
				</a>
				<Collapse :when="visibility.description.distance">
					<Localized
						class="formula"
						label="SR6.Combat.DistanceDescriptions.{key}"
						:args="{ key: test.data.distance }"
					/>
				</Collapse>
			</div>
			<div class="firemode">
				<a
					@mouseenter.prevent="visibility.description.firemode = true"
					@mouseleave.prevent="visibility.description.firemode = false"
				>
					<Localized label="SR6.Combat.FireMode" />:
					<Localized
						class="data-value"
						label="SR6.Combat.FireModes.{key}.Name"
						:args="{ key: test.data.firemode }"
					/>
				</a>
				<Collapse :when="visibility.description.firemode">
					<Localized
						class="formula"
						label="SR6.Combat.FireModes.{key}.Description"
						:args="{ key: test.data.firemode }"
					/>
				</Collapse>
			</div>
		</div>
		<Targets v-if="test.targets.length > 0" :targets="test.targets" />
		<input
			v-if="isTargetOwner()"
			class="dialog-button"
			type="button"
			value="Roll Defense"
			@click.prevent="executeOpposedTest"
		/>
	</div>
</template>

<style lang="scss" scoped>
.chat-ranged-attack {
	font-size: 12px;

	.attack-details {
		padding-top: 5px;
		padding-bottom: 5px;
		min-width: 100%;
	}
}
</style>
