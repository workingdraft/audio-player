const path = require('path')

const DEBUG = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, '__tests__/visual/app.js'),
    ],
  },
  devtool: DEBUG ? 'inline-sourcemap' : false,
  mode: DEBUG ? 'development' : 'production',
  cache: true,
  output: {
    path: path.resolve(__dirname, '__tests__/visual/dist/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
    ],
  },
}
