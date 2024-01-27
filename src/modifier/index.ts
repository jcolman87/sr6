import { ConditionalData } from '@/effect/conditional';

import { ITest } from 'src/test';
import { ClassData } from '@/data/serialize';
import BaseModifier from '@/modifier/BaseModifier';
import { TestPoolModifier, TestFunctionModifier } from '@/modifier/TestModifiers';

// Specialized impls
import { WoundModifier } from '@/modifier/impl/WoundModifier';
import { PainEditorModifier } from '@/modifier/impl/PainEditorModifier';
import { EdgeModifier } from '@/modifier/impl/EdgeModifier';

export type ModifierSourceUUID =
	| ActorDocumentUUID
	| TokenDocumentUUID
	| ActiveEffectUUID
	| EmbeddedItemUUID
	| WorldDocumentUUID<Scene>;

export interface IModifier {
	get class(): string;

	isApplicable(test: Maybe<ITest>): boolean;

	get name(): undefined | string;
	get description(): undefined | string;

	get parent(): foundry.abstract.Document;
	get source(): foundry.abstract.Document;

	prepareTest?<TTest extends ITest>(test: TTest): Promise<void>;
	finishTest?<TTest extends ITest>(test: TTest): Promise<void>;

	prepareDocument?(document: foundry.abstract.Document): Promise<void>;

	toJSON(): ModifierSourceData;
}

export type ModifierSourceData = {
	parent?: ModifierSourceUUID;
	source?: ModifierSourceUUID;

	name?: string;
	description?: string;
	conditions?: ConditionalData[];
} & ClassData &
	Record<string, unknown>;

export interface ModifiersSourceData {
	modifiers?: ModifierSourceData[];
}

export type ModifierConstructorData<TSourceData extends ModifierSourceData> = {
	parent: foundry.abstract.Document;
	source: foundry.abstract.Document;
	conditions?: ConditionalData[];
	data: TSourceData;
};

export class Modifiers<TDocument extends foundry.abstract.Document = foundry.abstract.Document> {
	parent: TDocument;
	sourceData: ModifiersSourceData;
	all: IModifier[];

	getApplicable(test: Maybe<ITest> = null): IModifier[] {
		return this.all.filter((mod) => mod.isApplicable(test));
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

	async pushSave(newModifier: IModifier): Promise<void> {
		this.all.push(newModifier);
		await this.save();
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
		TestFunctionModifier: TestFunctionModifier,
		PainEditorModifier: PainEditorModifier,
		WoundModifier: WoundModifier,

		EdgeModifier: EdgeModifier,
	};
}
