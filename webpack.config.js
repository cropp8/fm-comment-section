const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'main.[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    assetModuleFilename: 'assets/[name].[contenthash][ext]',
  },
  mode: 'development',
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 3000,
    },
  },
  devServer: {
    port: 9898,
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    devMiddleware: {
      index: 'index.html',
      // writeToDisk: true, // dist is not getting cleaned between rebuilds
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|svg|woff|json)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: globImporter(),
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
          }
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
    // new CleanWebpackPlugin({
    //   cleanOnceBeforeBuildPatterns: [
    //     path.join(process.cwd(), 'dist/**/*'),
    //     path.join(process.cwd(), 'dist/*'),
    //   ]
    // }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
};