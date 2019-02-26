const
  path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: [
    './src/styles/public.less',
    './src/app.js'
  ],

  output: {
    path: path.resolve('dist'),
    filename: 'game.js'
  },

  devServer: {
    hot: true,
    host: '0.0.0.0',
    contentBase: '.',
    stats: 'errors-only',
    disableHostCheck: true
  },

  devtool: isProd ? false : 'source-map',

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(vert|frag)$/,
        use: ['raw-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      PIXI: 'pixi.js'
    }),

    new HtmlWebpackPlugin({
      template: './src/template.html',
      hash: true,
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    }),
  ],

  mode: isProd ? 'production' : 'development'
}