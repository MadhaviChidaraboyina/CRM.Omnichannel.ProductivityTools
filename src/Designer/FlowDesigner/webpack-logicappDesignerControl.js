const path = require('path');
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
            logicapp: './src/scripts/LogicAppDesigner/Logicapp.tsx',
            //macroDesigner: './src/scripts/macroDesigner.tsx'
        },
        output: {
            filename: '[name].bundle.js',            
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
            new HtmlWebpackPlugin({
                inject: false,
                template: './src/html/iframeLogicappDesigner.html',
                chunks: ['logicapp'],
                filename: 'iframeLogicappDesigner.html'
            }),
            /*new HtmlWebpackPlugin({
                inject: true,
                template: './src/html/macroDesigner.html',
                chunks: ['macroDesigner'],
                filename: 'macroDesigner.html'
            }),*/
            new MiniCssExtractPlugin({
                filename: 'styles.css'
            }),
            new CopyWebpackPlugin([{ from: "node_modules/fuse.js/src/fuse.js", to: './node_modules/fuse', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/react/umd/react.production.min.js", to: './node_modules/react', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/react-dom/umd/react-dom.production.min.js", to: './node_modules/react-dom', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/immutable/dist/immutable.min.js", to: './node_modules/immutable', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/localforage/dist/localforage.min.js", to: './node_modules/localforage', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/draft-js/dist/*.*", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/office-ui-fabric-react/dist/**/*.*", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.*", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/@microsoft/load-themed-styles/lib-amd/index.js", to: './node_modules/@microsoft/load-themed-styles', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/@uifabric/icons/lib-amd/*.js", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/@uifabric/merge-styles/lib-amd/**/*.js", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/@uifabric/styling/lib-amd/**/*.js", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/@uifabric/utilities/lib-amd/*.*", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/prop-types/prop-types.min.js", to: './node_modules/prop-types', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/tslib/tslib.js", to: './node_modules/tslib', toType: 'dir' }]),
            //new CopyWebpackPlugin([{ from: "node_modules/select/**/*.*", to: './node_modules/select', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/reselect/dist/reselect.js", to: './node_modules/reselect', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/re-reselect/dist/index.js", to: './node_modules/re-reselect', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/monaco-editor/min/vs/**/*.*", to: '.', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "node_modules/requirejs/require.js", to: './node_modules/requirejs', toType: 'dir' }]),
            new CopyWebpackPlugin([{ from: "LogicApps/**/*.*", to: '.', toType: 'dir' }])
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