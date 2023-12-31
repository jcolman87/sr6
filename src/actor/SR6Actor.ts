/**
 *
 * @author jaynus
 * @file Base SR6 Actor
 */
import IHasPreCreate from '@/data/IHasPreCreate';
import IHasOnDelete from '@/data/IHasOnDelete';
import IHasPostCreate from '@/data/IHasPostCreate';
import SR6Effect from '@/effects/SR6Effect';
import MatrixActionDataModel from '@/item/data/action/MatrixActionDataModel';
import SkillDataModel from '@/item/data/feature/SkillDataModel';
import SR6Item from '@/item/SR6Item';
import { SR6Roll } from '@/roll/SR6Roll';

export default class SR6Actor<ActorDataModel extends foundry.abstract.DataModel = foundry.abstract.DataModel> extends Actor {
	/**
	 * Specialized property for accessing `actor.system` in a typed manner.
	 */
	get systemData(): ActorDataModel {
		return <ActorDataModel>this.system;
	}

	// This is a fix needed for handling active effects from items showing as icon effects.
	override get temporaryEffects(): TemporaryEffect[] {
		// Only return actual temporary effects and then condition transferred effects
		return [...Array.from(this.allApplicableEffects()).filter((effect) => (effect as SR6Effect).isStatusEffectCondition), ...super.temporaryEffects];
	}

	skill(skill_id_or_name: string): SR6Item<SkillDataModel> | null {
		let skill = this.items.get(skill_id_or_name);
		if (!skill) {
			skill = this.items.getName(skill_id_or_name);
		}
		if (skill) {
			return skill as SR6Item<SkillDataModel>;
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
		let skills: any = {};

		this.items
			.filter((i) => i.type == 'skill')
			.forEach((i) => {
				let skill = i as SR6Item<SkillDataModel>;
				skills[skill.safe_name] = skill.systemData.points;
			});
		return foundry.utils.mergeObject(skills, { ...super.getRollData(), ...this.systemData.getRollData(), actor: this });
	}

	/**
	 * Override the _preCreate callback to call preCreate from the data model class, if present.
	 * @inheritDoc
	 */
	protected override async _preCreate(data: PreDocumentId<this['_source']>, options: DocumentModificationContext<this>, user: User) {
		await (<IHasPreCreate<this>>this.systemData).preCreate?.(this, data, options, user);

		return super._preCreate(data, options, user);
	}

	/**
	 * Override the _onDelete callback to call onDelete from the data model class, if present.
	 * @inheritDoc
	 */
	protected override _onDelete(options: DocumentModificationContext<this>, userId: string) {
		(<IHasOnDelete<this>>this.systemData).onDelete?.(this, options, userId);

		super._onDelete(options, userId);
	}

	async _onPostCreate(controlled: boolean) {
		(<IHasPostCreate<this>>this.systemData).onPostCreate?.(this, controlled);
	}

	/**
	 * Override the createDialog callback to include a unique class that identifies the created dialog.
	 * @inheritDoc
	 */
	static override createDialog(data?: { folder?: string | undefined } | undefined, options?: Partial<FormApplicationOptions> | undefined): Promise<ClientDocument<foundry.documents.BaseActor> | undefined> {
		// The 'dialog' class needs to be added explicitly, otherwise it won't be added by the super call.
		const touchedOptions = {
			...options,
			classes: [...(options?.classes ?? []), 'dialog', 'dialog-actor-create'],
		};

		return super.createDialog(data, touchedOptions);
	}
}
