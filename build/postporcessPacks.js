import path from 'path';
import fs from 'fs';
import Datastore from 'nedb-promises';

const PACK_SRC = './packs';

const folders = fs.readdirSync(PACK_SRC).filter((file) => {
	return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
});

const allItems = [];
const allDb = [];
for (const folder of folders) {
	const filename = path.resolve('dist', 'packs', `${folder}.db`);
	const db = new Datastore({ filename: filename, autoload: true });
	const docs = await db.find({ name: { $exists: true } });
	docs.forEach((doc) => (allItems[doc.name] = doc));
}
