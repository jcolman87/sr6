/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { ChatContext, ChatMessageContext } from '@/chat/SR6ChatMessage';
import ChatHeader from '@/vue/chat/ChatHeader.vue';
import Localized from '@/vue/components/Localized.vue';
import { inject, onBeforeMount, onUpdated, ref, toRaw } from 'vue';
import { Collapse } from 'vue-collapsed';

const context = inject<ChatMessageContext>(ChatContext)!;

const text = ref({
	title: context.test ? game.i18n.localize(`SR6.Tests.${context.test.type}.Name`) : 'Roll',
	hint: '',
});

function testClick() {
	console.log('Hello world!', context);
}

function setText(value: { title: string; hint: string }) {
	text.value = value;
}

const expandDice = ref(false);

function update() {
	if (context.roll?.options?.initiativeRoll) {
		text.value.title = 'Initiative';
		text.value.hint = 'balls";';
	}
}

onUpdated(update);
onBeforeMount(update);
console.log('wtf', toRaw(context.roll));
</script>

<template>
	<ChatHeader :actor="context.actor" :token="context.token" :text="text" />
	<div class="chat-message-body">
		<template v-if="context.message.isRoll">
			<template v-if="context.roll?.options?.initiativeRoll">
				<div style="text-align: center; font-weight: bold">{{ context.roll?.total }}</div></template
			><template v-else>
				<section
					class="flexrow roll-information"
					@mouseenter.prevent="expandDice = true"
					@mouseleave.prevent="expandDice = false"
					@click.prevent="testClick"
				>
					<div class="roll-formula">{{ context.roll?.pool }}d6</div>
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

					<!-- Success/Fail -->
					<div class="result">
						<div class="success" v-if="context.roll?.threshold && context.roll?.success">
							<Localized label="SR6.Labels.Success" />
						</div>
						<div class="failure" v-else-if="!context.roll?.success">
							<Localized label="SR6.Labels.Failure" />
						</div>
					</div>
				</section>

				<!-- Dice -->
				<Collapse :when="expandDice" class="dice-details">
					<i class="dice" v-for="num in context.roll!.sides" v-bind:key="num" :data-die="num">&nbsp; </i>
				</Collapse>

				<!-- Test Information -->
				<section v-if="context.test" style="min-width: 100%">
					<component
						v-if="context.test.chatComponent"
						:is="context.test.chatComponent?.()"
						:test="context.test"
						@setText="setText"
					/>
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
@use '@scss/vars/colors.scss';
</style>
