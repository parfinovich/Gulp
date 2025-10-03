import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  entry: './src/js/app.js',
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'dist/js'),
    clean: true,
    environment: {
      module: true,
      dynamicImport: true
    }
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    usedExports: true,
    sideEffects: false
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'not dead', '> 0.2%']
                },
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3
              }]
            ],
            plugins: []
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'not dead', '> 0.2%']
                },
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@js': path.resolve(__dirname, 'src/js'),
      '@scss': path.resolve(__dirname, 'src/scss')
    }
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  }
};
