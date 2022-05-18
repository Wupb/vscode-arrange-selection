const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @type WebpackConfig */
const webExtensionConfig = {
	mode: 'none', // Disable optimization by default, override in CLI with `webpack --mode production`
    target: 'webworker',
    entry: './src/extension.js',
    output: {
        filename: 'extension.bundle.js',
        path: path.join(__dirname, './dist'),
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    resolve: {
        mainFields: ['browser', 'module', 'main'],
    },
    externals: {
        vscode: 'commonjs vscode',
    },
    devtool: 'nosources-source-map', // Create a source map that points to the original source file
};
module.exports = [webExtensionConfig];