/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { ChatContext, ChatMessageContext } from '@/chat/SR6ChatMessage';
import ChatHeader from '@/chat/vue/ChatHeader.vue';
import { EdgeBoostType } from '@/edge';
import SpendEdgePostRollPrompt from '@/roll/SpendEdgePostRollPrompt';
import { enumKeys } from '@/util';
import FloatCollapse from '@/vue/components/FloatCollapse.vue';
import Localized from '@/vue/components/Localized.vue';
import { inject, toRaw, onBeforeMount, onUpdated, ref } from 'vue';

const context = inject<ChatMessageContext>(ChatContext)!;
const text = ref({
	title: context.test ? game.i18n.localize(`SR6.Tests.${context.test.type}.Name`) : 'Roll',
	hint: '',
});

function setText(value: { title: string; hint: string }) {
	text.value = value;
}

const expandDice = ref(false);

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

onUpdated(update);
onBeforeMount(update);
</script>

<template>
	<ChatHeader :actor="context.actor" :token="context.token" :text="text" />
	<div class="chat-message-body">
		<template v-if="context.message.isRoll">
			<template v-if="context.test?.roll?.options?.initiativeRoll">
				<div class="roll-formula">{{ context.test?.roll?.formula }}</div>
				<div style="text-align: center; font-weight: bold">{{ context.test?.roll?.total }}</div>
			</template>
			<template v-else-if="context.roll && !context.test">
				<section
					class="flexcol roll-information"
					@mouseenter.prevent="expandDice = true"
					@mouseleave.prevent="expandDice = false"
				>
					<div class="roll-formula">{{ context.roll?.formula }}</div>
					<div class="hits">
						<i class="bold">{{ context.roll?.hits }}</i> hits
					</div>

					<!-- Glitch/Critical Glitch -->

					<div class="glitches">
						<div class="critical-glitch" v-if="context.roll?.is_critical_glitch">
							<Localized label="SR6.Labels.CriticalGlitch" />
						</div>
						<div class="glitch" v-else-if="context.roll?.is_glitch">
							<Localized label="SR6.Labels.Glitch" />
						</div>
					</div>

					<!-- Dice -->
					<FloatCollapse :when="expandDice" class="dice-details">
						<i class="dice" v-for="num in context.roll?.sides" v-bind:key="num" :data-die="num">&nbsp; </i>
					</FloatCollapse>
				</section>
			</template>
			<template v-else-if="context.test">
				<section
					class="flexrow roll-information"
					@mouseenter.prevent="expandDice = true"
					@mouseleave.prevent="expandDice = false"
				>
					<div class="roll-formula">{{ context.test?.data.pool }}d6</div>
					<div class="hits">
						<i class="bold">{{ context.test?.roll?.hits }}</i> hits
					</div>

					<!-- Glitch/Critical Glitch -->

					<div class="glitches">
						<div class="critical-glitch" v-if="context.test?.roll?.is_critical_glitch">
							<Localized label="SR6.Labels.CriticalGlitch" />
						</div>
						<div class="glitch" v-else-if="context.test?.roll?.is_glitch">
							<Localized label="SR6.Labels.Glitch" />
						</div>
					</div>

					<!-- Success/Fail -->
					<div class="result">
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
				<FloatCollapse :when="expandDice" class="dice-details">
					<i class="dice" v-for="num in context.test?.roll!.sides" v-bind:key="num" :data-die="num"
						>&nbsp;
					</i>
				</FloatCollapse>

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
					<div v-if="context.message.isOwner" class="edge-used">
						<template v-if="context.test.data.edgeSpent"
							>Edge Used:
							<Localized
								:label="`SR6.Edge.Boosts.${getEdgeBoostKey(context.test.data.edgeSpent)}.Name`" /></template
						><template v-else>
							<input class="dialog-button" type="button" value="Edge" @click.prevent="promptSpendEdge" />
						</template>
					</div>
				</section>
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

.threshold {
	font-size: 11px;
}
.edge-used {
	font-size: 11px;
	font-weight: bold;
	font-style: italic;
}
</style>
