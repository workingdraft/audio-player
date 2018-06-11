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
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader?babelrc=.babelrc',
      },
    }],
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
}
