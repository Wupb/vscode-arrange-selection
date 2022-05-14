const vscode = require('vscode');
const untitledDocument = require('../untitledDocument.js');

// To avoid making changes to settings.json...
let temporarySettings, // Similar to settings.json, but without the scope
    originalGetConfiguration, // vscode.workspace.getConfiguration
    workspaceConfiguration = { // Use this mocked WorkspaceConfiguration object during the test
    get(section) {
        return temporarySettings?.[section] ?? originalGetConfiguration('arrangeSelection').get(section);
    },
}

suite('Configuration Test Suite', () => {
    setup(() => {
        // Temporarily wrap vscode.workspace.getConfiguration
        originalGetConfiguration = vscode.workspace.getConfiguration;
        vscode.workspace.getConfiguration = (section, scope) => {
            return section === 'arrangeSelection' ? workspaceConfiguration : originalGetConfiguration(section, scope);
        }
    });

    teardown(() => {
        // Unwrap vscode.workspace.getConfiguration
        vscode.workspace.getConfiguration = originalGetConfiguration;
        originalGetConfiguration = temporarySettings = undefined;
    });

    test('arrangeOnEmptySelection', async () => {
        temporarySettings = {arrangeOnEmptySelection: true};
        await untitledDocument.assertCommand(
            '<>',
            [new vscode.Selection(0, 0, 0, 0)],
            'reverseCharacters',
            '><'); // Reversed

        temporarySettings = {arrangeOnEmptySelection: false};
        await untitledDocument.assertCommand(
            '<>',
            [new vscode.Selection(0, 0, 0, 0)],
            'reverseCharacters',
            '<>'); // Unchanged
    });

    test('arrangeAcrossMultipleSelection', async () => {
        temporarySettings = {arrangeAcrossMultipleSelection: true};
        await untitledDocument.assertCommand(
            '012345',
            [new vscode.Selection(0, 0, 0, 2), new vscode.Selection(0, 4, 0, 6),], // First 2 digits and last 2 digits
            'reverseCharacters',
            '542310');

        temporarySettings = {arrangeAcrossMultipleSelection: false};
        await untitledDocument.assertCommand(
            '012345',
            [new vscode.Selection(0, 0, 0, 2), new vscode.Selection(0, 4, 0, 6),], // First 2 digits and last 2 digits
            'reverseCharacters',
            '102354');
    });

    test('lines.ignoreIndent', async () => {
        temporarySettings = {'lines.ignoreIndent': true};
        await untitledDocument.assertCommand('  B\r\nA', null, 'sortLines', 'A\r\n  B'); // A should be ordered before B despite the preceding whitespace

        temporarySettings = {'lines.ignoreIndent': false};
        await untitledDocument.assertCommand('  B\r\nA', null, 'sortLines', '  B\r\nA'); // Space should be ordered before the latin alphabets
    });

    test('lines.useNaturalSortOrder', async () => {
        temporarySettings = {'lines.useNaturalSortOrder': true};
        await untitledDocument.assertCommand('10\r\n5', null, 'sortLines', '5\r\n10');

        temporarySettings = {'lines.useNaturalSortOrder': false};
        await untitledDocument.assertCommand('10\r\n5', null, 'sortLines', '10\r\n5');
    });

    test('characters.ignoreLineBreaks', async () => {
        temporarySettings = {'characters.ignoreLineBreaks': true};
        await untitledDocument.assertCommand('B\r\nA', null, 'sortCharacters', 'A\r\nB');

        temporarySettings = {'characters.ignoreLineBreaks': false};
        await untitledDocument.assertCommand('B\r\nA', null, 'sortCharacters', '\r\nAB'); // Newline should be ordered before the latin alphabets
    });
});