const path = require('path');

module.exports = {
    mode  : 'development',
    entry : {
        'main': './src/static/main.js'
    },
    output: {
        path         : path.resolve(__dirname, 'wwwroot/static'),
        chunkFilename: '[name].js'
    }
};