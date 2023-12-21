import { SR6Item } from "./SR6Item.js";
export class SR6Spell extends SR6Item {
    get drain() {
        return this.getData().drain;
    }
    get damage() {
        return this.getData().damage;
    }
    get range() {
        return this.getData().range;
    }
    get duration() {
        return this.getData().duration;
    }
    getData() {
        let data = this.system;
        return data;
    }
}
