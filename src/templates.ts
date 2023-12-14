export const preloadHandlebarsTemplates = async function () {
	const templatePaths = [
		"systems/sr6/templates/actors/parts/attributes.html",
		"systems/sr6/templates/actors/parts/tab-basics.html",
		"systems/sr6/templates/actors/parts/tab-basics.html",
		"systems/sr6/templates/actors/parts/tab-skills.html",
		"systems/sr6/templates/actors/parts/tab-combat.html",
		"systems/sr6/templates/actors/parts/tab-gear.html",
		"systems/sr6/templates/actors/parts/tab-skills.html",
		"systems/sr6/templates/actors/parts/tab-combat.html",
		"systems/sr6/templates/actors/parts/tab-matrix.html"
	];

	return loadTemplates(templatePaths);
};
