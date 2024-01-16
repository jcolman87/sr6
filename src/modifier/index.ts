import { RollType } from '@/roll';

export enum ModifierType {
	Pool = 'pool',
	BonusEdge = 'bonusEdge',
	BlockEdge = 'blockEdge',
}

type ModifierSourceUUID =
	| ActorDocumentUUID
	| TokenDocumentUUID
	| ActiveEffectUUID
	| EmbeddedItemUUID
	| WorldDocumentUUID<Scene>;

export type PoolModifierData = {
	sourceId: ModifierSourceUUID;
	value: number;
};
export class PoolModifier {
	source: foundry.abstract.Document;
	value: number;

	constructor(source: foundry.abstract.Document, value: number) {
		this.source = source;
		this.value = value;
	}
}

export type ModifiersData = {
	pools: Partial<Record<keyof typeof RollType, PoolModifierData[]>>;
};

export class Modifiers {
	source: ModifiersData;

	pools: Partial<Record<keyof typeof RollType, PoolModifier[]>>;

	updateSource(data: ModifiersData): void {
		this.source = data;
		this.pools = {};

		Object.keys(this.source.pools).forEach((key) => {
			const rollType = key as keyof typeof RollType;
			if (!rollType) {
				ui.notifications.error!(`Invalid RollType in pools`);
				return;
			}
			this.pools[rollType] = [];

			this.source.pools[rollType]!.forEach((modifierData, _idx) => {
				const sourceDocument = fromUuidSync(modifierData.sourceId);
				if (sourceDocument) {
					this.pools[rollType]!.push(new PoolModifier(sourceDocument, modifierData.value));
				} else {
					ui.notifications.error!(`Invalid source ID for modifier: ${modifierData.sourceId}`);
					// invalid.push(idx);
				}
			});
		});
	}

	constructor() {
		this.source = { pools: {} };
		this.pools = {};
		this.updateSource(this.source);
	}
}

export function register(): void {}
