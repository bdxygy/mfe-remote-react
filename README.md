# Webpack Configuration for React Project with TypeScript, Sass, and Module Federation

This document provides a detailed overview of the Webpack configuration used for a React project with TypeScript, Sass, and Module Federation support.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Dependencies](#dependencies)
3. [Webpack Configuration](#webpack-configuration)
   - [Entry Point](#entry-point)
   - [Mode](#mode)
   - [Source Maps](#source-maps)
   - [Output](#output)
   - [Module Rules](#module-rules)
   - [Resolve](#resolve)
   - [DevServer](#devserver)
   - [Plugins](#plugins)

## Project Structure

```
my-project/
│
├── src/
│   ├── index.tsx
│   └── components/
│       └── About/
│           └── About.tsx
│   └── ... (other source files)
│
├── public/
│   ├── index.html
│   └── assets/
│       └── ... (static assets)
│
├── dist/
│   └── (generated files will be placed here)
│
└── webpack.config.ts
```

## Dependencies

Ensure that the following dependencies are installed in your project:

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server \
  html-webpack-plugin mini-css-extract-plugin clean-webpack-plugin \
  copy-webpack-plugin esbuild-loader sass-loader css-loader \
  @types/react @types/react-dom typescript
```

## Webpack Configuration

This section explains the Webpack configuration used in this project.

```typescript
import path from "path";
import webpack, { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

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
                localIdentName: "[name]__[local]__[chunkhash]",
              },
            },
          },
          "sass-loader",
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
    new MiniCssExtractPlugin({
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
```

### Entry Point

- **entry:** `./src/index.tsx`
  - The entry point of the application where the bundling process begins.

### Mode

- **mode:** `development`
  - Specifies that the build is in development mode, enabling various development features.

### Source Maps

- **devtool:** `eval-cheap-module-source-map`
  - Enables source maps that are quick to build and provide accurate mapping for easier debugging.

### Output

- **output:**
  - `filename:` `"core/js/script__[contenthash].js"`: The main output JavaScript file, with content hashing for cache busting.
  - `chunkFilename:` `"core/js/script-chunk__[contenthash].js"`: The name of the chunk files.
  - `path:` `path.resolve(__dirname, "dist")`: The output directory for the bundled files.
  - `publicPath:` `"http://localhost:8000/"`: The base path for all assets, enabling serving the files from a local development server.

### Module Rules

- **rules:**
  - **TypeScript and JavaScript:**
    - Processes `.tsx` and `.jsx` files using `esbuild-loader` for fast transpilation to ES2015, with legal comments removed.
  - **Sass:**
    - Handles `.scss` files with `sass-loader` and `css-loader`, supporting CSS Modules with a custom local identifier name format.

### Resolve

- **resolve:**
  - Specifies the file extensions that Webpack should resolve: `.js`, `.jsx`, `.ts`, `.tsx`, and `.scss`.

### DevServer

- **devServer:**
  - **port:** `8000`: The development server will run on port 8000.
  - **hot:** `true`: Enables Hot Module Replacement (HMR) for real-time updates during development.
  - **historyApiFallback:** `true`: Supports single-page application (SPA) routing by redirecting 404s to `index.html`.
  - **watchFiles:** `path.resolve(__dirname, "src")`: Watches the `src` directory for changes and automatically rebuilds the bundle.

### Plugins

- **HtmlWebpackPlugin:**
  - Generates an HTML file (`index.html`) in the output directory with injected script tags for bundled assets.
- **CleanWebpackPlugin:**

  - Cleans the output directory (`dist/`) before each build to ensure that only the latest assets are deployed.

- **CopyWebpackPlugin:**

  - Copies static assets from the `public/assets` directory to the `dist/assets` directory.

- **MiniCssExtractPlugin:**

  - Extracts CSS into separate files for better caching and load performance in production.
  - **filename:** `"core/css/styles__[contenthash].css"`: The main output CSS file, with content hashing for cache busting.
  - **chunkFilename:** `"core/css/styles-chunk__[contenthash].css"`: The name of the chunk CSS files.

- **ModuleFederationPlugin:**
  - Enables Module Federation, allowing this application (`remote_basic`) to expose and share modules with other applications.
  - **exposes:** `./about` - The `About` component located in `src/components/About/About.tsx` is exposed for sharing.
  - **shared:** React and ReactDOM are configured as singleton dependencies to avoid duplication across federated modules.
