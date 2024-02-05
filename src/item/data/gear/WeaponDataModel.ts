/**
 *
 * @author jaynus
 * @file Player Character
 */

import BaseDataModel from '@/data/BaseDataModel';
import { DocumentUUIDField } from '@/data/fields';
import SR6Effect from '@/effect/SR6Effect';
import GearDataModel from '@/item/data/gear/GearDataModel';
import { DamageType, FireMode, Distance } from '@/data';
import SR6Item from '@/item/SR6Item';

import { getItemSync } from '@/util';

export abstract class AttackRatingDataModel extends BaseDataModel {
	abstract closeFormula: string;
	abstract nearFormula: string;
	abstract mediumFormula: string;
	abstract farFormula: string;
	abstract extremeFormula: string;

	get close(): number {
		return this.solveFormula(this.closeFormula);
	}

	get near(): number {
		return this.solveFormula(this.nearFormula);
	}

	get medium(): number {
		return this.solveFormula(this.mediumFormula);
	}

	get far(): number {
		return this.solveFormula(this.farFormula);
	}

	get extreme(): number {
		return this.solveFormula(this.extremeFormula);
	}

	atDistance(distance: Distance): number {
		switch (distance) {
			case Distance.Close: {
				return this.close;
			}
			case Distance.Near: {
				return this.near;
			}
			case Distance.Medium: {
				return this.medium;
			}
			case Distance.Far: {
				return this.far;
			}
			case Distance.Extreme: {
				return this.extreme;
			}
		}
		return 0;
	}

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			closeFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			nearFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			mediumFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			farFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
			extremeFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
		};
	}
}

export type WeaponDamage = {
	damageFormula: string;
	defenseFormula: string;
	soakFormula: string;
	damageType: DamageType;
};

export type WeaponAttachmentEffectData = {
	sourceAttachmentId: ItemUUID;
};

export default abstract class WeaponDataModel extends GearDataModel {
	abstract attackRatings: AttackRatingDataModel;

	abstract damageData: WeaponDamage;

	abstract firemodes: FireMode[];

	abstract _accessories: ItemUUID[];

	get isMelee(): boolean {
		return this.firemodes.length < 1 || this.attackRatings.near === 0;
	}

	override prepareBaseData(): void {
		super.prepareBaseData();
		this.attackRatings.prepareBaseData();
		void this.cleanAccessories();
	}

	override prepareData(): void {
		super.prepareData();
		this.attackRatings.prepareData();
		void this.cleanAccessories();
	}

	override prepareEmbeddedDocuments(): void {
		super.prepareEmbeddedDocuments();
		this.attackRatings.prepareEmbeddedDocuments();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.attackRatings.prepareDerivedData();
	}

	async cleanAccessories(): Promise<void> {
		const toRemove: string[] = [];
		this._accessories.forEach((uuid) => {
			if (getItemSync(SR6Item<GearDataModel>, uuid) === null) {
				toRemove.push(uuid);
			}
		});
		if (toRemove.length > 0) {
			this._accessories = this._accessories.filter((uuid) => toRemove.includes(uuid) === false);
			await this.item!.update({ ['system._accessories']: this._accessories });
		}
	}

	get accessories(): SR6Item<GearDataModel>[] {
		return this._accessories.map((uuid) => getItemSync(SR6Item<GearDataModel>, uuid)! as SR6Item<GearDataModel>);
	}

	get damage(): number {
		return this.solveFormula(this.damageData.damageFormula);
	}

	get pool(): number {
		return this.skillUse ? this.skillUse!.pool : 0;
	}

	applyAttachmentEffects(): void {
		for (const accessory of this.accessories) {
			// copy attachment modifiers
			//this.item!.modifiers.all = this.item!.modifiers.all.concat(accessory.modifiers.all);

			for (const effectData of accessory.effects) {
				const effect = effectData as SR6Effect;

				// copy attachment effect modifiers
				console.log('adding modifiers', accessory, effect, this.item!.modifiers.all, effect.modifiers.all);
				this.item!.modifiers.all = this.item!.modifiers.all.concat(effect.modifiers.all);

				for (const change of effect.changes) {
					effect._apply(this.item!, change);
				}
			}
		}
	}

	// Transfer effects off of attachments onto us
	async _syncAttachmentEffects(): Promise<void> {}

	async attach(accessory: SR6Item<GearDataModel>): Promise<boolean> {
		if (!this.isOwner || !accessory.isOwner) {
			console.error(`User does not have permission:  Child(${accessory.uuid}) Parent(${this.item!.uuid})`);
			return false;
		}

		if (accessory.systemData.attachedTo !== null) {
			console.error(
				`Cannot attach (${accessory.uuid})->(${this.item!.uuid}): Child was alread attached to something!`,
			);
			return false;
		}
		if (accessory.systemData.attachedTo === this.item!.uuid) {
			console.warn(`Item was already attached (${accessory.uuid})->(${this.item!.uuid}), returning true`);
			return true;
		}

		// TODO: check that we can attach
		this._accessories = [...this._accessories, accessory.uuid];
		await this.item!.update({ ['system._accessories']: this._accessories });

		// Update the child
		await accessory.update({ ['system._attachedTo']: this.item!.uuid });

		await this._syncAttachmentEffects();

		return true;
	}

	async detach(accessory: SR6Item<GearDataModel>): Promise<boolean> {
		if (!this.isOwner || !accessory.isOwner) {
			console.error(`User does not have permission:  Child(${accessory.uuid}) Parent(${this.item!.uuid})`);
			return false;
		}

		if (!this._accessories.includes(accessory.uuid) || accessory.systemData.attachedTo?.uuid !== this.item!.uuid) {
			console.error(`Item (${accessory.uuid}) was not attached to ${this.item!.uuid}`);
			return false;
		}

		await this.item!.update({
			['system._accessories']: this._accessories.filter((uuid) => uuid !== accessory.uuid),
		});

		// Update the child
		await accessory.update({ ['system._attachedTo']: null });

		await this._syncAttachmentEffects();

		return true;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			attackRatings: new fields.EmbeddedDataField(AttackRatingDataModel, { required: true, nullable: false }),
			damageData: new fields.SchemaField(
				{
					damageFormula: new fields.StringField({ initial: '0', required: true, nullable: false }),
					defenseFormula: new fields.StringField({
						initial: '@agility + @intuition',
						required: true,
						nullable: false,
					}),
					soakFormula: new fields.StringField({
						initial: '@body',
						required: true,
						nullable: false,
					}),
					damageType: new fields.StringField({
						initial: DamageType.Physical,
						required: true,
						nullable: false,
						blank: false,
						choices: Object.values(DamageType),
					}),
				},
				{ required: true, nullable: false },
			),
			firemodes: new fields.ArrayField(
				new fields.StringField({ blank: false, choices: Object.values(FireMode) }),
				{ initial: [], required: true, nullable: true },
			),
			_accessories: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}
