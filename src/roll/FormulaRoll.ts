export default class FormulaRoll extends Roll {
	constructor(formula: string, data?: Record<string, unknown>, options?: RollOptions) {
		super(formula, data, options);
	}
}
