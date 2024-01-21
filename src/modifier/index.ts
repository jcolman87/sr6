import { ConditionalData, checkConditions } from '@/effect/conditional';
import { ConstructorOf } from '@/util';
import { ITest } from 'src/roll/test';
import { getClass, ClassData } from '@/data/serialize';
import { Result, Err, Ok } from 'ts-results';

type ModifierSourceUUID =
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

type ModifierSourceData = {
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

export class BaseModifier<
	TData extends ModifierSourceData = ModifierSourceData,
	TParent extends foundry.abstract.Document = foundry.abstract.Document,
	TSource extends foundry.abstract.Document = foundry.abstract.Document,
> {
	_parent: TParent;
	_source: TSource;
	conditions: ConditionalData[];
	data: TData;

	get class(): string {
		return this.constructor.name;
	}

	get name(): string {
		return this.data!.name;
	}

	get description(): string {
		return this.data!.description;
	}

	get parent(): foundry.abstract.Document {
		return this._parent;
	}

	get source(): foundry.abstract.Document {
		return this._source;
	}

	get isApplicable(): boolean {
		if (this.conditions.length < 1) {
			return true;
		}

		return checkConditions(this.source, this.parent, this.conditions).ok;
	}

	static fromData(data: ModifierSourceData): Result<IModifier, string> {
		if (!data.parent || !data.source) {
			return Err(`Source or parent document cannot be undefined: ${data.parent}, ${data.source}`);
		}

		const parent = fromUuidSync(data.parent!);
		const source = fromUuidSync(data.source!);

		if (!parent || !source) {
			return Err(`Source or parent document didnt exist: ${parent}, ${source}`);
		}

		if (!parent || !source) {
			return Err(`Source or parent document didnt exist: ${parent}, ${source}`);
		}

		const cls = getClass<ConstructorOf<BaseModifier>>(CONFIG.sr6.types.modifiers, data);
		if (cls.ok) {
			return Ok(new cls.val({ parent, source, conditions: data.conditions, data }));
		}
		throw '';
	}

	toJSON(): ModifierSourceData {
		return {
			name: this.name,
			description: this.description,
			class: this.constructor.name,
			parent: this.parent.uuid as ModifierSourceUUID,
			source: this.source.uuid as ModifierSourceUUID,
			conditions: this.conditions,
		};
	}

	constructor({
		parent,
		source,
		conditions,
		data,
	}: {
		parent: TParent;
		source: TSource;
		conditions?: ConditionalData[];
		data: TData;
	}) {
		this.data = data;
		this._parent = parent;
		this._source = source;
		this.conditions = conditions ? conditions : [];
	}
}

export interface TestPoolModifierSourceData extends ModifierSourceData {
	testClasses: string[];
	value: number;
}

export class TestPoolModifier extends BaseModifier<TestPoolModifierSourceData> {
	get value(): number {
		return this.data!.value;
	}

	get testClasses(): string[] {
		return this.data!.testClasses;
	}

	prepareTest<TTest extends ITest>(test: TTest): void {
		test.data.pool! += this.value;
	}

	override toJSON(): ModifierSourceData {
		return {
			...super.toJSON(),
			value: this.value,
			testClasses: this.testClasses,
		};
	}

	constructor({
		parent,
		source,
		conditions,
		data,
	}: {
		parent: foundry.abstract.Document;
		source: foundry.abstract.Document;
		conditions?: ConditionalData[];
		data: TestPoolModifierSourceData;
	}) {
		super({ parent, source, conditions, data });
	}
}

export function register(): void {}

export function config(): Record<string, unknown> {
	return {
		TestPoolModifier: TestPoolModifier,
	};
}
