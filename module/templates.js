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
        "systems/sr6/templates/actors/parts/tab-matrix.html",
        "systems/sr6/templates/actors/parts/tab-effects.html",
        //
        "systems/sr6/templates/items/parts/tab-basics.html",
        "systems/sr6/templates/items/parts/tab-effects.html",
        "systems/sr6/templates/items/parts/tab-matrix.html",
        "systems/sr6/templates/items/parts/tab-weapon.html",
        //
        "systems/sr6/templates/dialogs/shared-header.html",
        "systems/sr6/templates/dialogs/shared-footer.html",
        "systems/sr6/templates/dialogs/shared-edge-boost.html",
        //
        "systems/sr6/templates/rolls/shared-header.html",
        "systems/sr6/templates/rolls/shared-footer.html",
        "systems/sr6/templates/rolls/shared-edge-boost.html",
    ];
    return loadTemplates(templatePaths);
};
