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

export class ModifierData<TValue> {
	sourceId?: ModifierSourceUUID;
	parentId?: ModifierSourceUUID;
	value: TValue | undefined = undefined;
}

export interface ModifiersData {
	pools?: Partial<Record<keyof typeof RollType, ModifierData<number>[]>>;
	bonusEdge?: Partial<Record<keyof typeof RollType, ModifierData<number>[]>>;
	blockEdge?: Partial<Record<keyof typeof RollType, ModifierData<boolean>[]>>;
}

export class Modifiers<TDocument extends foundry.abstract.Document = foundry.abstract.Document> {
	parent: TDocument;
	source: ModifiersData;

	/*
	getPoolModifiers(rollType: RollType, options: { recursive?: true } = {}): ModifierData<number>[] {
		const type = RollType[rollType] as keyof typeof RollType;
		let result: ModifierData<number>[] = [];
		if (this.source.pools && this.source.pools[type]) {
			result = mergeModifierRollEntries(this.source.pools, {}, this.parent.uuid as ModifierSourceUUID)[type]!;
		}

		// TODO: handle tokens and parents?

		// recursively merge parent modifiers until we reach the top
		if (options?.recursive && this.parent.parent) {
			let modifiersData = this.parent.parent.getFlag('sr6', 'modifiers');
			if (modifiersData) {
				let parentModifiers = new Modifiers(this.parent.parent, modifiersData);
				return result.concat(parentModifiers.getPoolModifiers(rollType, options));
			}
		}

		return result;
	}
	*/

	updateSource(data: ModifiersData): void {
		console.log('Modifiers::updateSource', this, data);
		this.source = data;
	}

	async update(_data: Partial<ModifiersData>): Promise<void> {
		// await this.parent.update(['flags.sr6.modifiers', data]);
	}

	async save(): Promise<void> {
		// await this.parent.update({ ['flags.sr6.modifiers']: this.source }, { diff: false });
	}

	constructor(parent: TDocument, source: ModifiersData = {}) {
		this.parent = parent;
		this.source = source;
		this.updateSource(this.source);
	}
}

export function register(): void {}
