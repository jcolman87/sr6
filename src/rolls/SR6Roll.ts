import { Data, Evaluated, Options } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Gear } from "../items/SR6Gear.js";
import { Enums, EffectChangeData, SR6CONFIG } from "../config.js";
import { applyChangesetToObject } from "../util.js";

export class SR6RollData {
	actor: SR6Actor | null;
	pool: number;

	auto_hits: number;
	explode: boolean = false;

	edge: {
		boost: null | Enums.EdgeBoost;
		action: null | Enums.EdgeAction;
	};

	constructor(actor: SR6Actor, pool: number = 0, explode: boolean = false, auto_hits: number = 0) {
		this.actor = actor;
		this.pool = pool;
		this.explode = explode;
		this.auto_hits = auto_hits;
		this.edge = { boost: null, action: null };
	}

	applyChangeset(changes: EffectChangeData[]) {
		applyChangesetToObject(this, changes);
	}

	applyEdge() {
		if (this.edge.boost != null) {
			let boost = SR6CONFIG.edge_boosts.get(this.edge.boost)!;
			boost.prepareData(this);
			this.applyChangeset(boost.changes);
		}
	}
}

/* 

Wild Die
   In the description of certain gear, spells, and
qualities you’ll find a reference to the wild die. This
little wonder can make or break a move. When a
wild die is in play, use a different color or easi-
ly identifiable die to track the result. The die adds
into the pool directly and a hit with the wild die with the Matrix has the chance to affect all aspects
(5 or 6) counts as 3 hits instead of just 1. On the of a person’s life. That’s why deckers and techno-
downside, a 1 cancels all the 5s rolled. A 2, 3, or 4 mancers are both sought after and feared. They
on the wild die means nothing.
*/

export class SR6Roll<D extends SR6RollData = SR6RollData> extends Roll<D> {
	static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6Roll.html";

	parameters: { glitch: number[]; success: number[] } = { glitch: [1], success: [5, 6] };

	constructor(formula: string, data: any = {}, options: any = {}) {
		super(formula, data, options);
	}

	async finish() {
		if (this.data.explode) {
			await this.explode();
		}
	}
	async finishEdge() {
		console.log("SR6Roll::finishEdge", this);
		if (this.data.edge.boost != null) {
			let boost = SR6CONFIG.edge_boosts.get(this.data.edge.boost)!;
			await boost.apply(this);
		}
		console.log("SR6Roll::finishEdge", this);
	}

	_termsUpdated() {
		let count: number = (this.terms[0] as any).results.length;
		(this.terms[0] as any).number = count;

		this.data.pool = count;
	}

	_getLowestRollIndex(): number {
		return this.sides.indexOf(Math.min.apply(Math, this.sides));
	}

	_updateDie(idx: number, value: number): void {
		console.log("_updateDie", idx, value, (this.terms[0] as any).results);
		(this.terms[0] as any).results[idx].result = value;
	}

	async rerollOne(die: null | number = null): Promise<boolean> {
		if (die == null) {
			die = this._getLowestRollIndex();
		}
		let reroll = new SR6Roll(`1d6`, new SR6RollData(this.data.actor!));
		reroll.evaluate({ async: false });
		await reroll.showVisual();

		this._updateDie(die, (reroll.terms[0] as any).results[0].result);

		return true;
	}

	async addOne(die: null | number = null): Promise<boolean> {
		if (die == null) {
			// Find the best candidate to add one to,

			// First check for glitches and replace
			if (this.glitches - 1 <= Math.floor(this.pool / 2)) {
				let idx_glitch: undefined | number = this.sides.indexOf(1);
				if (idx_glitch != -1) {
					this._updateDie(idx_glitch, this.sides[idx_glitch] + 1);
					return true;
				}
			}

			// this should be a 4 ideally next
			let idx_four: undefined | number = this.sides.indexOf(4);
			if (idx_four != -1) {
				this._updateDie(idx_four, this.sides[idx_four] + 1);
				return true;
			}

			ui.notifications!.warn("You are adding +1 to a roll with no glitches and no near-successes, this was worthless");
			return false;
		}

		return false;
	}

