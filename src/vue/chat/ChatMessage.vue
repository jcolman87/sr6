/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import { ChatContext, ChatMessageContext } from '@/chat/SR6ChatMessage';
import ChatHeader from '@/vue/chat/ChatHeader.vue';
import Localized from '@/vue/components/Localized.vue';
import { inject, ref } from 'vue';
import { Collapse } from 'vue-collapsed';

const context = inject<ChatMessageContext>(ChatContext)!;

function testClick() {
	console.log('Hello world!');
}

const title = ref(context.test ? game.i18n.localize(`SR6.Tests.${context.test.type}.Name`) : 'Roll');
const expandDice = ref(false);
</script>

<template>
	<ChatHeader :actor="context.actor" :token="context.token" :title="title" />
	<div class="chat-message-body">
		<template v-if="context.message.isRoll">
			<section
				class="flexrow roll-information"
				@mouseenter.prevent="expandDice = true"
				@mouseleave.prevent="expandDice = false"
			>
				<div class="roll-formula">{{ context.roll?.pool }}d6</div>
				<div class="hits">
					<i class="bold">{{ context.roll?.hits }}</i> hits
				</div>
				<!-- Success/Fail -->
				<div>
					<div class="success" v-if="context.roll?.threshold && context.roll?.success">
						<Localized label="SR6.Labels.Success" />
					</div>
					<div class="failure" v-else-if="context.roll?.threshold && !context.roll?.success">
						<Localized label="SR6.Labels.Failure" />
					</div>
				</div>

				<!-- Glitch/Critical Glitch -->

				<div>
					<div class="glitch" v-if="context.roll?.is_critical_glitch">
						<Localized label="SR6.Labels.CriticalGlitch" />
					</div>
					<div class="glitch" v-else-if="context.roll?.is_glitch">
						<Localized label="SR6.Labels.Glitch" />
					</div>
				</div>
			</section>

			<!-- Dice -->
			<Collapse :when="expandDice" as="section" class="dice-details">
				<i class="dice" v-for="num in context.roll!.sides" v-bind:key="num" :data-die="num">&nbsp; </i>
			</Collapse>

			<!-- Test Information -->
			<section v-if="context.test">
				Hello World <a @click.prevent="testClick()">{{ context.test.type }}</a>
			</section>
		</template>
		<!-- Normal chat message -->
		<div v-else>
			<div class="plain-message" v-html="context.message.content"></div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors.scss';

.chat-message-body {
	.dice-details {
		width: 100%;
		height: 24px;
	}

	.roll-information:hover,
	.roll-information:active {
		box-shadow: inset 0 0 10px colors.$red;
	}

	.roll-information {
		border-top: 1px solid;
		border-bottom: 1px solid;

		%result-text {
			font-weight: bold;
			font-size: 14px;
			white-space: nowrap;
		}

		.hits {
			flex: 2;
		}

		.failure {
			@extend %result-text;
			color: colors.$red;
		}

		.success {
			@extend %result-text;
			color: colors.$green;
		}

		.glitch {
			@extend %result-text;
			font-size: 20px;
			color: colors.$glitch;
		}

		.critical-glitch {
			@extend %result-text;
			font-size: 20px;
			color: colors.$critical-glitch;
		}
	}

	.bold {
		font-weight: bold;
	}

	.formula {
		font-style: italic;
		font-size: 11px;
	}

	.dv {
		font-weight: bold;
		color: colors.$red;
	}

	.data-value {
		font-weight: bold;
		font-style: italic;
	}

	.chat-target-box {
		//background-color: colors.$light-green;
		display: grid;

		grid-template-columns: minmax(90px, 10px) minmax(90px, 10px) minmax(90px, 10px);

		//gap: 1rem;

		div {
			text-align: center;
			background: colors.$lighter-blue;
			padding: 0.2rem;
			border-radius: 1rem;

			&:hover {
				background: colors.$light-blue;
				font-weight: bold;
				text-shadow: 0 0 5px #ff0000;
			}
		}
	}

	.chat-roll-menu {
		float: initial;
		position: absolute;
		display: none;
		margin-top: -16px;

		a {
			width: 32px;
			height: 16px;
		}
		.heal {
			background-color: green;
		}
		.damage {
			background-color: red;
		}
	}
}
</style>
