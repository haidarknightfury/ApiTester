const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports =  {
  entry: './src/index.js',
  target:'node', //for node applications otherwise it won't recognise modules such as fs
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'resources'), to: 'resources'},
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  }
};