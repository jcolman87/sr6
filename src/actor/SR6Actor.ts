/**
 *
 * @author jaynus
 * @file Base SR6 Actor
 */
import BaseDataModel from '@/data/BaseDataModel';
import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import IHasOnUpdate from '@/data/IHasOnUpdate';
import IHasPreCreate from '@/data/IHasPreCreate';
import IHasOnDelete from '@/data/IHasOnDelete';
import IHasPostCreate from '@/data/IHasPostCreate';
import SR6Effect from '@/effects/SR6Effect';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import CredstickDataModel from '@/item/data/gear/CredstickDataModel';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';
import * as util from '@/util';

export default class SR6Actor<ActorDataModel extends foundry.abstract.DataModel = BaseActorDataModel> extends Actor {
	/**
	 * Specialized property for accessing `actor.system` in a typed manner.
	 */
	get systemData(): ActorDataModel {
		return <ActorDataModel>this.system;
	}

	protected override async _onUpdate(
		changed: DeepPartial<this['_source']>,
		options: DocumentUpdateContext<this>,
		userId: string
	): Promise<void> {
		await (<IHasOnUpdate<this>>this.systemData).onUpdate?.(changed, options, userId);
		return super._onUpdate(changed, options, userId);

		// Check the update for anything that requires another change to the actor such as status effects

		/*
		if (changed.system!.monitors!.physical!) {

			if (this.systemData.monitors.physical.value === 0 && this.systemData.monitors.overflow.damage === 0) {
				const already = this.effects.find((a) => a.label === 'Unconscious');
				if (!already) {
					this.createEmbeddedDocuments('ActiveEffect', [
						{
							label: 'Unconscious',
							icon: 'icons/svg/unconscious.svg',
							statuses: ['unconscious'],
						},
					]);
				}
			}
		}
		*/
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

	solveFormula(formula: string, data: Record<string, unknown> = {}): number {
		const finalData = { ...this.getRollData(), ...data, actor: this };
		// console.log('SR6Actor::solveFormula', formula, finalData);
		let roll = new SR6Roll(formula, finalData, SR6Roll.defaultOptions());

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
		(<IHasPostCreate>this.systemData).onPostCreate?.();
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
