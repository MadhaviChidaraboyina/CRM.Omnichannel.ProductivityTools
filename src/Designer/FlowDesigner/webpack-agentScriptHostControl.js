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
            agentScriptDesigner: './src/scripts/LogicAppDesigner/agentScriptDesigner.tsx'
        },
        output: {
            filename: 'msdyn_[name].bundle.js'
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
                template: './src/html/agentScriptDesigner.html',
                chunks: ['agentScriptDesigner'],
                filename: 'msdyn_agentScriptDesigner.html'
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