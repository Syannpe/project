/**
 * @version v1.0
 * @ClassNmae: webpack.config.js
 * @Description: desc
 * @Author: SYANNPE
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const prefix = "./";
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    devtool: process.env.NODE_ENV === 'development' ? "inline-source-map" : false,
    entry: path.resolve(__dirname, prefix, "./src/index.ts"),
    output: {
        filename: "./bundle.js",
        path: path.resolve(__dirname, "./dist"),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, prefix, "./src/index.html"),
            filename: path.resolve(__dirname, "./dist/index.html"),
            inject: 'body', // 确保 JS 被注入 body
        }),
        new HtmlInlineScriptPlugin(), // <-- 把 JS 内联到 HTML 中

        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                type: 'javascript/auto',
                parser: {
                    sourceType: 'module'
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },

        ]
    },
    optimization: {
        minimize: true,

        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,  // <-- 保留类名
                    keep_fnames: true       // 可选：保留函数名
                }
            })
        ]
    }
}