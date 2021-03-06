const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const commonConfig = {
  entry: {
    ClChart: './src/cl.api',
    SisClient: './client/index'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}

if (process.env.NODE_ENV === 'development') {
  module.exports = merge(commonConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './samples'),
          to: path.resolve(__dirname, './dist/')
        }
      ])
    ],
    devServer: {
      contentBase: path.join(__dirname, './dist')
    }
  })
} else {
  module.exports = merge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: true,
        parallel: true
      })
    ]
  })
}
