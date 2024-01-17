import { ConditionalData, checkConditions } from '@/effect/conditional';
import { BaseRollData } from '@/roll/SR6Roll';
import { ITest } from '@/roll/tests';

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

export interface IModifier {
	get isApplicable(): boolean;

	get parent(): foundry.abstract.Document;
	get source(): foundry.abstract.Document;

	prepareTest<TTest extends ITest>(test: TTest): void;
	finishTest<TTest extends ITest>(test: TTest): void;
}

export class BaseModifier<
	TParent extends foundry.abstract.Document = foundry.abstract.Document,
	TSource extends foundry.abstract.Document = foundry.abstract.Document,
> {
	_parent: TParent;
	_source: TSource;
	conditions: ConditionalData[];

	get parent(): foundry.abstract.Document {
		return this.parent;
	}
	get source(): foundry.abstract.Document {
		return this.source;
	}

	get isApplicable(): boolean {
		if (this.conditions.length < 1) {
			return true;
		}

		return checkConditions(this.source, this.parent, this.conditions).ok;
	}

	checkConditions(): Result<null, ConditionalData[]> {
		return checkConditions(this.source, this.parent, this.conditions);
	}

	prepareTest<TTest extends ITest>(test: TTest): void {
		test.modifiers.push(this);
	}
	finishTest<TTest extends ITest>(test: TTest): void {}

	constructor({
		parent,
		source,
		conditions = [],
	}: {
		parent: TParent;
		source: TSource;
		conditions?: ConditionalData[];
	}) {
		this._parent = parent;
		this._source = source;
		this.conditions = conditions;
	}
}

export interface ModifiersSource {}

export class Modifiers<TDocument extends foundry.abstract.Document = foundry.abstract.Document> {
	parent: TDocument;
	source: ModifiersSource;

	updateSource(data: ModifiersSource): void {
		console.log('Modifiers::updateSource', this, data);
		this.source = data;
	}

	async save(): Promise<void> {
		// await this.parent.update({ ['flags.sr6.modifiers']: this.source }, { diff: false });
	}

	constructor(parent: TDocument, source: ModifiersSource = {}) {
		this.parent = parent;
		this.source = source;
		this.updateSource(this.source);
	}
}

export function register(): void {}
