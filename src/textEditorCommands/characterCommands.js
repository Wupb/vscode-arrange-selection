const vscode = require('vscode');
const {shuffleIndices, sortIndices} = require('../helpers.js');

// All handlers are automatically registered as a TextEditorCommand and subscribed,
// so their names should match their respective names in package.json.

module.exports.reverseCharacters = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(graphemeRanges => {
        let middleIndex = (graphemeRanges.length - 1) / 2; // May end in *.5, but does not matter
        for (let i = 0; i < middleIndex; i++) {
            let rangeBefore = graphemeRanges[i];
            let rangeAfter = graphemeRanges.at(-1 - i);

            textEditorEdit.replace(rangeBefore, textEditor.document.getText(rangeAfter));
            textEditorEdit.replace(rangeAfter, textEditor.document.getText(rangeBefore));
        }
    });
}

module.exports.sortCharacters = sortCharacters.bind(this, false);
module.exports.sortCharactersDescending = sortCharacters.bind(this, true);
function sortCharacters(reversed, textEditor, textEditorEdit) {
    // CompareFn for Array.prototype.sort()
    let collatorComparer = new Intl.Collator(vscode.env.language).compare;
    let comparer = (a, b) => {
        a = textEditor.document.getText(a);
        b = textEditor.document.getText(b);

        return collatorComparer(a, b) * (reversed ? -1 : 1);
    }

    splitArrangements(textEditor).forEach(graphemeRanges => {
        graphemeRanges[sortIndices](comparer).forEach((fromIndex, toIndex) => {
            let replacee = graphemeRanges[toIndex];
            let replacement = textEditor.document.getText(graphemeRanges[fromIndex]);

            textEditorEdit.replace(replacee, replacement);
        });
    });
}

module.exports.shuffleCharacters = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(graphemeRanges => {
        graphemeRanges[shuffleIndices]().forEach((fromIndex, toIndex) => {
            let replacee = graphemeRanges[toIndex];
            let replacement = textEditor.document.getText(graphemeRanges[fromIndex]);

            textEditorEdit.replace(replacee, replacement);
        });
    });
}

module.exports.filterDuplicateCharacters = function(textEditor, textEditorEdit) {
    splitArrangements(textEditor).forEach(graphemeRanges => {
        // Find the duplicates
        let duplicates = [];
        graphemeRanges
            .map(graphemeRange => textEditor.document.getText(graphemeRange)) // Map the range to the grapheme string
            .forEach((grapheme, relativeIndex, graphemeArray) => {
                if (graphemeArray.indexOf(grapheme) !== relativeIndex) {
                    duplicates.push(graphemeRanges[relativeIndex]);
                }
            });

        // Delete or select the ranges
        if (vscode.workspace.getConfiguration("arrangeSelection").get("selectDuplicates")) {
            textEditor.selections = duplicates.map(range => new vscode.Selection(range.start, range.end));

            // Not strictly necessary, however, when the command is run from the command palette, the editor focus is lost
            // This avoids accidentally losing the selection (by clicking anywhere in the editor) when trying to regain focus
            vscode.window.showTextDocument(textEditor.document);
        } else {
            duplicates.forEach(textEditorEdit.delete.bind(textEditorEdit));
        }
    });
}


// This returns an array, `arrangements`, where each item represents a isolated arrangement, based on the configuration and selection(s).
// To simplify the command handler, said items are each an array of vscode.Range that encompasses a single grapheme.
function splitArrangements(textEditor) {
    let arrangements = []; // Array of array of vscode.Range

    // Initially, add vscode.Range to arrangements
    if (
        textEditor.selections.length <= 1
        && textEditor.selection.isEmpty
        && vscode.workspace.getConfiguration("arrangeSelection").get("arrangeOnEmptySelection")
    ) {
        let lastLine = textEditor.document.lineCount - 1;
        let documentRange = textEditor.document.lineAt(lastLine).range.with(new vscode.Position(0, 0));
        arrangements.push([documentRange]);
    } else if (vscode.workspace.getConfiguration("arrangeSelection").get("arrangeAcrossMultipleSelection")) {
        arrangements.push(textEditor.selections); // vscode.Selection is a subclass of vscode.Range
    } else {
        arrangements = textEditor.selections.map(i => [i]);
    }

    // Split each vscode.Range to multiple ranges so each new range is within a single line
    if (vscode.workspace.getConfiguration("arrangeSelection").get("characters.ignoreLineBreaks")) {
        arrangements = arrangements.map(ranges => {
            return ranges.flatMap(range => {
                let lineRanges = [];
                let startLine = range.start.line;
                let endLine = range.end.line;

                for (let currentLine = startLine; currentLine <= endLine; currentLine++) {
                    let lineRange = range.intersection(textEditor.document.lineAt(currentLine).range);
                    lineRanges.push(lineRange);
                }
                return lineRanges;
            });
        });
    }

    // Split each vscode.Range to multiple ranges where each represents a grapheme
    let graphemeSegmenter = new Intl.Segmenter(vscode.env.language);
    arrangements = arrangements.map(ranges => {
        return ranges.flatMap(range => {
            let text = textEditor.document.getText(range);
            let startIndex = textEditor.document.offsetAt(range.start);
            let indexes = [];

            for (let {segment} of graphemeSegmenter.segment(text)) {
                let nextStartIndex = startIndex + segment.length;

                let graphemeRange = new vscode.Range(
                    textEditor.document.positionAt(startIndex),
                    textEditor.document.positionAt(nextStartIndex)
                );
                indexes.push(graphemeRange);

                startIndex = nextStartIndex;
            }

            return indexes;
        });
    });

    return arrangements;
}