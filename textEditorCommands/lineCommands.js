const vscode = require('vscode');
const {shuffleIndices, sortIndices} = require('../helpers.js');

// All handlers are automatically registered as a TextEditorCommand and subscribed,
// so their names should match their respective names in package.json.

module.exports.reverseLines = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(lineIndices => {
        for (let offset = 0; offset < (lineIndices.length-1)/2; offset++) {
            let lineAbove = textEditor.document.lineAt(lineIndices[offset]);
            let lineBelow = textEditor.document.lineAt(lineIndices.at(-1 - offset));

            textEditorEdit.replace(lineAbove.range, lineBelow.text);
            textEditorEdit.replace(lineBelow.range, lineAbove.text);
        }
    });
}

module.exports.sortLines = sortLines.bind(this, false);
module.exports.sortLinesDescending = sortLines.bind(this, true);
function sortLines(reversed, textEditor, textEditorEdit) {
    // Cache the configuration, assuming it won't change in the middle of a command
    let ignoreIndent = vscode.workspace.getConfiguration("arrangeSelection").get("lines.ignoreIndent");
    let useNaturalSortOrder = vscode.workspace.getConfiguration("arrangeSelection").get("lines.useNaturalSortOrder");

    // CompareFn for Array.prototype.sort()
    let collatorComparer = new Intl.Collator(vscode.env.language, {numeric: useNaturalSortOrder}).compare;
    let comparer = (a, b) => {
        a = textEditor.document.lineAt(a).text;
        b = textEditor.document.lineAt(b).text;

        if (ignoreIndent) {
            a = a.trimStart();
            b = b.trimStart();
        }

        return collatorComparer(a, b) * (reversed ? -1 : 1);
    }

    splitArrangements(textEditor).forEach(lineIndices => {
        // Get a new sorted array which represents the indices of the source array
        lineIndices[sortIndices](comparer).forEach((fromIndex, toIndex) => {
            let replacee = textEditor.document.lineAt(lineIndices[toIndex]).range;
            let replacement = textEditor.document.lineAt(lineIndices[fromIndex]).text;

            textEditorEdit.replace(replacee, replacement);
        });
    });
}

// Same as sortLines, except for the compareFn, where the length is compared instead of the text
module.exports.sortLinesByLength = sortLinesByLength.bind(this, false);
module.exports.sortLinesByLengthDescending = sortLinesByLength.bind(this, true);
function sortLinesByLength(reversed, textEditor, textEditorEdit) {
    // CompareFn for Array.prototype.sort()
    let graphemeSegmenter = new Intl.Segmenter(vscode.env.language);
    let comparer = (a, b) => {
        // a = textEditor.document.lineAt(a).text.length;
        // b = textEditor.document.lineAt(b).text.length;
        for (var {index} of graphemeSegmenter.segment(textEditor.document.lineAt(a).text)) {}
        a = index;
        for ({index} of graphemeSegmenter.segment(textEditor.document.lineAt(b).text)) {}
        b = index;

        return (a<b ? -1 : a>b ? 1 : 0) * (reversed ? -1 : 1);
    }

    splitArrangements(textEditor).forEach(lineIndices => {
        lineIndices[sortIndices](comparer).forEach((fromIndex, toIndex) => {
            let replacee = textEditor.document.lineAt(lineIndices[toIndex]).range;
            let replacement = textEditor.document.lineAt(lineIndices[fromIndex]).text;

            textEditorEdit.replace(replacee, replacement);
        });
    });
}

module.exports.shuffleLines = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(lineIndices => {
        lineIndices[shuffleIndices]().forEach((fromIndex, toIndex) => {
            let replacee = textEditor.document.lineAt(lineIndices[toIndex]).range;
            let replacement = textEditor.document.lineAt(lineIndices[fromIndex]).text;

            textEditorEdit.replace(replacee, replacement);
        });
    });
}

module.exports.filterDuplicateLines = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(lineIndices => {
        let lastUniqueLine;
        lineIndices
            .map(lineIndex => textEditor.document.lineAt(lineIndex).text) // Map the line index to its text
            .forEach((text, relativeIndex, textArray) => {
                if (textArray.indexOf(text) !== relativeIndex) {
                    textEditorEdit.delete(textEditor.document.lineAt(lineIndices[relativeIndex]).rangeIncludingLineBreak);

                    // vscode.TextLine.rangeIncludingLineBreak contains the subsequent line break, but not the previous
                    // So in the edge case that the last line is a duplicate, an empty line will remain at the end of the selection
                    // This fixes it by removing the last untouched line's trailing line break as well
                    if (relativeIndex === lineIndices.length - 1) {
                        lastUniqueLine = textEditor.document.lineAt(lastUniqueLine);
                        textEditorEdit.delete(lastUniqueLine.rangeIncludingLineBreak.with(lastUniqueLine.range.end));
                    }
                } else {
                    lastUniqueLine = relativeIndex;
                }
            });
    });
}


// This returns an array, `arrangements`, where each item represents a isolated arrangement, based on the configuration and selection(s).
// To simplify the command handler, said items are each an array of line index (zero-indexed line number)
//
// An example for clarity — if the first three lines and the sixth line are selected,
// `splitArrangements(textEditor) === [[0, 1, 2, 5]]` if arrangeAcrossMultipleSelection,
// otherwise `splitArrangements(textEditor) === [[0, 1, 2], [5]]`
function splitArrangements(textEditor) {
    let arrangements; // Array of <line index>[]

    if (
        textEditor.selections.length <= 1
        && textEditor.selection.isEmpty
        && vscode.workspace.getConfiguration("arrangeSelection").get("arrangeOnEmptySelection")
    ) {
        arrangements = [Array.from(new Array(textEditor.document.lineCount).keys())];
    } else if (vscode.workspace.getConfiguration("arrangeSelection").get("arrangeAcrossMultipleSelection")) {
        let lineIndices = textEditor.selections.reduce((lineIndices, selection) => {
            for (let lineIndex = selection.start.line; lineIndex <= selection.end.line; lineIndex++) {
                lineIndices.push(lineIndex);
            }
            return lineIndices;
        }, []);

        arrangements = [lineIndices];
    } else {
        arrangements = textEditor.selections.map(selection => {
            let lineIndices = [];
            for (let lineIndex = selection.start.line; lineIndex <= selection.end.line; lineIndex++) {
                lineIndices.push(lineIndex);
            }
            return lineIndices;
        });
    }

    return arrangements;
}