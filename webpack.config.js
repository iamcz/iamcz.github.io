const path = require('path');
const ReactStaticPlugin = require('react-static-webpack-plugin');
const deploy = process.env.DEPLOY === '1';
const generateStaticPages = process.env.GENERATE_STATIC_PAGES === '1';
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
  devtool: 'source-map',

  context: __dirname,

  entry: {
    app: './src/index.js',
  },

  output: {
    path: deploy ? path.join(__dirname) : path.join(__dirname, 'bundle'),
    filename: '[name].js',
    libraryTarget: 'umd',
    publicPath: '/',
  },

  plugins:
    (deploy || generateStaticPages) ?
      [
        // new ExtractTextPlugin('src/styles.css'),
        // new ManifestPlugin(),
        new ReactStaticPlugin({
          routes: './src/routes.js',
          template: './template.js',
        }),
      ] : [],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules'),
        query: {
          presets: ['es2015', 'stage-0', 'react'],
        },
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
      // },
    ],
  },
};
