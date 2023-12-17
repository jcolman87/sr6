import { SR6Dialog } from "./SR6Dialog.js";
import { SR6Roll } from "../SR6Roll.js";

export class RollDialog extends SR6Dialog {
	pool_modifier: number;
	current_pool: number;
	base_pool: number;

	constructor() {
		super({}, {});

		this.pool_modifier = 0;
		this.current_pool = 0;
		this.base_pool = 0;
	}

	getBasePool(): number { return 0; }
	getCurrentPool(): number  { 
		return this.getBasePool() + this.pool_modifier;
	}

	getRollData(html: JQuery) : any {}

	getData(options: any) {
		let data = super.getData(options);

		this.current_pool = this.getCurrentPool();
		this.base_pool = this.getBasePool();

		(data as any).data = this;

		return data;
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);

		html.find("#do-roll").click(this._onComplete.bind(this, html));
	}

	_onComplete(html: JQuery, event: JQuery.ClickEvent) {
		this.current_pool = this.getCurrentPool();

		let roll = new SR6Roll(`${this.current_pool}d6`, this.getRollData(html));

		roll.evaluate({ async: false });
		roll.toMessage(roll, {});

		this.close({});
	}
}