/**
 * A special `NumberField` which represents an angle of rotation in degrees between 0 and 360.
 * @property base Whether the base angle should be treated as 360 or as 0
 */
export class EnumNumberField<TEnum extends object, TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true> extends foundry.data.fields.NumberField<
	number,
	number,
	TRequired,
	TNullable,
	THasInitial
> {
	override validate(value: unknown, options?: foundry.data.fields.DataFieldValidationOptions): foundry.data.fields.DataModelValidationFailure | void {
		super.validate(value, options);
	}
}
