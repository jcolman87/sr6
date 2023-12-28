import SR6Actor from '@/actor/SR6Actor';
import CharacterDataModel from '@/actor/data/CharacterDataModel';
import CharacterActor from '@/actor/CharacterActor';

//Provide a type string to class object mapping to keep our code clean
const actorMappings: any = {
	character: CharacterActor,
};

export const SR6ActorProxy = new Proxy(function () {}, {
	//Will intercept calls to the "new" operator
	construct: function (target, args): any {
		const [data] = args;

		//Handle missing mapping entries
		if (!actorMappings.hasOwnProperty(data.type)) throw new Error('Unsupported Entity type for create(): ' + data.type);

		//Return the appropriate, actual object from the right class
		return new actorMappings[data.type](...args);
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
						return data.map((i) => actorMappings[(data as any).type].create(i, options));
					}

					if (!actorMappings.hasOwnProperty(data.type)) throw new Error('Unsupported Entity type for create(): ' + data.type);

					return actorMappings[data.type].create(data, options);
				};

			case Symbol.hasInstance:
				//Applying the "instanceof" operator on the instance object
				return function (instance: any) {
					return Object.values(actorMappings).some((i: any) => instance instanceof i);
				};

			default:
				//Just forward any requested properties to the base Actor class
				// @ts-ignore
				return Actor[prop as any];
		}
	},
});
