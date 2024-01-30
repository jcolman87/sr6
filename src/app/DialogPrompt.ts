import SR6Actor from '@/actor/SR6Actor';
import { ContextBase } from '@/vue/SheetContext';
import VueSheet from '@/vue/VueSheet';
import VueSelectActorPrompt from '@/vue/apps/SelectActorPrompt.vue';
import { Component } from 'vue';

export interface DialogPromptContext<TResult, TData> extends ContextBase {
	app: DialogPrompt<TResult, TData>;
	data: TData;
	resolvePromise: (value: TResult) => void;
}
export class DialogPrompt<TResult, TData> extends VueSheet(Application) {
	data: TData;
	_vueComponent: Component;
	#resolvePromise?: (value: TResult | null) => void;

	static async prompt<TResult, TData = null>(
		vueComponent: Component,
		data: TData,
		options?: ApplicationOptions,
	): Promise<TResult | null> {
		const prompt = new DialogPrompt<TResult, TData>(data, vueComponent);
		await prompt.render(true);

		return new Promise<TResult | null>((resolve) => {
			prompt.#resolvePromise = resolve;
		});
	}

	constructor(data: TData, vueComponent: Component, options?: ApplicationOptions) {
		super(options);
		this.data = data;
		this._vueComponent = vueComponent;
	}

	override async close(options: {} = {}): Promise<void> {
		return super.close(options);
	}

	async getVueContext(): Promise<DialogPromptContext<TResult, TData>> {
		return {
			app: this,
			data: this.data,
			resolvePromise: async (data) => {
				this.#resolvePromise?.(data);
				this.#resolvePromise = undefined;

				await this.close();
			},
		};
	}

	get vueComponent(): Component {
		return this._vueComponent;
	}
}

export function testDialog(): void {
	const result = DialogPrompt.prompt<SR6Actor>(VueSelectActorPrompt, null, {
		...DialogPrompt.defaultOptions,
		classes: ['app-select-actor-prompt'],
		width: 500,
		height: 400,
	});
}
(window as any).testDialog = testDialog;
