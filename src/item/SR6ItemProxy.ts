import SR6Item from '@/item/SR6Item';
import SkillDataModel from '@/item/data/SkillDataModel';
import Weapon from '@/item/Weapon';

//Provide a type string to class object mapping to keep our code clean
const itemMappings: any = {
	skill: SR6Item<SkillDataModel>,
	matrix_action: SR6Item<SkillDataModel>,
	weapon: SR6Item<SkillDataModel>,
	matrix_persona: SR6Item<SkillDataModel>,
};

export const SR6ItemProxy = new Proxy(function () {}, {
	//Will intercept calls to the "new" operator
	construct: function (target, args): any {
		const [data] = args;

		//Handle missing mapping entries
		if (!itemMappings.hasOwnProperty(data.type)) throw new Error('Unsupported Entity type for create(): ' + data.type);

		//Return the appropriate, actual object from the right class
		return new itemMappings[data.type](...args);
	},

	//Property access on this weird, dirty proxy object
	get: function (target: any, prop: any, receiver: any): any {
		switch (prop) {
			case 'create':
			case 'createDocuments':
				//Calling the class' create() static function
				return function (data: any, options: any) {
					if (data.constructor === Array) {
						//Array of data, this happens when creating Actors imported from a compendium
						return data.map((i) => itemMappings[(data as any).type].create(i, options));
					}

					if (!itemMappings.hasOwnProperty(data.type)) throw new Error('Unsupported Entity type for create(): ' + data.type);

					return itemMappings[data.type].create(data, options);
				};

			case Symbol.hasInstance:
				//Applying the "instanceof" operator on the instance object
				return function (instance: any) {
					return Object.values(itemMappings).some((i: any) => instance instanceof i);
				};

			default:
				//Just forward any requested properties to the base Actor class
				// @ts-ignore
				return Item[prop as any];
		}
	},
});
