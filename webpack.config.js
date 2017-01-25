const path = require('path');
const ReactStaticPlugin = require('react-static-webpack-plugin');
const deploy = process.env.DEPLOY === '1';

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

  plugins: (
    deploy ?
      [new ReactStaticPlugin({ routes: './src/routes.js', template: './template.js', })]
      : []
  ),

  resolve: {
    modulesDirectories: ['node_modules', 'components', 'pages'],
  },

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
    ],
  },
};
