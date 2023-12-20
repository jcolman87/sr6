import { SR6Gear } from "./SR6Gear.js";
import { SR6Spell } from "./SR6Spell.js";
import { SR6Item } from "./SR6Item.js";
//Provide a type string to class object mapping to keep our code clean
const itemMappings = {
    Gear: SR6Gear,
    Spell: SR6Spell,
    SIN: SR6Item,
    Lifestyle: SR6Item,
    Contact: SR6Item,
    WeaponAccessor: SR6Item,
    Augmentation: SR6Item,
    Quality: SR6Item,
    AdeptPower: SR6Item,
    Credstick: SR6Item
};
export const SR6ItemProxy = new Proxy(function () { }, {
    //Will intercept calls to the "new" operator
    construct: function (target, args) {
        const [data] = args;
        //Handle missing mapping entries
        if (!itemMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);
        //Return the appropriate, actual object from the right class
        return new itemMappings[data.type](...args);
    },
    //Property access on this weird, dirty proxy object
    get: function (target, prop, receiver) {
        switch (prop) {
            case "create":
            case "createDocuments":
                //Calling the class' create() static function
                return function (data, options) {
                    if (data.constructor === Array) {
                        //Array of data, this happens when creating Actors imported from a compendium
                        return data.map((i) => NumeneraItem.create(i, options));
                    }
                    if (!itemMappings.hasOwnProperty(data.type))
                        throw new Error("Unsupported Entity type for create(): " + data.type);
                    return itemMappings[data.type].create(data, options);
                };
            case Symbol.hasInstance:
                //Applying the "instanceof" operator on the instance object
                return function (instance) {
                    return Object.values(itemMappings).some((i) => instance instanceof i);
                };
            default:
                //Just forward any requested properties to the base Actor class
                return Item[prop];
        }
    }
});
