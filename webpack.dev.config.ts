import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinifyPlugin from "mini-css-extract-plugin";

export default {
  entry: "./src/index.tsx",
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  output: {
    filename: "core/js/script__[contenthash].js",
    chunkFilename: "core/js/script-chunk__[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:8000/",
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
          legalComments: "none",
        },
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                // mode: "local",
                localIdentName: "[name]__[local]__[chunkhash]",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss"],
  },
  devServer: {
    port: 8000,
    hot: true,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "body",
      minify: true,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/assets",
          to: "assets",
        },
      ],
    }),
    new CssMinifyPlugin({
      filename: "core/css/styles__[contenthash].css",
      chunkFilename: "core/css/styles-chunk__[contenthash].css",
    }),
    new webpack.container.ModuleFederationPlugin({
      name: "remote_basic",
      filename: "core/js/remote/remote_basic_entry.js",
      exposes: {
        "./about": "./src/components/About/About.tsx",
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
  ],
} as Configuration;
