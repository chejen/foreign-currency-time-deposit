const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './ui/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public', 'dist'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        firebaseConfig: JSON.stringify(process.env.firebaseConfig),
        collectionId:
          JSON.stringify(process.env.collectionId || 'time-deposit'),
        auth: JSON.stringify(process.env.auth),
      },
    }),
  ],
};
