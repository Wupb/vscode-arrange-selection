const vscode = require('vscode');
const lineCommandHandlers = require('./textEditorCommands/lineCommands.js');
const characterCommandHandlers = require('./textEditorCommands/characterCommands.js');

module.exports.activate = function(extensionContext) {
    // Register and subscribe all command handlers
    for (let command of Object.keys(lineCommandHandlers)) {
        extensionContext.subscriptions.push(
            vscode.commands.registerTextEditorCommand(`arrange-selection.${command}`, lineCommandHandlers[command])
        );
    }
    for (let command of Object.keys(characterCommandHandlers)) {
        extensionContext.subscriptions.push(
            vscode.commands.registerTextEditorCommand(`arrange-selection.${command}`, characterCommandHandlers[command])
        );
    }
}