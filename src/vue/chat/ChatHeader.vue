/* eslint-disable vue/multi-word-component-names */
<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import { SR6Token } from '@/token/SR6Token';
import { toRaw } from 'vue';

const props = defineProps<{
	actor: SR6Actor | null;
	token: SR6Token | null;
	title: string;
}>();

async function pingActor() {
	if (props.token) {
		void canvas.ping(props.token.object.center);
		return canvas.animatePan(props.token.object.center);
	}
}

function openActorSheet() {
	void toRaw(props.actor).sheet.render(true);
}
</script>

<template>
	<div class="flexrow chat-message-header">
		<div class="actor-image" v-if="props.actor">
			<a @click.prevent="pingActor()" @dblclick.prevent="openActorSheet()">
				<img
					class="profile-img"
					:src="props.actor.img"
					:title="props.actor.name"
					data-edit="img"
					height="24"
					width="24"
				/>
			</a>
		</div>
		<div class="title">{{ props.title }}</div>
	</div>
	<div>
		<a @click.prevent="pingActor()" @dblclick.prevent="openActorSheet()">{{ props.actor.name }}</a>
	</div>
</template>

<style lang="scss" scoped>
.chat-message-header {
	.actor-image {
		flex: 0 0 auto;
		min-width: 25px;
		width: min-content;
	}

	.title {
		font-size: 16px;
		width: max-content;
		flex-wrap: nowrap;
		text-align: center;
	}
}
</style>
