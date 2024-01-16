import BaseDataModel from '@/data/BaseDataModel';
import * as DocumentConditional from '@/effect/DocumentConditional';

export enum ConditionalType {
	Document = 'document',
}

export interface ConditionalData {
	type: ConditionalType;
	data?: object;
}

export abstract class ConditionalDataModel extends BaseDataModel implements ConditionalData {
	abstract type: ConditionalType;
	abstract data?: object;

	static defineSchema(): foundry.data.fields.DataSchema {
		const fields = foundry.data.fields;

		return {
			type: new fields.StringField({
				initial: ConditionalType.Document,
				required: true,
				nullable: false,
				blank: false,
				choices: Object.values(ConditionalType),
			}),
			data: new fields.ObjectField({
				initial: undefined,
				required: false,
				nullable: false,
			}),
		};
	}
}

export function conditionsCheck(
	origin: foundry.abstract.Document | null,
	target: foundry.abstract.Document,
	conditions: ConditionalData[],
): Result<null, ConditionalData> {
	// return true here will make a failure, as we are finding conditions NOT met.
	const failure = conditions.find((condition) => {
		switch (condition.type) {
			case ConditionalType.Document: {
				return !DocumentConditional.check(origin, target, condition.data);
			}
		}
	});
	if (failure) {
		return Err(failure!);
	} else {
		return Ok(null);
	}
}
