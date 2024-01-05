/**
 *
 * @author jaynus
 * @file Base SR6 Actor
 */
import BaseDataModel from '@/data/BaseDataModel';
import IHasPreCreate from '@/data/IHasPreCreate';
import IHasOnDelete from '@/data/IHasOnDelete';
import IHasPostCreate from '@/data/IHasPostCreate';
import SR6Effect from '@/effects/SR6Effect';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import CredstickDataModel from '@/item/data/gear/CredstickDataModel';
import SpellDataModel from '@/item/data/SpellDataModel';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';
import * as util from '@/util';

export default class SR6Actor<
	ActorDataModel extends foundry.abstract.DataModel = foundry.abstract.DataModel
> extends Actor {
	/**
	 * Specialized property for accessing `actor.system` in a typed manner.
	 */
	get systemData(): ActorDataModel {
		return <ActorDataModel>this.system;
	}

	// This is a fix needed for handling active effects from items showing as icon effects.
	override get temporaryEffects(): TemporaryEffect[] {
		// Only return actual temporary effects and then condition transferred effects
		return [
			...Array.from(this.allApplicableEffects()).filter(
				(effect) => (effect as SR6Effect).isStatusEffectCondition
			),
			...super.temporaryEffects,
		];
	}

	skill(skillId_or_name: string): SR6Item<SkillDataModel> | null {
		let skill = this.items.get(skillId_or_name);
		if (!skill) {
			skill = this.items.getName(skillId_or_name);
		}
		if (skill) {
			return skill as SR6Item<SkillDataModel>;
		}

		return null;
	}

	get credsticks(): SR6Item<CredstickDataModel>[] {
		return this.items.filter((item) => item.type === 'credstick') as SR6Item<CredstickDataModel>[];
	}

	item<TDataModel extends BaseDataModel = BaseDataModel>(id: string): SR6Item<TDataModel> | null {
		let item = this.items.get(id);
		if (!item) {
			item = this.items.getName(id);
		}
		if (item) {
			return item as SR6Item<TDataModel>;
		}

		return null;
	}

	matrixAction(action_id_or_name: string): SR6Item<MatrixActionDataModel> | null {
		let skill = this.items.get(action_id_or_name);
		if (!skill) {
			skill = this.items.getName(action_id_or_name);
		}
		if (skill) {
			return skill as SR6Item<MatrixActionDataModel>;
		}

		return null;
	}

	override prepareEmbeddedDocuments(): void {
		super.prepareEmbeddedDocuments();
		this.systemData.prepareEmbeddedDocuments();
	}

	override prepareData(): void {
		super.prepareData();
		this.systemData.prepareData();
	}

	override prepareDerivedData(): void {
		super.prepareDerivedData();
		this.systemData.prepareDerivedData();
	}

	solveFormula(formula: string): number {
		let roll = new SR6Roll(formula, { ...this.getRollData(), actor: this }, SR6Roll.defaultOptions());

		roll = roll.evaluate({ async: false });
		return roll.total!;
	}

	override getRollData(): Record<string, unknown> {
		const skills: Record<string, unknown> = {};

		this.items
			.filter((i) => i.type === 'skill')
			.forEach((i) => {
				const skill = i as SR6Item<SkillDataModel>;
				skills[skill.safe_name] = skill.systemData.points;
				skill.systemData.specializations.forEach((special) => {
					const safe_special = util.toSnakeCase(special);
					skills[safe_special] = skill.systemData.getPoints(special);
				});
			});
		return foundry.utils.mergeObject(skills, {
			...super.getRollData(),
			...this.systemData.getRollData(),
			actor: this,
		});
	}

	/**
	 * Override the _preCreate callback to call preCreate from the data model class, if present.
	 * @inheritDoc
	 */
	protected override async _preCreate(
		data: PreDocumentId<this['_source']>,
		options: DocumentModificationContext<this>,
		user: User
	): Promise<void> {
		await (<IHasPreCreate<this>>this.systemData).preCreate?.(this, data, options, user);

		return super._preCreate(data, options, user);
	}

	/**
	 * Override the _onDelete callback to call onDelete from the data model class, if present.
	 * @inheritDoc
	 */
	protected override _onDelete(options: DocumentModificationContext<this>, userId: string): void {
		(<IHasOnDelete<this>>this.systemData).onDelete?.(this, options, userId);

		super._onDelete(options, userId);
	}

	async _onPostCreate(): Promise<void> {
		(<IHasPostCreate<this>>this.systemData).onPostCreate?.();
	}

	/**
	 * Override the createDialog callback to include a unique class that identifies the created dialog.
	 * @inheritDoc
	 */
	static override createDialog(
		data?: { folder?: string | undefined } | undefined,
		options?: Partial<FormApplicationOptions> | undefined
	): Promise<ClientDocument<foundry.documents.BaseActor> | undefined> {
		// The 'dialog' class needs to be added explicitly, otherwise it won't be added by the super call.
		const touchedOptions = {
			...options,
			classes: [...(options?.classes ?? []), 'dialog', 'dialog-actor-create'],
		};

		return super.createDialog(data, touchedOptions);
	}
}
