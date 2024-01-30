/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { MonitorType } from '@/actor/data/MonitorsDataModel';
import { ChatContext, ChatMessageContext } from '@/chat/SR6ChatMessage';
import ChatHeader from '@/chat/vue/ChatHeader.vue';
import { EdgeBoostType } from '@/edge';
import SpendEdgePostRollPrompt from '@/roll/SpendEdgePostRollPrompt';
import { AttackTestData } from '@/test/AttackTestData';
import { enumKeys, getSelfOrSelectedActors } from '@/util';
import FloatCollapse from '@/vue/components/FloatCollapse.vue';
import Localized from '@/vue/components/Localized.vue';
import { inject, onBeforeMount, onUpdated, ref, toRaw } from 'vue';

const context = inject<ChatMessageContext>(ChatContext)!;
const text = ref({
	title: context.test ? game.i18n.localize(`SR6.Tests.${context.test.type}.Name`) : 'Roll',
	hint: '',
});

function setText(value: { title: string; hint: string }) {
	text.value = value;
}

const expandDice = ref(false);
const showTestContextMenu = ref(false);

function update() {
	if (context.message.isRoll) {
		if (context.test?.roll?.options?.initiativeRoll) {
			text.value.title = 'Initiative';
			text.value.hint = '';
		}
	} else {
		text.value.title = '';
		text.value.hint = '';
	}
}

async function promptSpendEdge() {
	const boost = await SpendEdgePostRollPrompt.prompt(toRaw(context.message), toRaw(context.test!));
	if (boost) {
		// Apply the boost to the test and save it to the message
		// TODO: we should really do this somewhere else
		const test = toRaw(context.test!);
		await toRaw(test).applyEdgeBoost(boost);
		const data = test.toJSON();
		await context.message.setFlag('sr6', 'testData', data);
	}
}

function getEdgeBoostKey(boost: EdgeBoostType): undefined | string {
	return enumKeys(EdgeBoostType).find((x) => EdgeBoostType[x] === boost);
}

function getDamage(): number {
	return context.test?.damage || 0;
}

async function applyDamage(type: MonitorType) {
	for (const actor of getSelfOrSelectedActors()) {
		await toRaw(context.test!.actor.systemData.monitors.applyDamage(type, getDamage()));
	}
}

async function applyHealing(type: MonitorType) {
	for (const actor of getSelfOrSelectedActors()) {
		await toRaw(context.test!.actor.systemData.monitors.applyHeal(type, getDamage()));
	}
}

onUpdated(update);
onBeforeMount(update);
</script>

