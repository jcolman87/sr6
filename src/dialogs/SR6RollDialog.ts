import { SR6Dialog } from "./SR6Dialog.js";
import { SR6Roll, SR6RollData } from "../rolls/SR6Roll.js";

export class SR6RollDialog<R extends SR6Roll = SR6Roll, D extends SR6RollData = SR6RollData> extends SR6Dialog {
	roll: D;
	original: D;

	pool_modifier: number = 0;

	get template(): string {
		return "systems/sr6/templates/dialogs/RollDialog.html";
	}

	constructor(private maker: (roll: D) => R, roll: D, options: any = {}) {
		super({}, options);

		this.roll = roll;
		this.original = Object.assign(Object.create(Object.getPrototypeOf(roll)), roll);
	}

	prepareData() {
		// Reset originals
		this.roll.pool = this.original.pool;

		if(this.roll.pool + this.pool_modifier <= 0) {
			this.pool_modifier += 1 - (this.roll.pool + this.pool_modifier);
		}

		// Apply modifier
		this.roll.pool += this.pool_modifier;
	}

	getData(options: any) {
		let data = super.getData(options);

		this.prepareData();

		(data as any).dialog = this;
		(data as any).roll = this.roll;

		return data;
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);

		html.find("#do-roll").focus();
		html.find("#do-roll").click(this._onComplete.bind(this, html));
	}

	_onComplete() {
		this.prepareData();

		let r: R = this.maker(this.roll);

		r.evaluate({ async: false });
		r.toMessage();

		this.close({});
	}

	/* _onKeyDown
	if ( event.key === "Enter" ) {

      // Only handle Enter presses if an input element within the Dialog has focus
      const dialog = this.element[0];
      if ( !dialog.contains(document.activeElement) || (document.activeElement instanceof HTMLTextAreaElement) ) return;
      event.preventDefault();
      event.stopPropagation();

      // Prefer a focused button, or enact the default option for the dialog
      const button = document.activeElement.dataset.button || this.data.default;
      const choice = this.data.buttons[button];
      return this.submit(choice);
    }
    */

	
}