/* constants */
const isDev = process.env.NODE_ENV !== "production";
const isHttps = false;
const outputFolder = "dist";
const isDeploy = process.env.DEPLOY;

/* imports */
const path = require("path");
const webpack = require("webpack");
const NodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const node = {
    name: "node",
    devtool: isDev ? "eval" : "hidden-source-map",
    target: "node",
    node: {
        __dirname: true
    },
    externals: [NodeExternals()],
    entry: ["./app.babel.js"],
    output: {
        path: __dirname,
        filename: "app.js"
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            "process.env.isDev": JSON.stringify(isDev),
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.isHttps": JSON.stringify(isHttps),
            "process.env.outputFolder": JSON.stringify(outputFolder),
            "process.env.INPUT_FILE": 
                JSON.stringify(process.env.INPUT_FILE)
        })
    ].concat(
        isDev ? [] : [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                sourceMap: false
            })
        ]
    ),
    module: {
        loaders: [{
                enforce: "pre",
                test: /\.jsx?$/,
                loader: "eslint-loader",
                exclude: /node_modules/,
                options: {
                    fix: true,
                    emitWarning: true
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015", "react"],
                    plugins: ["transform-object-rest-spread", "syntax-dynamic-import"]
                }
            }
        ]
    },
    resolve: {
        extensions: [".js"]
    }
};

module.exports = [node];
