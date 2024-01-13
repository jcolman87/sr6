import path from 'path';
import fs from 'fs';
import Datastore from '@seald-io/nedb';

const PACK_SRC = './packs';

const folders = fs.readdirSync(PACK_SRC).filter((file) => {
	return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
});

const allItems = [];
const allDb = [];

export function recursiveReplace(obj) {
	let ret = false;
	for (let [key, value] of Object.entries(obj)) {
		if (value) {
			if (typeof value === 'object') {
				if (recursiveReplace(value)) {
					ret = true;
				}
			} else if (typeof value === 'string') {
				const arr = /@@([a-zA-Z0-9\-]+):(.*)/g.exec(value);
				if (arr) {
					const pack = arr[1];
					const name = arr[2];
					if (allItems[pack]) {
						if (allItems[pack][name]) {
							const uuid = `Compendium.sr6.${pack}.Item.${allItems[pack][name]._id}`;
							console.log(`Replacing '${name}' with ${uuid}`);
							ret = true;
							obj[key] = uuid;
						}
					}
				}
			}
		}
	}

	return ret;
}

for (const folder of folders) {
	const filename = path.resolve('dist', 'packs', `${folder}.db`);
	allDb[folder] = new Datastore({ filename: filename, autoload: true });
	allItems[folder] = {};
	const docs = await allDb[folder].findAsync({ name: { $exists: true } });
	docs.forEach((doc) => (allItems[folder][doc.name] = doc));
}
for (const [key, db] of Object.entries(allDb)) {
	const docs = await db.findAsync({ name: { $exists: true } });
	for (const doc of docs) {
		if (recursiveReplace(doc)) {
			console.log('writing update', doc);
			await db.updateAsync({ _id: doc._id }, doc);
		}
	}
	db.compactDatafile();
}
