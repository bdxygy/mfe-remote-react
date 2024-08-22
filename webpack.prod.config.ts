import { merge } from "webpack-merge";
import WebpackDevConfig from "./webpack.dev.config";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

export default merge(WebpackDevConfig, {
  devtool: "hidden-source-map",
  output: {
    publicPath: "http://localhost:8000/",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "v",
          chunks: "all",
          minSize: 5000, // Adjust this value to be less than maxSize
          maxSize: 5000, // Ensure this is greater than minSize
        },
      },
    },
  },
});
