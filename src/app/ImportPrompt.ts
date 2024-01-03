/**
 * FVTT-SR6
 * Unofficial implementation of the SR6 RPG for Foundry
 *
 * @author jaynus
 * @file Dice roll prompt app.
 */

import { SpellDuration, SpellRangeType } from '@/data/magic';
import { getCoreMatrixActions, getCoreSkills } from '@/item/data';
import VueImportPrompt from '@/vue/apps/ImportPrompt.vue';
import { ContextBase } from '@/vue/SheetContext';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';

import SR6Actor from '@/actor/SR6Actor';
import SR6Item from '@/item/SR6Item';
import SINDataModel from '@/item/data/feature/SINDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import LifestyleType from '@/item/data/feature/LifestyleDataModel';

export interface ImportPromptContext extends ContextBase {
	app: ImportPrompt;
}

export default class ImportPrompt extends VueSheet(Application) {
	async _onImportGenesisActor(file: string): Promise<void> {
		const response = await fetch(file);
		const json = await response.json();

		json.attr = (name: string): string => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return json.attributes.find((a: any) => a.id === name.toUpperCase());
		};
		json.skill = (name: string): string => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return json.skills.find((a: any) => a.id === name.toLowerCase());
		};

		const actor = (await Actor.create({
			name: json.streetName,
			type: 'character',
		})) as SR6Actor<CharacterDataModel>;

		if (actor === undefined) {
			ui.notifications!.error('import failed to create actor');
			return;
		}
		const data = actor.systemData;

		Object.keys(data.attributes).forEach((name: string) => {
			const value = json.attr(name);
			if (value !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(data.attributes as any)[name].base = value.points;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(data.attributes as any)[name].modifier = value.modifiedValue - value.points;
			}
		});

		const coreSkills = await getCoreSkills();
		await actor.createEmbeddedDocuments('Item', coreSkills);
		actor.items
			.filter((i) => i.type === 'skill')
			.forEach((s) => {
				const skill = s as SR6Item<SkillDataModel>;
				const entry = json.skill(skill.name);
				if (entry) {
					skill.update({ ['system.points']: parseInt(entry.rating) });
				}
			});

		await actor.createEmbeddedDocuments('Item', await getCoreMatrixActions());

		await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.adeptPowers.map((value: any) => {
					return {
						name: value.name,
						type: 'adeptpower',
						img: 'icons/svg/item-bag.svg',
						system: {
							source: value.page,
							rating: value.level,
						},
					};
				}),
			),
		);

		const sins = (await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.sins.map((value: any) => {
					return {
						name: value.name,
						type: 'sin',
						img: 'icons/svg/item-bag.svg',
						system: {
							description: value.description !== undefined ? value.description : 'No description!',
							rating: value.quality,
						},
					};
				}),
			),
		)) as SR6Item<SINDataModel>[];

		await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.lifestyles.map((value: any) => {
					let sin_id = null;
					if (value.sin && value.sin !== '') {
						const sin = sins.find((sin) => sin.name === value.sin);
						if (sin) {
							sin_id = sin.id;
						}
					}

					return {
						name: value.customName,
						type: 'lifestyle',
						img: 'icons/svg/item-bag.svg',
						system: {
							description: value.description,
							rating: LifestyleType[value.name as keyof typeof LifestyleType],
							monthsPaid: value.paidMonths,
							costFormula: value.cost,
							sin: sin_id,
						},
					};
				}),
			),
		);

		await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.contacts.map((value: any) => {
					return {
						name: value.name !== undefined ? value.name : 'No Name!',
						type: 'contact',
						img: 'icons/svg/item-bag.svg',
						system: {
							description: value.description !== undefined ? value.description : 'No description!',
							rating: value.influence,
							loyalty: value.level,
							type: value.type,
						},
					};
				}),
			),
		);

		await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.augmentations.map((value: any) => {
					let quality: number = 1;
					let rating: number = 1;

					if (value.level === '-') {
						rating = 1;
					} else {
						rating = parseInt(value.level);
					}
					if (value.quality === 'ALPHA') {
						quality = 3;
					}

					return {
						name: value.name,
						type: 'augmentation',
						img: 'icons/svg/item-bag.svg',
						system: {
							source: value.page,
							rating: rating,
							quality: quality,
							essenseCost: value.essence,
						},
					};
				}),
			),
		);

		await actor.createEmbeddedDocuments(
			'Item',
			Array.from(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				json.spells.map((value: any) => {
					let range_type = SpellRangeType.Touch;
					if (value.range.indexOf('Line of sight') !== -1) {
						range_type = SpellRangeType.LineOfSight;
					}
					let duration = SpellDuration.Instantaneous;
					switch (value.duration) {
						case 'Instantaneous':
							duration = SpellDuration.Instantaneous;
							break;
						case 'Permanent':
							duration = SpellDuration.Permanent;
							break;
						case 'Sustained':
							duration = SpellDuration.Sustained;
							break;
						case 'Limited':
							duration = SpellDuration.Limited;
							break;
					}

					return {
						name: value.name,
						type: 'spell',
						img: 'icons/svg/item-bag.svg',
						system: {
							source: value.page,
							drain: value.drain,
							range: {
								type: range_type,
								value: 0,
							},
							duration: {
								type: duration,
								value: 0,
							},
							damage: null,
						},
					};
				}),
			),
		);

		await actor.update({ ['system']: data });
		// await actor.delete();
	}

	static override get defaultOptions(): ApplicationOptions {
		return {
			...super.defaultOptions,
			classes: ['app-import-prompt'],
			width: 500,
		};
	}

	constructor() {
		super();
	}

	override async close(options: {} = {}): Promise<void> {
		return super.close(options);
	}

	get vueComponent(): Component {
		return VueImportPrompt;
	}

	async getVueContext(): Promise<ImportPromptContext> {
		return {
			app: this,
		};
	}
}
