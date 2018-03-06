const path = require('path')
const webpack = require('webpack')

const DEBUG = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    'app': [
      path.resolve(__dirname, '__tests__/visual/app.js')
    ]
  },
  devtool: DEBUG ? 'inline-sourcemap' : false,
  cache: true,
  output: {
    path: path.resolve(__dirname, '__tests__/visual/dist/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader?babelrc=.babelrc'
        }
      }
    ]
  },
  resolve: {
    extensions: [
      '.js'
    ]
  },
}
