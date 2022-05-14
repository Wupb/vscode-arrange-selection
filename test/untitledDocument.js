const assert = require('assert');
const vscode = require('vscode');
let promise, textEditor;


// A singleton that represents an untitled document in the editor


// Opens a new or existing untitled document
// Returns a promise that resolves when the document is created or already exists
module.exports.open = function(content = '') {
    return promise ??= vscode.workspace.openTextDocument({content})
        .then(vscode.window.showTextDocument)
        .then(activeTextEditor => { textEditor = activeTextEditor; });
}

// Assert the document content against `expectedText` after running `command`
// Returns a promise that may resolve the return value of assert.strictEqual, otherwise rejects
module.exports.assertCommand = function(initialText, selections, command, expectedText) {
    let rejectablePromise = module.exports.open().then(async () => {
        // Replace document's content with `initialText`
        await vscode.commands.executeCommand('editor.action.selectAll'); // Selection → Select All
        let success = await textEditor.edit(textEditorEdit => {
            textEditorEdit.replace(textEditor.selection, initialText);
        });
        if (!success) { throw new Error("Could not make an edit") }

        // Update selections
        if (selections) {
            textEditor.selections = selections;
        } else {
            await vscode.commands.executeCommand('editor.action.selectAll');
        }

        // Run the command prefixed with the extension name
        await vscode.commands.executeCommand(`arrange-selection.${command}`);

        // Assert result
        return assert.strictEqual(textEditor.document.getText(), expectedText);
    });

    promise = rejectablePromise.catch((/*reason*/) => {});
    return rejectablePromise;
}

// Clean up by closing the editor
// Returns a promise that resolves when the document is closed
module.exports.close = function() {
    let returnPromise = promise
        ? promise.finally(vscode.commands.executeCommand.bind(null, 'workbench.action.closeActiveEditor'))
        : Promise.resolve();
    promise = textEditor = undefined;
    return returnPromise;
}