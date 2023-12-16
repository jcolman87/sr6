export class SR6Dialog extends FormApplication {
	activateListeners(html: JQuery): void {
		super.activateListeners(html);

		html.find(":input[direct-data]").change((event) => {
 			let target = event.currentTarget as HTMLInputElement;
 			
 			let value: string | number;
			if (target.type == "number" || target.dataset["type"] == "number") {
				value = parseInt(target.value);
				if(isNaN(value)) {
					value = 0;
				}
			} else {
				value = target.value;
			}
			if (value == undefined) {
					value = 0;
				}

 			(this as any)[target.id] = value;
 			
 			this.render(true);
 		});
	}

	async _updateObject(event: Event, formData: any) {}
}