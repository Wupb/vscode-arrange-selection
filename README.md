# Arrange Selection
VS Code extension to sort, shuffle, reverse, or filter selected lines or characters.



# Features

## Arranging lines

### Reversing lines
Command: `arrange-selection.reverseLines`

![Reverse lines.gif](assets/images/Reverse%20lines.gif)

### Sorting lines
Command: `arrange-selection.sortLines` and `arrange-selection.sortLinesDescending`

![Sort lines.gif](assets/images/Sort%20lines.gif)

### Sorting lines by line length
Command: `arrange-selection.sortLinesByLength` and `arrange-selection.sortLinesByLengthDescending`

![Sort lines by length.gif](assets/images/Sort%20lines%20by%20length.gif)

### Shuffling lines
Command: `arrange-selection.shuffleLines`

![Shuffle lines.gif](assets/images/Shuffle%20lines.gif)

### Filtering duplicate lines
Command: `arrange-selection.filterDuplicateLines`
* Keeps only the first unique line(s)

![Filter lines.gif](assets/images/Filter%20lines.gif)

## Arranging characters
A character being a grapheme, so composite characters should be arranged as one.

### Reverse characters
Command: `arrange-selection.reverseCharacters`

![Reverse characters.gif](assets/images/Reverse%20characters.gif)


### Sorting characters
Command: `arrange-selection.sortCharacters` and `arrange-selection.sortCharactersDescending`

![Sort characters.gif](assets/images/Sort%20characters.gif)

### Shuffling characters
Command: `arrange-selection.shuffleCharacters`

![Shuffle characters.gif](assets/images/Shuffle%20characters.gif)

### Filtering duplicate characters
Command: `arrange-selection.filterDuplicateCharacters`
* Keeps only the first unique character(s)

![Filter characters.gif](assets/images/Filter%20characters.gif)

## Command
All commands are available in both the context menu (visible only if something is selected) and the command palette.\
![Command Palette.gif](assets/images/Command%20Palette.png)

## Keybinds
Nothing is bind by default, however, they can be added to the corresponding command.
![Keyboard shortcuts.png](assets/images/Keyboard%20shortcuts.png)



# Extension Settings

Setting | Description
--- | ---
`arrangeSelection.arrangeOnEmptySelection` | When nothing is selected, specifies wether to arrange the entire document 
`arrangeSelection.arrangeAcrossMultipleSelection` | When there are multiple selections, specifies wether to arrange them independently or as a whole
`arrangeSelection.lines.ignoreIndent` | When sorting lines, specifies wether to ignore whitespace to the left of each line
`arrangeSelection.lines.useNaturalSortOrder` | When sorting lines, specifies wether to use [natural sort order](https://en.wikipedia.org/wiki/Natural_sort_order)
`arrangeSelection.characters.ignoreLineBreaks` | When arranging characters, specifies wether to skip/ignore newline control characters