const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx', 
  output: {
    path: path.resolve(__dirname, 'dist'), 
    filename: 'bundle.js', 
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      "fs": false,
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser")
  }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
    }),
    new Dotenv(),
],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist')
    }, 
    compress: true,
    port: 3000, 
    open: true,
  },
};
