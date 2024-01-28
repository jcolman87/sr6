import BaseActorDataModel from '@/actor/data/BaseActorDataModel';
import LifeformDataModel from '@/actor/data/LifeformDataModel';
import SR6Actor from '@/actor/SR6Actor';
import BaseDataModel from '@/data/BaseDataModel';
import { DocumentUUIDField } from '@/data/fields';
import { IHasOnDropActor } from '@/data/interfaces';
import BaseItemDataModel from '@/item/data/BaseItemDataModel';
import { GearAvailabilityDataModel, GearMatrixDataModel } from '@/item/data/gear/GearDataModel';
import SR6Item from '@/item/SR6Item';

export type Handling = {
	onRoad: number;
	offRoad: number;
};

export type Seats = {
	front: number;
	back: number;
};

export enum DriverType {
	Physical = 'physical',
	Rigged = 'rigged',
}

export abstract class VehicleDriverDataModel extends BaseDataModel {
	abstract actorId: Maybe<ActorUUID>;
	abstract type: Maybe<DriverType>;

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			actorId: new DocumentUUIDField({ nullable: true, required: false }),
			type: new fields.StringField({
				initial: DriverType.Physical,
				required: false,
				nullable: true,
				blank: false,
				choices: Object.values(DriverType),
			}),
		};
	}
}

export abstract class VehicleStatusDataModel extends BaseDataModel {
	abstract speed: number;
	abstract acceleration: number;

	abstract driver: Maybe<VehicleDriverDataModel>;
	abstract occupants: ActorUUID[];

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			speed: new fields.NumberField({
				initial: 0,
				nullable: false,
				required: true,
				integer: true,
			}),
			acceleration: new fields.NumberField({
				initial: 0,
				nullable: false,
				required: true,
				integer: true,
			}),
			driver: new fields.EmbeddedDataField(VehicleDriverDataModel, { nullable: true, required: false }),
			occupants: new fields.ArrayField(new DocumentUUIDField(), {
				initial: [],
				required: true,
				nullable: false,
			}),
		};
	}
}

export abstract class BaseVehicleDataModel extends BaseActorDataModel {
	abstract costFormula: string;
	abstract availability: GearAvailabilityDataModel;
	abstract handling: Handling;

	abstract acceleration: number;
	abstract speedInterval: number;
	abstract maxSpeed: number;

	abstract body: number;
	abstract armor: number;

	abstract pilot: number;
	abstract sensor: number;

	abstract current: VehicleStatusDataModel;
	abstract matrix: Maybe<GearMatrixDataModel>;

	get cost(): number {
		return this.solveFormula(this.costFormula);
	}

	get speedPoolModifier(): number {
		return -Math.floor(this.current.speed / this.speedInterval);
	}

	async setAcceleration(newAcceleration: number): Promise<number> {
		if (newAcceleration > this.acceleration) {
			ui.notifications.warn(`New acceleration higher than max, adjusting ${this.acceleration}`);
			newAcceleration = this.acceleration;
		}
		if (newAcceleration < -this.acceleration) {
			ui.notifications.warn(`New acceleration higher than max, adjusting ${this.acceleration}`);
			newAcceleration = -this.acceleration;
		}
		this.current.acceleration = newAcceleration;
		await this.actor!.update({ ['system.current.acceleration']: newAcceleration });

		return this.current.speed;
	}

	async setSpeed(newSpeed: number): Promise<number> {
		this.current.speed = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, newSpeed));
		await this.actor!.update({ ['system.current.speed']: this.current.speed });

		return this.current.speed;
	}

	async nextRound(): Promise<void> {
		await this.setSpeed(this.current.speed + this.current.acceleration);
	}

	async resetSpeed(): Promise<void> {
		await this.setSpeed(0);
		await this.setAcceleration(0);
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),
			costFormula: new fields.StringField({ initial: '0', nullable: false, required: true, blank: false }),
			availability: new fields.EmbeddedDataField(GearAvailabilityDataModel, { nullable: false, required: true }),
			handling: new fields.SchemaField(
				{
					onRoad: new fields.NumberField({
						initial: 0,
						nullable: false,
						required: true,
						min: 0,
						integer: true,
					}),
					offRoad: new fields.NumberField({
						initial: 0,
						nullable: false,
						required: true,
						min: 0,
						integer: true,
					}),
				},
				{ nullable: false, required: true },
			),
			acceleration: new fields.NumberField({
				initial: 0,
				nullable: false,
				required: true,
				min: 0,
				integer: true,
			}),
			speedInterval: new fields.NumberField({
				initial: 0,
				nullable: false,
				required: true,
				min: 0,
				integer: true,
			}),
			maxSpeed: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0, integer: true }),
			body: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0, integer: true }),
			armor: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0, integer: true }),
			pilot: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0, integer: true }),
			sensor: new fields.NumberField({ initial: 0, nullable: false, required: true, min: 0, integer: true }),

			matrix: new fields.EmbeddedDataField(GearMatrixDataModel, { nullable: true, required: false }),
			current: new fields.EmbeddedDataField(VehicleStatusDataModel, { required: true, nullable: true }),
		};
	}
}

export default abstract class VehicleDataModel
	extends BaseVehicleDataModel
	implements IHasOnDropActor<LifeformDataModel>
{
	abstract seats: Seats;

	async onDropActor(
		event: ElementDragEvent,
		data: DropCanvasData<'Actor', SR6Actor<LifeformDataModel>>,
	): Promise<false | void> {
		//if (this.occupants) {
		//}
		return false;
	}

	async onDropItem(
		event: DragEvent,
		data: DropCanvasData<'Item', SR6Item<BaseItemDataModel>>,
	): Promise<SR6Item<BaseItemDataModel>[] | boolean> {
		return false;
	}

	static override defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			...super.defineSchema(),

			seats: new fields.SchemaField(
				{
					front: new fields.NumberField({ nullable: false, required: true, min: 0, integer: true }),
					back: new fields.NumberField({ nullable: false, required: true, min: 0, integer: true }),
				},
				{ nullable: false, required: true },
			),
		};
	}
}
