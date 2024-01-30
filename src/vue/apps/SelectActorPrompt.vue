<script lang="ts" setup>
import SR6Actor from '@/actor/SR6Actor';
import { DialogPromptContext } from '@/app/DialogPrompt';
import { pingActor } from '@/vue/directives';
import { RootContext } from '@/vue/SheetContext';
import { inject, computed, ref, toRaw } from 'vue';

const context = inject<DialogPromptContext<SR6Actor, null>>(RootContext)!;

const filters = ref({
	disposition: undefined,
});

const availableActors = computed(() => {
	if (!game.scenes.active) {
		return [];
	}
	return game.scenes.active.tokens
		.filter((token) => {
			return token.actor != null;
		})
		.map((token: Token) => token.actor as SR6Actor);
});

const selectedActor = ref<SR6Actor | undefined>(undefined);

function isSelectedClass(actor: SR6Actor): string {
	return selectedActor.value?.uuid === actor.uuid ? 'actor actor-selected ' : 'actor';
}

function close(actor: SR6Actor | null) {
	context.resolvePromise(toRaw(actor));
}
</script>

<template>
	<div class="flexcol app-select-actor-prompt">
		<table class="actor-list">
			<tr
				v-for="actor in availableActors"
				v-bind:key="actor.uuid"
				@click.prevent="selectedActor = actor"
				:class="isSelectedClass(actor)"
			>
				<td class="actor-image">
					<a @click.prevent="pingActor(actor)">
						<img class="profile-img" :src="actor.img" :title="actor.name" height="64px" width="64px" />
					</a>
				</td>
				<td class="actor-name">{{ actor.name }}</td>
			</tr>
		</table>
		<div>
			<input type="button" class="dialog-button" value="Ok" @click="close(selectedActor)" />
			<input type="button" class="dialog-button" value="Cancel" @click="close(null)" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars/colors';

.app-select-actor-prompt {
	.actor-list {
		//border: 1px red solid;
		width: 500px;
		height: 400px;
		overflow: scroll;

		.actor {
			&:hover {
				background: transparentize(colors.$blue, 0.6);
			}

			.actor-image {
				width: 64px;
			}

			.actor-name {
				text-align: left;
			}
		}

		.actor-selected {
			border: 1px red solid;
		}
	}
}
</style>
