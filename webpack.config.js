const DojoWebpackPlugin = require("dojo-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "src/JBrowse/main",
    devtool: 'eval-source-map',
    plugins: [
        new DojoWebpackPlugin({
            loaderConfig: require("./build/dojo-loader-config"),
            environment: {
                dojoRoot: "../node_modules"
            },
            buildEnvironment: {
                dojoRoot: "node_modules"
            },
            locales: ["en"]
        }),

        new CopyWebpackPlugin([{
            context: "node_modules",
            from: "dojo/resources/blank.gif",
            to: "dojo/resources"
        }]),

        new webpack.NormalModuleReplacementPlugin(
            /^dojox\/gfx\/renderer!/,
            "dojox/gfx/canvas"
        ),

        new webpack.NormalModuleReplacementPlugin(/^dojo\/text!/, function(data) {
            data.request = data.request.replace(/^dojo\/text!/, "!!raw-loader!");
        }),

        // new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],
    module: {
        rules: [
            {
                test: path.resolve('src/JBrowse/main.js'),
                use: [{ loader: path.resolve('build/glob-loader.js') }]
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/'
    },
    resolveLoader: {
        modules: ["node_modules"]
    },
    node: {
        process: false,
        global: false
    }
};
