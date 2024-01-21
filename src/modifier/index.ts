import { ConditionalData } from '@/effect/conditional';
import { ITest } from 'src/test';
import { ClassData } from '@/data/serialize';
import BaseModifier from '@/modifier/BaseModifier';
import TestPoolModifier from '@/modifier/TestPoolModifier';

export type ModifierSourceUUID =
	| ActorDocumentUUID
	| TokenDocumentUUID
	| ActiveEffectUUID
	| EmbeddedItemUUID
	| WorldDocumentUUID<Scene>;

export interface IModifier {
	get class(): string;

	get isApplicable(): boolean;

	get name(): undefined | string;
	get description(): undefined | string;

	get parent(): foundry.abstract.Document;
	get source(): foundry.abstract.Document;

	forTest?(test: ITest): boolean;
	prepareTest?<TTest extends ITest>(test: TTest): void;
	finishTest?<TTest extends ITest>(test: TTest): void;

	prepareDocument?(document: foundry.abstract.Document): void;

	toJSON(): ModifierSourceData;
}

export type ModifierSourceData = {
	parent?: ModifierSourceUUID;
	source?: ModifierSourceUUID;

	name: string;
	description: string;
	conditions?: ConditionalData[];
} & ClassData &
	Record<string, unknown>;

export interface ModifiersSourceData {
	modifiers?: ModifierSourceData[];
}

export class Modifiers<TDocument extends foundry.abstract.Document = foundry.abstract.Document> {
	parent: TDocument;
	sourceData: ModifiersSourceData;
	all: IModifier[];

	get applicable(): IModifier[] {
		return this.all.filter((mod) => mod.isApplicable);
	}

	forTest(test: ITest): IModifier[] {
		return this.applicable.filter((mod) => {
			if (mod.forTest) {
				return mod.forTest?.(test);
			}
			return false;
		});
	}

	updateSource(data: ModifiersSourceData): void {
		this.all = [];
		this.sourceData = data;

		this.sourceData.modifiers?.forEach((modifierSourceData) => {
			const mod = BaseModifier.fromData(modifierSourceData);
			if (mod.ok) {
				this.all.push(mod.val);
			}
		});
	}

	async save(): Promise<void> {
		// Copy the active modifiers to their source data and then write it
		this.sourceData.modifiers = this.all.map((mod) => mod.toJSON());
		await this.parent.update({ ['flags.sr6.modifiers']: this.sourceData }, { diff: false });
	}

	constructor(parent: TDocument) {
		const sourceData = parent.getFlag('sr6', 'modifiers') as ModifiersSourceData | undefined;
		this.parent = parent;
		this.sourceData = sourceData ? sourceData : {};
		this.all = [];
		this.updateSource(this.sourceData);
	}
}

export function register(): void {}

export function config(): Record<string, unknown> {
	return {
		TestPoolModifier: TestPoolModifier,
	};
}
