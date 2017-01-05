module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/bundle',
    publicPath: '/bundle/',
    filename: 'index.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'stage-0', 'react']
      }
    }],
  },
  resolve: {
    modulesDirectories: [ 'node_modules' ],
  },
}
