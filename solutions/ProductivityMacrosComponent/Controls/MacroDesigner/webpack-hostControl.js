const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
    return {
        target: 'web',
        devtool: 'source-map',
        devServer: {
            contentBase: './dist'
        },
        entry: {
            //app: './src/scripts/app.tsx',
            macroDesigner: './src/scripts/macroDesigner.tsx'
        },
        output: {
            filename: 'msdyn_ProductivityMacros_[name]_v2.bundle.js'
        },
        resolve: {
            extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx'],
            alias: {
                "LogicApps": path.resolve(__dirname, "LogicApps"),
            },
        },
        plugins: [
            /*new CleanWebpackPlugin(
            ),*/
            /*new HtmlWebpackPlugin({
                inject: false,
                template: './src/html/iframedesigner.html',
                chunks: ['app'],
                filename: 'iframedesigner.html'
            }),*/
            new HtmlWebpackPlugin({
                inject: true,
                template: './src/html/macroDesigner_v2.html',
                chunks: ['macroDesigner'],
                filename: 'msdyn_ProductivityMacros_macroDesigner_v2.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'styles.css'
            }),            
            new CopyWebpackPlugin([{ from: "LogicApps/rpc/*.*", to: '.', toType: 'dir' }]),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 1
            })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader'
                    }
                },
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'ts-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader' }
                    ]
                }
            ]
        }
    };
};