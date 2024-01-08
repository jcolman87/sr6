/* eslint @typescript-eslint/no-explicit-any:0 */
/**
 * FVTT-SR6
 * Unofficial implementation of the SR6 RPG for Foundry
 *
 * @author jaynus
 * @file Dice roll prompt app.
 */
import CharacterDataModel from '@/actor/data/CharacterDataModel';

import SR6Actor from '@/actor/SR6Actor';
import { ActivationType } from '@/data';

import { MagicAwakenedType, MagicTradition, SpellDuration, SpellRangeType } from '@/data/magic';
import {
	getCoreAdeptPowers,
	getCoreQualities,
	getCoreMatrixActions,
	getCoreSkills,
	getCoreWeapons,
	getCoreSpells,
	getCoreGeneralActions,
} from '@/item/data';
import LifestyleType from '@/item/data/feature/LifestyleDataModel';
import SINDataModel from '@/item/data/feature/SINDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import SR6Item from '@/item/SR6Item';
import VueImportPrompt from '@/vue/apps/ImportPrompt.vue';
import { ContextBase } from '@/vue/SheetContext';
import VueSheet from '@/vue/VueSheet';
import { Component } from 'vue';

export interface ImportPromptContext extends ContextBase {
	app: ImportPrompt;
}

function convertActivation(value: string): ActivationType {
	switch (value) {
		case 'PASSIVE':
			return ActivationType.Passive;
		case 'MAJOR_ACTION':
			return ActivationType.Major;
		case 'MINOR_ACTION':
			return ActivationType.Minor;
		default:
			ui.notifications.error(`Invalid activation type ${value}`);
			throw `Invalid activation type ${value}`;
	}
}

export default class ImportPrompt extends VueSheet(Application) {
	async _onImportGenesisActor(file: string): Promise<void> {
		const response = await fetch(file);
		const json = await response.json();

		json.attr = (name: string): string => {
			return json.attributes.find((a: any) => a.id === name.toUpperCase());
		};
		json.skill = (name: string): string => {
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

		// Add all core actions
		await actor.createEmbeddedDocuments('Item', await getCoreGeneralActions());
		await actor.createEmbeddedDocuments('Item', await getCoreMatrixActions());

		Object.keys(data.attributes).forEach((name: string) => {
			const value = json.attr(name);
			if (value !== undefined) {
				(data.attributes as any)[name].base = value.points;
				(data.attributes as any)[name].modifier = value.modifiedValue - value.points;
			} else {
				console.error(`missing attribute: ${name}`);
			}
		});

		data.monitors.edge.max = json.attr('edge').points;

		const coreSkills = await getCoreSkills();
		await actor.createEmbeddedDocuments('Item', coreSkills);
		const filtered = actor.items.filter((i) => i.type === 'skill');

		for (const s of filtered) {
			const skill = s as SR6Item<SkillDataModel>;
			const entry = json.skill(skill.name);
			if (entry) {
				const specialization: string | undefined = entry.specializations
					.filter((s: any) => !s.expertise)
					.map((s: any) => s.name)[0];
				const expertise: string | undefined = entry.specializations
					.filter((s: any) => s.expertise)
					.map((s: any) => s.name)[0];

				await skill.update({
					['system']: {
						points: parseInt(entry.rating),
						specialization: specialization ? specialization : null,
						expertise: expertise ? expertise : null,
					},
				});
			}
		}

		let sins: any = [];
		if (Object.prototype.hasOwnProperty.call(json, 'sins') && json.sins.length > 0) {
			sins = (await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
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
					})
				)
			)) as SR6Item<SINDataModel>[];
		}

		if (Object.prototype.hasOwnProperty.call(json, 'lifestyles') && json.lifestyles.length > 0) {
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
					json.lifestyles.map((value: any) => {
						let sin_id = null;
						if (value.sin && value.sin !== '') {
							const sin = sins.find((sin: any) => sin.name === value.sin);
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
					})
				)
			);
		}

		if (json.contacts.length > 0) {
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
					json.contacts.map((value: any) => {
						return {
							name: value.name !== null ? value.name : 'No Name!',
							type: 'contact',
							img: 'icons/svg/item-bag.svg',
							system: {
								description: value.description !== undefined ? value.description : 'No description!',
								rating: value.influence,
								loyalty: value.loyalty,
								type: value.type,
							},
						};
					})
				)
			);
		}

		if (json.augmentations.length > 0) {
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
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
					})
				)
			);
		}

		if (json.adeptPowers.length > 0) {
			const adeptPowers = await getCoreAdeptPowers();
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
					json.adeptPowers.map((value: any) => {
						const existingPower = adeptPowers.find((i) => i.name === value.name);
						if (existingPower) {
							return existingPower;
						} else {
							return {
								name: value.name,
								type: 'adeptpower',
								img: 'icons/svg/item-bag.svg',
								system: {
									source: value.page,
									powerCost: value.cost,
									level: value.level,
									activation: convertActivation(value.activation),
									description: value.description,
								},
							};
						}
					})
				)
			);
		}

		if (json.qualities.length > 0) {
			const qualities = await getCoreQualities();
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
					json.qualities
						.map((value: any) => {
							const existingQuality = qualities.find((i) => i.name === value.name);
							if (existingQuality) {
								return existingQuality;
							} else {
								switch (value.name) {
									case 'Adept': {
										data.magicAwakened = MagicAwakenedType.Adept;
										return null;
									}
									case 'Magician': {
										data.magicAwakened = MagicAwakenedType.Full;
										data.magicTradition = MagicTradition.Hermeticism;
										return null;
									}
									case 'Technomancer': {
										data.magicAwakened = MagicAwakenedType.Technomancer;
										return null;
									}
									default: {
										return {
											name: value.name,
											type: 'quality',
											img: 'icons/svg/item-bag.svg',
											system: {
												name: value.name,
												description: value.choice ? value.choice : '',
												source: value.page,
												conditions: [],
											},
										};
									}
								}
							}
						})
						.filter((p: any) => p !== null)
				)
			);
		}

		if (json.spells.length > 0) {
			const spells = await getCoreSpells();
			await actor.createEmbeddedDocuments(
				'Item',
				Array.from(
					json.spells.map((value: any) => {
						const existingSpell = spells.find((i) => i.name === value.name);
						if (existingSpell) {
							return existingSpell;
						} else {
							ui.notifications.error(`Unknown spell: ${value.name}`);
						}
					})
				)
			);
		}

		const weapons = await getCoreWeapons();

		const rangedWeapons = json.longRangeWeapons
			.filter((value: any) => {
				const weapon = weapons.find((w) => w.name === value.name);
				if (!weapon) {
					ui.notifications.error!(`invalid weapon: ${value.name}`);
					return false;
				}
				return true;
			})
			.map((value: any) => {
				const weapon = weapons.find((w) => w.name === value.name);
				if (!weapon) {
					ui.notifications.error!(`invalid weapon: ${value.name}`);
					return;
				}

				return weapon;
			});

		const meleeWeapons = json.closeCombatWeapons
			.filter((value: any) => {
				const weapon = weapons.find((w) => w.name === value.name);
				if (!weapon) {
					ui.notifications.error!(`invalid weapon: ${value.name}`);
					return false;
				}
				return true;
			})
			.map((value: any) => {
				const weapon = weapons.find((w) => w.name === value.name);

				return weapon;
			});

		const allWeapons = rangedWeapons.concat(meleeWeapons);

		await actor.createEmbeddedDocuments('Item', allWeapons);

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
