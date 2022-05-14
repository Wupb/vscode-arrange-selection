const untitledDocument = require('../untitledDocument.js');

suite('Character Commands Test Suite', () => {
    test('Reverse characters', async () => {
        await untitledDocument.assertCommand('xy', null, 'reverseCharacters', 'yx');
        await untitledDocument.assertCommand('xyz', null, 'reverseCharacters', 'zyx');
        await untitledDocument.assertCommand('@🐻‍❄️', null, 'reverseCharacters', '🐻‍❄️@');
    });

    test('Sort characters (ascending and descending)', async () => {
        await untitledDocument.assertCommand('qwerty', null, 'sortCharacters', 'eqrtwy');
        await untitledDocument.assertCommand('qwerty', null, 'sortCharactersDescending', 'ywtrqe');
        await untitledDocument.assertCommand('Z̧̫̞̭͔͉̰A͙̖͉̖͘L̢̹̘͖̟̝G̦̪̺͉̫̀ͅỌ̩͉̭', null, 'sortCharacters', 'A͙̖͉̖͘G̦̪̺͉̫̀ͅL̢̹̘͖̟̝Ọ̩͉̭Z̧̫̞̭͔͉̰');
        await untitledDocument.assertCommand('Z̧̫̞̭͔͉̰A͙̖͉̖͘L̢̹̘͖̟̝G̦̪̺͉̫̀ͅỌ̩͉̭', null, 'sortCharactersDescending', 'Z̧̫̞̭͔͉̰Ọ̩͉̭L̢̹̘͖̟̝G̦̪̺͉̫̀ͅA͙̖͉̖͘');
    });

    test('Shuffle characters', async () => {
        let randomFunction = Math.random;
        Math.random = () => 0;
        // The command uses right-to-left Fisher–Yates shuffle
        // When Math.random is mocked to return 0, all items are swapped with first item
        // The result should be a circular shift to the left by 1
        await untitledDocument.assertCommand('0123456789', null, 'shuffleCharacters', '1234567890');
        Math.random = randomFunction;
    });

    test('Filter duplicate characters', async () => {
        await untitledDocument.assertCommand('p💩o💩o💩p', null, 'filterDuplicateCharacters', 'p💩o');
    });
});