import webpack from 'webpack';

export const customConfiguration: webpack.Configuration = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@emotion/babel-preset-css-prop'],
            },
          },
        ],
      },
    ],
  },
};
