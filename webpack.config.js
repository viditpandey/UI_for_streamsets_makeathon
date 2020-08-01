var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // filename: 'index_bundle.js',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.(jsx)$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]

}
