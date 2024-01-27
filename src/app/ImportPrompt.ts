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

import { MagicAwakenedType, MagicTradition } from '@/data/magic';
import {
	getCoreAdeptPowers,
	getCoreQualities,
	getCoreMatrixActions,
	getCoreSkills,
	getCoreWeapons,
	getCoreSpells,
	getCoreGeneralActions,
	getCoreGear,
	getCoreAugmentations,
	getCoreMatrixPrograms,
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

/*

"adeptPowers"
"age"
"armors"
"attributes"
"augmentations"
"closeCombatWeapons"
"complexForms"
"contacts"
"drones"
"echoes"
"freeKarma"
"gender"
"heat"
"initiation"
"initiatives"
"items"
"karma"
"licenses"
"lifestyles"
"longRangeWeapons"
"martialArts"
"matrixItems"
"metaType"
"metamagic"
"name"
"notes"
"nuyen"
"qualities"
"reputation"
"rituals"
"signatureManeuvers"
"sins"
"size"
"skills"
"spells"
"streetName"
"submersion"
"system"
"vehicles"
"version"
"weight"


 */
export class ImportPrompt extends VueSheet(Application) {
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
		await actor.createEmbeddedDocuments('Item', await getCoreMatrixPrograms());

		Object.keys(data.attributes).forEach((name: string) => {
			const value = json.attr(name);
			if (value !== undefined) {
				(data.attributes as any)[name].base = value.points;
				(data.attributes as any)[name].modifier = value.modifiedValue - value.points;
			} else {
				console.error(`missing attribute: ${name}`);
			}
		});

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

		let items: any[] = [];

		let sins: SR6Item<SINDataModel>[] = [];
		if (Object.prototype.hasOwnProperty.call(json, 'sins') && json.sins.length > 0) {
			sins = (await actor.createEmbeddedDocuments(
				'Item',
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
			)) as SR6Item<SINDataModel>[];
		}

		if (Object.prototype.hasOwnProperty.call(json, 'lifestyles') && json.lifestyles.length > 0) {
			items = items.concat(
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
				}),
			);
		}

		if (Object.prototype.hasOwnProperty.call(json, 'contacts') && json.contacts.length > 0) {
			items = items.concat(
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
				}),
			);
		}

		if (Object.prototype.hasOwnProperty.call(json, 'adeptPowers') && json.adeptPowers.length > 0) {
			const all = await getCoreAdeptPowers();
			items = items.concat(
				json.adeptPowers.map((value: any) => {
					const existing = all.find((i: SR6Item) => i.name === value.name);
					if (existing) {
						return existing;
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
				}),
			);
		}

		if (Object.prototype.hasOwnProperty.call(json, 'qualities') && json.qualities.length > 0) {
			const all = await getCoreQualities();
			items = items.concat(
				json.qualities
					.map((value: any) => {
						const existing = all.find((i) => i.name === value.name);
						if (existing) {
							return existing;
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
										},
									};
								}
							}
						}
					})
					.filter((p: any) => p !== null),
			);
		}

		if (Object.prototype.hasOwnProperty.call(json, 'augmentations') && json.augmentations.length > 0) {
			const all = await getCoreAugmentations();
			items = items.concat(
				json.augmentations
					.map((value: any) => {
						let name = value.name;
						let rating = 1;
						const arr = /(.*)Rating ([0-9])/g.exec(value.name);

						if (arr) {
							name = arr[1].trim();
							rating = parseInt(arr[2]);
						}

						const existing = all.find((i: SR6Item) => i.name === name);
						if (existing) {
							return existing;
						} else {
							ui.notifications.warn(`Unknown Augmentation: ${name}, Attempting to parse`);
							let quality = 1;
							switch (value.quality) {
								case 'STANDARD':
									quality = 1;
									break;
								case 'ALPHA':
									quality = 2;
									break;
								case 'BETA':
									quality = 3;
									break;
							}
							return {
								name: value.name,
								type: 'augmentation',
								img: 'icons/svg/item-bag.svg',
								system: {
									name: value.name,
									essenceCost: value.essence,
									quality: quality,
									rating: rating,
									description: value.choice ? value.choice : '',
									source: value.page,
								},
							};
						}
					})
					.filter((p: any) => p !== null),
			);
		}

		if (Object.prototype.hasOwnProperty.call(json, 'spells') && json.spells.length > 0) {
			const all = await getCoreSpells();
			items = items.concat(
				json.spells
					.map((value: any) => {
						const existingSpell = all.find((i) => i.name === value.name);
						if (existingSpell) {
							return existingSpell;
						} else {
							ui.notifications.error(`Unknown spell: ${value.name}`);
							return null;
						}
					})
					.filter((p: any) => p !== null),
			);
		}

		const coreWeapons = await getCoreWeapons();
		if (Object.prototype.hasOwnProperty.call(json, 'longRangeWeapons') && json.longRangeWeapons.length > 0) {
			items = items.concat(
				json.longRangeWeapons
					.filter((value: any) => {
						const weapon = coreWeapons.find((w) => w.name === value.name);
						if (!weapon) {
							ui.notifications.error!(`invalid weapon: ${value.name}`);
							return false;
						}
						return true;
					})
					.map((value: any) => coreWeapons.find((w) => w.name === value.name)),
			);
		}
		if (Object.prototype.hasOwnProperty.call(json, 'closeCombatWeapons') && json.closeCombatWeapons.length > 0) {
			items = items.concat(
				json.closeCombatWeapons
					.filter((value: any) => {
						const weapon = coreWeapons.find((w) => w.name === value.name);
						if (!weapon) {
							ui.notifications.error!(`invalid weapon: ${value.name}`);
							return false;
						}
						return true;
					})
					.map((value: any) => coreWeapons.find((w) => w.name === value.name)),
			);
		}

		//
		// Gear
		//

		const allGear = await getCoreGear();
		if (json.matrixItems.length > 0) {
			items = items.concat(
				json.matrixItems
					.filter((value: any) => {
						const item = allGear.find((w) => w.name === value.name);
						if (!item) {
							ui.notifications.error!(`invalid matrix item: ${value.name}`);
							return false;
						}
						return true;
					})
					.map((value: any) => allGear.find((w) => w.name === value.name)),
			);
		}

		if (json.items.length > 0) {
			items = items.concat(
				json.items.map((value: any) => {
					const item = allGear.find((w) => w.name.toLowerCase() === value.name.toLowerCase());
					if (item) {
						return item;
					} else {
						ui.notifications.warn!(`Couldnt find item: ${value.name}, attempting to create`);
						return {
							name: value.name,
							type: 'gear',
							img: 'icons/svg/item-bag.svg',
							system: {
								source: value.page,
								description: value.description,
								rating: value.rating,
								count: value.count,
								category: {
									type: value.type.toLowerCase(),
									subtype: value.subType.toLowerCase(),
								},
							},
						};
					}
				}),
			);
		}

		if (json.armors.length > 0) {
			items = items.concat(
				json.armors.map((value: any) => {
					const item = allGear.find((w) => {
						return w.name.toLowerCase() === value.name.toLowerCase();
					});
					if (item) {
						return item;
					} else {
						ui.notifications.warn!(`Couldnt find armor: ${value.name}, attempting to create`);

						let formulas = null;
						let slots = ['clothes'];
						if (value.rating > 0) {
							formulas = {
								defenseRatingFormula: value.rating.toString(),
							};
							slots = ['armor'];
						}

						return {
							name: value.name,
							type: 'wearable',
							img: 'icons/svg/item-bag.svg',
							system: {
								source: value.page,
								description: value.description,
								rating: 1,
								formulas: formulas,
								capacity: 0,
								slots: slots,
								category: {
									type: 'armor',
								},
							},
						};
					}
				}),
			);
		}

		if (items.length > 0) {
			await actor.createEmbeddedDocuments('Item', items);
		}

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
