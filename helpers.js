/*
Shuffles the array in-place using Fisher-Yates Shuffle.

Example:
const {shuffle} = require('./helpers.js');
["A", "B", "C", "D"][shuffle](); // ["D", "C", "B", "A"]
*/
const shuffle = module.exports.shuffle = Symbol("shuffle");
Array.prototype[shuffle] = function() {
    for (var i = this.length - 1; i; i--) { // 0 < i < array.length
        let swapIndex = Math.floor(Math.random() * (i + 1)); // 0 ≤ swapIndex ≤ i
        [this[i], this[swapIndex]] = [this[swapIndex], this[i]];
    }

    return this;
};


/*
Shuffles the array without mutating the array, and instead, returns a shuffled array of the original's indices.

Example:
const {shuffleIndices} = require('./helpers.js');
["A", "B", "C", "D"][shuffleIndices](); // [1, 0, 3, 2]
*/
const shuffleIndices = module.exports.shuffleIndices = Symbol("shuffleIndices");
Array.prototype[shuffleIndices] = function() {
    return Array.from(new Array(this.length).keys())[shuffle]();
};


/*
Sorts the array using Array.prototype.sort() without mutating the array, and instead, returns an array of the same size where each item is the index that should go in its place.

Example:
const {sortIndices} = require('./helpers.js');

["z", "y", "x"][sortIndices](); // [2, 1, 0]

const comparer = (a, b) => (a.length>b.length ? 1 : a.length<b.length ? -1 : 0);
["CCC", "DDDD", "A", "BB"][sortIndices](comparer); // [2, 3, 0, 1]
*/
const sortIndices = module.exports.sortIndices = Symbol("sortIndices");
Array.prototype[sortIndices] = function(compareFn = (a, b) => (a<b ? -1 : a>b ? 1 : 0)) {
    return Array.from(new Array(this.length).keys()).sort((a, b) => compareFn(this[a], this[b]));
};