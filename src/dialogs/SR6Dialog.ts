import { SR6CONFIG } from "../config.js";
import * as util from "../util.js";

export class SR6Dialog extends FormApplication {

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			closeOnSubmit: false,
			submitOnClose: true,
			submitOnChange: true,
		});
	}

	prepareData() {
		
	}

	activateListeners(html: JQuery): void {
		super.activateListeners(html);

		html.find("[autofocus]")[0]?.focus();

		html.on('keydown', (event) => {
			if ( event.key === "Enter" ) {
				console.log("enter in dialog");
			}
		});


		html.find("input[direct-data], textarea[direct-data], select[direct-data]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			
			let value = util.directDataValue(target);
			
			foundry.utils.setProperty(this, target.id, value);

			this.render(true);
		});

 		html.find("input[direct-data-array]").change((event) => {
			let target = event.currentTarget as HTMLInputElement;
			let array = foundry.utils.getProperty(this, target.id);
			if(target.checked) {
				array.push(target.value);
			} else {
				array = array.filter((v: string) => v !== target.value);
			}

			foundry.utils.setProperty(this, target.id, array);

			this.render(true);
		});

	}

	getData(options: any) {
		let data = super.getData(options);

		(data as any).config = SR6CONFIG;

		return data;
	}

	async _updateObject(event: Event, formData: any) {}
}