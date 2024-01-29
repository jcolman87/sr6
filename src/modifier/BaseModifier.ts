import { getClass } from '@/data/serialize';
import { checkConditions, ConditionalData } from '@/effect/conditional';
import { IModifier, ModifierSourceData, ModifierSourceUUID } from '@/modifier';
import { ITest } from '@/test';
import { ConstructorOf } from '@/util';
import { Err, Ok, Result } from 'ts-results';

export default class BaseModifier<
	TData extends ModifierSourceData = ModifierSourceData,
	TParent extends foundry.abstract.Document = foundry.abstract.Document,
	TSource extends foundry.abstract.Document = foundry.abstract.Document,
> implements IModifier
{
	_parent: TParent;
	_source: TSource;
	conditions: ConditionalData[];
	data: TData;

	get class(): string {
		return this.constructor.name;
	}

	get name(): string {
		return this.data!.name || '[Missing name]';
	}

	get description(): string {
		return this.data!.description || '';
	}

	get parent(): foundry.abstract.Document {
		return this._parent;
	}

	get source(): foundry.abstract.Document {
		return this._source;
	}

	isApplicable(_test: Maybe<ITest> = null): boolean {
		if (this.conditions.length === 0) {
			return true;
		}

		return checkConditions(this.source, this.parent, this.conditions).ok;
	}

	static fromData<TDocument extends foundry.abstract.Document>(
		data: ModifierSourceData,
		creatingParent: Maybe<TDocument> = undefined,
	): Result<IModifier, string> {
		const parent = fromUuidSync(data.parent!);
		const source = fromUuidSync(data.source!);

		if ((!parent || !source) && !creatingParent) {
			return Err(`Source or parent document didnt exist: ${parent}, ${source}`);
		}
		if (!parent && creatingParent) {
			data.parent = creatingParent.uuid as ModifierSourceUUID;
		}
		if (!source && creatingParent) {
			data.source = creatingParent.uuid as ModifierSourceUUID;
		}

		const cls = getClass<ConstructorOf<BaseModifier>>(CONFIG.sr6.types.modifiers, data);
		if (cls.ok) {
			return Ok(new cls.val({ parent, source, conditions: data.conditions, data }) as unknown as IModifier);
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
