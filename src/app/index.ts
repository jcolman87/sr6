export {};

export class SelectListDialog extends Dialog {
	#resolvePromise?: (value: string | null) => void;

	constructor() {
		super({
			title: 'Test Dialog',
			content: '<p>You must choose either Option 1, or Option 2</p>',
			buttons: {
				one: {
					icon: '<i class="fas fa-check"></i>',
					label: 'Option One',
					callback: () => console.log('Chose One'),
				},
				two: {
					icon: '<i class="fas fa-times"></i>',
					label: 'Option Two',
					callback: () => console.log('Chose Two'),
				},
			},
			default: 'two',
			close: () => console.log('This always is logged no matter which option is chosen'),
		});
	}
}
