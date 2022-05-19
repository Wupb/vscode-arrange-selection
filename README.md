# Arrange Selection

[![marketplace](https://img.shields.io/visual-studio-marketplace/v/Wupb.arrange-selection?label=marketplace)
](https://marketplace.visualstudio.com/items?itemName=Wupb.arrange-selection)[
![last commit](https://img.shields.io/github/last-commit/Wupb/vscode-arrange-selection)
](https://github.com/Wupb/vscode-arrange-selection)[
![issues](https://img.shields.io/github/issues/Wupb/vscode-arrange-selection)
](https://github.com/Wupb/vscode-arrange-selection/issues)[
![license](https://img.shields.io/github/license/Wupb/vscode-arrange-selection)
](https://github.com/Wupb/vscode-arrange-selection/blob/master/LICENSE)


Visual Studio Code extension to sort, shuffle, reverse, or filter selected lines or characters. 



## Features

### Arranging lines

#### Reversing lines: `arrange-selection.reverseLines`

![Reverse lines.gif](assets/images/Reverse%20lines.gif)

#### Sorting lines: `arrange-selection.sortLines` & `arrange-selection.sortLinesDescending`

![Sort lines.gif](assets/images/Sort%20lines.gif)

#### Sorting lines by line length: `arrange-selection.sortLinesByLength` & `arrange-selection.sortLinesByLengthDescending`

![Sort lines by length.gif](assets/images/Sort%20lines%20by%20length.gif)

#### Shuffling lines: `arrange-selection.shuffleLines`

![Shuffle lines.gif](assets/images/Shuffle%20lines.gif)

#### Filtering duplicate lines: `arrange-selection.filterDuplicateLines`
* Keeps only the first unique line(s)

![Filter lines.gif](assets/images/Filter%20lines.gif)

### Arranging characters
A character being a grapheme, so composite characters should be arranged as one.

#### Reverse characters: `arrange-selection.reverseCharacters`

![Reverse characters.gif](assets/images/Reverse%20characters.gif)


#### Sorting characters: `arrange-selection.sortCharacters` & `arrange-selection.sortCharactersDescending`

![Sort characters.gif](assets/images/Sort%20characters.gif)

#### Shuffling characters: `arrange-selection.shuffleCharacters`

![Shuffle characters.gif](assets/images/Shuffle%20characters.gif)

#### Filtering duplicate characters: `arrange-selection.filterDuplicateCharacters`
* Keeps only the first unique character(s)

![Filter characters.gif](assets/images/Filter%20characters.gif)

### Command
All commands are available in both the context menu (visible only if something is selected) and the command palette (<kbd>⇧</kbd>+<kbd>⌘</kbd>+<kbd>P</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, or <kbd>F1</kbd>).

![Command Palette.gif](assets/images/Command%20Palette.png)

### Keybinds
Nothing is bind by default, however, they can be added to the corresponding command.

![Keyboard shortcuts.png](assets/images/Keyboard%20shortcuts.png)



## Extension Settings

Setting | Description
--- | ---
`arrangeSelection.arrangeOnEmptySelection` | When nothing is selected, specifies whether to arrange the entire document 
`arrangeSelection.arrangeAcrossMultipleSelection` | When there are multiple selections, specifies whether to arrange them independently or as a whole
`arrangeSelection.selectDuplicates` | When filtering duplicates lines or characters, specifies whether to delete or select the duplicates
`arrangeSelection.lines.ignoreIndent` | When sorting lines, specifies whether to ignore whitespace to the left of each line
`arrangeSelection.lines.useNaturalSortOrder` | When sorting lines, specifies whether to use [natural sort order](https://en.wikipedia.org/wiki/Natural_sort_order)
`arrangeSelection.characters.ignoreLineBreaks` | When arranging characters, specifies whether to skip/ignore newline control characters