	// return false if there are no hits to buy
	async addHit(): Promise<boolean> {
		this.data.auto_hits += 1;

		return true;
	}

	// return false if there are no hits to buy
	async addHitToPool(die: null | number = null): Promise<boolean> {
		(this.terms[0] as any).results.push({
			active: true,
			result: 5,
			indexThrow: 0
		});
		this._termsUpdated();

		return true;
	}

	// return false if theres no glitches to reroll
	async rerollFailed(): Promise<boolean> {
		let failedList: number[] = [];
		for (let i = 0; i < this.sides.length; i++) {
			if (!this.parameters.success.includes(this.sides[i])) {
				failedList.push(i);
			}
		}

		if (failedList.length == 0) {
			return false;
		}

		let reroll = new SR6Roll(`${failedList.length}d6`, new SR6RollData(this.data.actor!));
		reroll.evaluate({ async: false });
		await reroll.showVisual();

		// Replace the glitches.
		for (let i = 0; i < failedList.length; i++) {
			this._updateDie(failedList[i], (reroll.terms[0] as any).results[i].result);
		}

		return true;
	}

	async showVisual(): Promise<void> {
		if ((game as any).dice3d) {
			// DICE-SO-NICE show the roll
			await (game as any).dice3d.showForRoll(this, (game as Game).user, true);
		}
	}

	async explode() {
		if (this.sixes > 0) {
			console.log(`exploding ${this.sixes} sixes`);
			let explode_roll = new SR6Roll(`${this.sixes}d6`, new SR6RollData(this.data.actor!));
			explode_roll.evaluate({ async: false });
			await explode_roll.showVisual();

			// recurse the explosions
			let explode_results = (explode_roll.terms[0] as any).results;
			if (explode_roll.sixes > 0) {
				explode_roll.explode();
			}

			// Add the results to our results
			(this.terms[0] as any).results = (this.terms[0] as any).results.concat(explode_results);
			this._termsUpdated();
		}
	}

	get sixes(): number {
		return this.sides.reduce((hits, result) => (result == 6 ? hits + 1 : hits), 0);
	}

	get actor(): SR6Actor | null {
		return this.data.actor;
	}

	get pool(): number {
		return this.data.pool;
	}

	get sides(): number[] {
		return (this.terms[0] as any).results.map((result: any) => result.result);
	}

	get hits(): number {
		return this.sides.reduce((hits, result) => (this.parameters.success.includes(result) ? hits + 1 : hits), 0) + this.data.auto_hits;
	}

	get glitches(): number {
		return this.sides.reduce((glitches, result) => (this.parameters.glitch.includes(result) ? glitches + 1 : glitches), 0);
	}

	get is_glitch(): boolean {
		return this.glitches > Math.floor(this.pool / 2);
	}

	get is_critical_glitch(): boolean {
		return this.is_glitch && this.hits == 0;
	}

	async render(options: any = {}): Promise<string> {
		if (!this._evaluated) await this.evaluate({ async: true });

		return renderTemplate((this.constructor as any).CHAT_TEMPLATE, {
			user: (game as Game).user!.id,
			tooltip: options.isPrivate ? "" : await this.getTooltip(),
			roll: this,
			config: SR6CONFIG
		});
	}

	toMessage(messageData: any = {}): any {
		return super.toMessage(messageData);
	}

	static make(data: SR6RollData): SR6Roll {
		return new SR6Roll(`(@pool)d6`, data);
	}

	toJSON() {
		const json = super.toJSON();
		(json as any).data = this.data;
		return json;
	}

	// NOTE: we need to do this to copy in teh actual class instance of the sub-roll caried here
	static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T {
		const roll: Roll = super.fromData(data);

		return roll as T;
	}
}
