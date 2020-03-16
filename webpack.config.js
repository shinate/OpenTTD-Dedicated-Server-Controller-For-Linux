const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode   : 'development',
    entry  : {
        'main': './src/static/js/main.js'
    },
    output : {
        path         : path.resolve(__dirname, 'wwwroot/static/js'),
        chunkFilename: '[name].js'
    },
    resolve: {
        alias     : {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module : {
        rules: [
            // ... other rules
            {
                test  : /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use : [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    {
                        loader : 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass')
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use : [
                    'style-loader', 'css-loader'
                ]
            }
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
};