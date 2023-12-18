import { Data } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/dice/roll.js";
import { SR6Actor } from "../actors/SR6Actor.js";
import { SR6Item } from "../items/SR6Item.js";
import { Enums, EffectChangeData } from "../config.js";
import { applyChangesetToObject } from "../util.js";


export class SR6RollData {
	actor: SR6Actor | null;
	pool: number;

	constructor(actor: SR6Actor, pool: number = 0) {
		this.actor = actor;
		this.pool = pool;
	}

	applyChangeset(changes: EffectChangeData[]) {
		applyChangesetToObject(this, changes);
	}
}

export class SR6Roll<D extends SR6RollData = SR6RollData> extends Roll<D> {

	static CHAT_TEMPLATE = "systems/sr6/templates/rolls/SR6Roll.html";

	parameters: { glitch: number[], success: number[] } = { glitch: [1], success: [5, 6] };

	constructor(formula: string, data: any = {}, options: any = {}) {
		super(formula,data,options);
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
        return this.sides.reduce((hits, result) => this.parameters.success.includes(result) ? hits + 1 : hits, 0);
    }

    get glitches(): number {
        return this.sides.reduce((glitches, result) => this.parameters.glitch.includes(result) ? glitches + 1 : glitches, 0);
    }

	get is_glitch(): boolean {
    	return this.glitches > Math.floor(this.pool / 2);
    }

    get is_critical_glitch(): boolean {
    	return this.is_glitch && this.hits == 0;
    }

    async render(options: any = {}): Promise<string> {
		if ( !this._evaluated ) await this.evaluate({async: true});
		
		return renderTemplate((this.constructor as any).CHAT_TEMPLATE, {
				user: (game as Game).user!.id,
				tooltip: options.isPrivate ? "" : await this.getTooltip(),
				roll: this,
			});
    }

    toMessage(messageData: any = {}): any {
    	return super.toMessage(messageData);
    }

	static make(data: SR6RollData) : SR6Roll {
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
