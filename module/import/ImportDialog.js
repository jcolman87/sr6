import { SR6Dialog } from "../dialogs/SR6Dialog.js";
export class ImportDialog extends SR6Dialog {
    constructor() {
        super({}, {});
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".go").click(async (event) => {
            let clipItems = await navigator.clipboard.read();
            console.log("clipItems", clipItems);
        });
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            popOut: true,
            width: 400,
            height: 600,
            resizable: true,
            closeOnSubmit: false,
            submitOnClose: true,
            submitOnChange: true,
            template: "systems/sr6/templates/dialogs/ImportDialog.html",
            tabs: []
        });
    }
}
export function addImportButton(app, html, data) {
    let button = $("<button class='import-dialog'><i class='fas fa-edit'></i></i>Import</button>");
    button.click(async () => {
        new ImportDialog().render(true);
    });
    // Render Button
    $(html).find('.header-actions').append(button);
}
