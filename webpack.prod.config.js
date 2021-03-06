const path = require('path')

module.exports = {
  entry: {
    index: [
      path.resolve(__dirname, 'index.js'),
    ],
  },
  devtool: false,
  mode: 'production',
  cache: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
      },
    }],
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
}
