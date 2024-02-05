<script lang="ts" setup>
import { EnumAttribute } from '@/actor/data';
import { MagicTradition } from '@/data/magic';
import AdeptPowerDataModel from '@/item/data/feature/AdeptPowerDataModel';
import SpellDataModel from '@/item/data/SpellDataModel';
import AttributeTest from '@/test/AttributeTest';
import { SpellCastTest } from '@/test/SpellTests';
import Localized from '@/vue/components/Localized.vue';
import { createNewItem, updateItem, deleteItem } from '@/vue/directives';
import { computed, inject, toRaw } from 'vue';

import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Item from '@/item/SR6Item';
import { ActorSheetContext, RootContext } from '@/vue/SheetContext';

const context = inject<ActorSheetContext<CharacterDataModel>>(RootContext)!;
const system = computed(() => context.data.actor.systemData);

const spells = computed(
	() =>
		toRaw(context.data.actor)
			.items.filter((i) => i.type === 'spell')
			.sort((a, b) => a.name.localeCompare(b.name)) as SR6Item<SpellDataModel>[],
);

const adeptpowers = computed(() =>
	toRaw(context.data.actor)
		.items.filter((i) => i.type === 'adeptpower')
		.map((i) => i as SR6Item<AdeptPowerDataModel>),
);

async function rollSpell(spell: SR6Item<SpellDataModel>) {
	await new SpellCastTest({ actor: toRaw(context.data.actor), item: spell }).execute();
}

async function rollAttribute(attribute: EnumAttribute) {
	await new AttributeTest({ actor: toRaw(context.data.actor), data: { attribute } }).execute();
}
</script>

<template>
	<section class="tab-skills">
		<div class="section section-attr-and-powers">
			<div class="section section-magic-attributes">
				<div class="attributes">
					<div class="attribute" augmented-ui="b-clip-x exe">
						<p><Localized label="SR6.Attributes.magic.Name" /></p>
						<span
							>{{ system.attributes.magic.value }}<br />
							<a @click="rollAttribute(EnumAttribute.magic)"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							></span
						>
						<div class="field">
							<label>Base</label>
							<input
								type="number"
								name="system.attributes.magic.base"
								:value="system.attributes.magic.base"
							/>
						</div>
						<div class="field">
							<label>Mod</label>
							<input
								type="number"
								name="system.attributes.magic.mod"
								:value="system.attributes.magic.mod"
							/>
						</div>
					</div>
					<div class="attribute" augmented-ui="b-clip-x exe">
						<p><Localized label="SR6.Attributes.resonance.Name" /></p>
						<span
							>{{ system.attributes.resonance.value }}<br />
							<a @click="rollAttribute(EnumAttribute.resonance)"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							></span
						>
						<div class="field">
							<label>Base</label>
							<input
								type="number"
								name="system.attributes.resonance.base"
								:value="system.attributes.resonance.base"
							/>
						</div>
						<div class="field">
							<label>Mod</label>
							<input
								type="number"
								name="system.attributes.resonance.mod"
								:value="system.attributes.resonance.mod"
							/>
						</div>
					</div>
					<div class="attribute" augmented-ui="b-clip-x exe">
						<p><Localized label="SR6.Attributes.essence.Name" /></p>
						<span
							>{{ system.attributes.essence.value }}<br />
							<a @click="rollAttribute(EnumAttribute.essence)"
								><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
							></span
						>
						<div class="field">
							<label>Base</label>
							<input
								type="number"
								name="system.attributes.essence.base"
								:value="system.attributes.essence.base"
							/>
						</div>
						<div class="field">
							<label>Mod</label>
							<input
								type="number"
								name="system.attributes.essence.mod"
								:value="system.attributes.essence.mod"
							/>
						</div>
					</div>
				</div>
				<div style="padding-top: 5px">
					<label><Localized label="SR6.Labels.Tradition" /></label>
					<select name="system.magicTradition" :value="system.magicTradition">
						<option value="">Mundane</option>
						<option v-for="[key, value] in Object.entries(MagicTradition)" v-bind:key="key" :value="value">
							<Localized :label="`SR6.Magic.Traditions.${key}`" />
						</option>
					</select>
				</div>
			</div>
			<div class="section section-adeptpowers">
				<div class="section-head">
					<h2 class="section-title"><Localized label="TYPES.Item.adeptpower" /></h2>
					<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'adeptpower')" />
				</div>
				<table>
					<tr v-for="item in adeptpowers" :key="item.id" :title="item.systemData.description">
						<td class="entry">
							<input
								type="text"
								:value="item.name"
								@change="(ev) => updateItem(context.data.actor, item.id, 'name', ev)"
							/>
						</td>
						<td class="actions">
							<a class="fas fa-edit" @click.prevent="item.sheet?.render(true)" /><a
								class="fas fa-trash"
								@click.prevent="deleteItem(item)"
							/>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div class="section section-spells">
			<div class="section-head">
				<h2 class="section-title"><Localized label="TYPES.Item.spell" /></h2>
			</div>
			<table
				class="field-table"
				style="align-self: start; border-collapse: collapse; margin: 0; padding: 0; width: 100%"
			>
				<thead>
					<tr class="field-table">
						<td>Name</td>
						<td style="text-align: center">
							<a class="fas fa-plus" @click.prevent="createNewItem(context.data.actor, 'spell')" />
						</td>
					</tr>
				</thead>
				<tr v-for="spell in spells" :key="spell.id" :title="spell.systemData.description">
					<td style="width: 100%">{{ spell.name }}</td>
					<td class="actions">
						<a @click="rollSpell(spell)" data-die="A"
							><i class="roll-button">&nbsp;&nbsp;&nbsp;&nbsp;</i></a
						>
						<a class="fas fa-edit" @click.prevent="spell.sheet?.render(true)" /><a
							class="fas fa-trash"
							@click.prevent="deleteItem(spell)"
						/>
					</td>
				</tr>
			</table>
		</div>
	</section>
</template>

<style lang="scss" scoped>
@use '@scss/vars/colors';
@use '@scss/sheets';
@use '@scss/attributes';

.attributes {
	height: auto;
}

.section-attr-and-powers {
	width: 40%;
	height: auto;
}

.section-magic-attributes {
	height: auto;
}

.section-adeptpowers {
	width: 100%;
}
.section-spells {
	width: 55%;
}
</style>
