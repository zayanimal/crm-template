const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((acc, next) => {
    acc[`process.env.${next}`] = JSON.stringify(env[next]);

    return acc;
}, {})

module.exports = {
    context: process.cwd(),

    devtool: "eval-cheap-module-source-map",

    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(
            __dirname,
            './node_modules/.cache'
        )
    },

    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true,
                }
            }
        },
        runtimeChunk: true,
    },

    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        watchContentBase: true,
        progress: true,
        hot: true,
        port: 3000,
        open: true,
        historyApiFallback: true
    },

    entry: path.join(__dirname, 'src', 'index.tsx'),

    output: {
        pathinfo: false,
        filename: 'assets/[name].[fullhash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@/': path.resolve(__dirname, 'src', 'src'),
            '@config': path.resolve(__dirname, 'src', 'config'),
            '@shared': path.resolve(__dirname, 'src', 'modules/shared'),
            '@admin': path.resolve(__dirname, 'src', 'modules/admin'),
            '@customer': path.resolve(__dirname, 'src', 'modules/customer'),
            '@system': path.resolve(__dirname, 'src', 'modules/system'),
            '@images': path.resolve(__dirname, 'src', 'assets/images'),
            '@icons': path.resolve(__dirname, 'src', 'assets/icons'),
            '@utils': path.resolve(__dirname, 'src', 'utils'),
            '@styles': path.resolve(__dirname, 'src', 'styles')
        }
    },

    module: {
        rules: [
            {
                test: /\.bundle\.ts$/,
                use: {
                    loader: 'bundle-loader',
                    options: {
                        name: '[name]'
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            },
            {
                test: /\.css$|\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.join(__dirname, 'src', 'styles', 'shared.scss'),
                        },
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|gif|svg|png)$/,
                exclude: /fonts/,
                loader: 'file-loader',
            },
            {
                test: /.(ttf|eot|svg|woff|woff2)$/,
                loader: 'file-loader'
            }
        ]
    },

    plugins: [
        // new CleanWebpackPlugin(),

        new webpack.DefinePlugin(envKeys),

        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, 'public', 'index.html')
        })
    ]
};
