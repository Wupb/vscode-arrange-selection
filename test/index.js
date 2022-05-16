const path = require('path');
const Mocha = require('mocha');
const glob = require('glob');
const untitledDocument = require('./untitledDocument.js');

module.exports.run = function() {
    const mocha = new Mocha({ui: 'tdd', color: true});
    const testsRoot = path.resolve(__dirname, '.');

    return new Promise((resolve, reject) => {
        glob('**/**.test.js', {cwd: testsRoot}, (err, files) => {
            if (err) {
                return reject(err);
            }

            // Add files to the test suite
            files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                // Run the mocha test
                mocha.run(failures => {
                    if (failures > 0) {
                        reject(new Error(`${failures} tests failed.`));
                    } else {
                        resolve();
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }).finally(untitledDocument.close);
}