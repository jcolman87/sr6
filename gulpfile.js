import fs from 'fs';
import gulp from 'gulp';
import child_process from 'child_process';

import through2 from 'through2';
import mergeStream from 'merge-stream';
import yaml from 'js-yaml';
import Datastore from '@seald-io/nedb';
import path from 'path';

const { dest, series, src } = gulp;

import gulpClean from 'gulp-clean';
import gulpYaml from 'gulp-yaml';
import gulpZip from 'gulp-zip';

const PACK_SRC = './packs';
function compilePacks() {
	// determine the source folders to process
	const folders = fs.readdirSync(PACK_SRC).filter((file) => {
		return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
	});

	// process each folder into a compendium db
	const packs = folders.map((folder) => {
		const filename = path.resolve('dist', 'packs', `${folder}.db`);
		fs.unlink(filename, function (err) {});
		const db = new Datastore({ filename: filename, autoload: true });

		return gulp.src(path.join(PACK_SRC, folder, '/**/*.yml')).pipe(
			through2.obj((file, enc, cb) => {
				let json = yaml.loadAll(file.contents.toString());
				db.insert(json);
				cb(null, file);
			}),
		);
	});

	return mergeStream.call(null, packs);
}

export function zip() {
	let version;
	try {
		const systemJsonFile = fs.readFileSync('dist/system.json', { encoding: 'utf8' });
		const systemJson = JSON.parse(systemJsonFile);
		version = systemJson['version'];
	} catch {
		version = 'unknown';
	}

	return src('dist/**/*')
		.pipe(gulpZip(`sr6-${version}.zip`))
		.pipe(dest('.'));
}

export function clean() {
	return src(['public/lang/', 'public/system.json', 'public/template.json'], { allowEmpty: true }).pipe(gulpClean());
}

export function data() {
	return src('yaml/**/*.yml').pipe(gulpYaml()).pipe(dest('public/'));
}

function postprocessPacks() {
	return child_process.exec('node build/postprocessPacks.js');
}

function watchDirs() {
	gulp.watch('yaml/**/*.yml', data);
	gulp.watch('packs/**/*.yml', packs);
}

export const packs = series(compilePacks, postprocessPacks);

export const watch = series(clean, data, packs, watchDirs);
export default series(clean, packs, data);
