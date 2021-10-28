const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
    {
        test: /\.(js|jsx)$/,
        exclude: /\/node_modules\//,
        use: {
            loader: 'babel-loader'
        }
    },
    {
      test: /\.html$/i,
      loader: "html-loader",
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
          },
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.(jpe?g|png|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: 'images/[name].[contenthash:8].[ext]',
        },
      },
    },
  ]},
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Development',
        template: 'index.html'
    }),
  ],
};