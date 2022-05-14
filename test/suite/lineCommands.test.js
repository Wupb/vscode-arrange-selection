const untitledDocument = require('../untitledDocument.js');

suite('Line Commands Test Suite', () => {
    test('Reverse lines', async () => {
        await untitledDocument.assertCommand('x\r\ny', null, 'reverseLines', 'y\r\nx');
        await untitledDocument.assertCommand('x\r\ny\r\nz', null, 'reverseLines', 'z\r\ny\r\nx');
    });

    test('Sort lines (ascending and descending)', async () => {
        await untitledDocument.assertCommand('B\r\nC\r\nA\r\nD', null, 'sortLines', 'A\r\nB\r\nC\r\nD');
        await untitledDocument.assertCommand('B\r\nC\r\nA\r\nD', null, 'sortLinesDescending', 'D\r\nC\r\nB\r\nA');
    });

    test('Sort lines by line length (ascending and descending)', async () => {
        await untitledDocument.assertCommand('22\r\n333\r\n1\r\n4444', null, 'sortLinesByLength', '1\r\n22\r\n333\r\n4444');
        await untitledDocument.assertCommand('22\r\n333\r\n1\r\n4444', null, 'sortLinesByLengthDescending', '4444\r\n333\r\n22\r\n1');
    });

    test('Shuffle lines', async () => {
        let randomFunction = Math.random;
        Math.random = () => 0;
        // The command uses right-to-left Fisher–Yates shuffle
        // When Math.random is mocked to return 0, all items are swapped with first item
        // The result should be a circular shift to the left by 1
        await untitledDocument.assertCommand('0\r\n1\r\n2\r\n3', null, 'shuffleLines', '1\r\n2\r\n3\r\n0');
        Math.random = randomFunction;
    });

    test('Filter duplicate lines', async () => {
        await untitledDocument.assertCommand('\r\n!\r\n@\r\n@\r\n#\r\n#\r\n#\r\n', null, 'filterDuplicateLines', '\r\n!\r\n@\r\n#');
    });
});