<template>
	<ChatHeader :actor="context.actor" :token="context.token" :text="text" />
	<div class="chat-message-body" @mouseenter="showTestContextMenu = true" @mouseleave="showTestContextMenu = false">
		<template v-if="context.message.isRoll">
			<template v-if="context.test?.roll?.options?.initiativeRoll">
				<div class="roll-formula">{{ context.test?.roll?.formula }}</div>
				<div style="text-align: center; font-weight: bold">{{ context.test?.roll?.total }}</div>
			</template>
			<template v-else-if="context.roll">
				<section
					class="flexrow roll-information"
					@mouseenter.prevent="expandDice = true"
					@mouseleave.prevent="expandDice = false"
				>
					<div class="roll-formula">{{ context.test ? context.test?.data.pool : context.roll.pool }}d6</div>
					<div class="hits">
						<i class="bold">{{ context.test ? context.test?.roll?.hits : context.roll.hits }}</i> hits
					</div>

					<!-- Glitch/Critical Glitch -->

					<div class="glitches" v-if="context.test">
						<div class="critical-glitch" v-if="context.test?.roll?.is_critical_glitch">
							<Localized label="SR6.Labels.CriticalGlitch" />
						</div>
						<div class="glitch" v-else-if="context.test?.roll?.is_glitch">
							<Localized label="SR6.Labels.Glitch" />
						</div>
					</div>

					<!-- Success/Fail -->
					<div class="result" v-if="context.test">
						<div class="success" v-if="context.test?.roll?.threshold && context.test?.roll.success">
							<Localized label="SR6.Labels.Success" />
						</div>
						<div class="failure" v-else-if="!context.test?.roll?.success">
							<Localized label="SR6.Labels.Failure" />
						</div>
					</div>
				</section>
				<div class="threshold" v-if="context.test?.roll?.threshold">
					Threshold: <i class="bold">{{ context.test?.roll.threshold }}</i>
				</div>

				<!-- Dice -->
				<FloatCollapse v-if="context.test" :when="expandDice" class="dice-details">
					<i class="dice" v-for="num in context.test?.roll!.sides" v-bind:key="num" :data-die="num"
						>&nbsp;
					</i>
				</FloatCollapse>
				<FloatCollapse v-else :when="expandDice" class="dice-details">
					<i class="dice" v-for="num in context.roll.sides" v-bind:key="num" :data-die="num">&nbsp; </i>
				</FloatCollapse>
			</template>
			<template v-if="context.test">
				<!-- Test Information -->
				<section v-if="context.test" style="min-width: 100%">
					<component
						v-if="context.test.chatComponent"
						:is="context.test.chatComponent?.()"
						:src="context.message"
						:test="context.test"
						:message="context.message"
						@setText="setText"
					/>
					<div v-if="context.test.isOwner" class="edge-used">
						<template v-if="context.test.data.edge?.spent"
							>Edge Used:
							<Localized
								:label="`SR6.Edge.Boosts.${getEdgeBoostKey(context.test.data.edge!.spent!)}.Name`" /></template
						><template v-else>
							<input
								class="dialog-button line"
								type="button"
								value="Spend Edge"
								@click.prevent="promptSpendEdge"
							/>
						</template>
					</div>
				</section>
				<FloatCollapse v-if="getDamage()" :when="showTestContextMenu" class="test-context-menu"
					><div class="damage-physical-bg" :title="`Damage (${getDamage()}P)`">
						<div class="context-button-damage" @click.prevent="applyDamage(MonitorType.Physical)">
							<i class="fa fa-minus fa-lg"></i>
						</div>
					</div>
					<div class="heal-bg" :title="`Heal (${getDamage()}P)`">
						<div class="context-button-heal" @click.prevent="applyHealing(MonitorType.Physical)">
							<i class="fa fa-plus fa-lg"></i>
						</div>
					</div>
					<div class="damage-stun-bg" :title="`Damage (${getDamage()}S)`">
						<div class="context-button-damage" @click.prevent="applyDamage(MonitorType.Stun)">
							<i class="fa fa-minus fa-lg"></i>
						</div>
					</div>
					<div class="damage-stun-bg" :title="`Heal (${getDamage()}S)`">
						<div class="context-button-heal" @click.prevent="applyHealing(MonitorType.Stun)">
							<i class="fa fa-plus fa-lg"></i>
						</div>
					</div>
				</FloatCollapse>
			</template>
		</template>
		<!-- Normal chat message -->
		<div v-else>
			<div class="plain-message" v-html="context.message.content"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';
@use '@/scss/chat/chat-message';

.threshold {
	font-size: 11px;
}
.edge-used {
	font-size: 11px;
	font-weight: bold;
	font-style: italic;
}

.heal-bg {
	background-color: rgba(147, 250, 165, 0.7);
	padding: 3px;
	display: inline-block;
}
.damage-physical-bg {
	background-color: rgba(255, 204, 203, 0.7);
	padding: 3px;
	display: inline-block;
}
.damage-stun-bg {
	background-color: rgba(137, 196, 244, 0.7);
	padding: 3px;
	display: inline-block;
}

.heal {
	background-color: green;
}
.damage {
	background-color: red;
}

.test-context-menu {
	bottom: 50px;
}
.context-button {
	&:hover {
		font-weight: bold;
		text-shadow: 0 0 5px colors.$red;
	}
}
.context-button-damage {
	@extend .context-button;
	&:hover {
		@extend .damage;
	}
}
.context-button-heal {
	@extend .context-button;
	&:hover {
		@extend .heal;
	}
}
</style>
