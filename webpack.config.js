// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const rules = [
  {
    test: /\.(ts|tsx)$/i,
    loader: "babel-loader",
    exclude: ["/node_modules/"],
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
    type: "asset",
  },

  // Add your rules for custom modules here
  // Learn more about loaders from https://webpack.js.org/loaders/
];

const frontEnd = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
    proxy: { "/api": "http://localhost:53134" },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

const backEnd = {
  target: "node",
  entry: {
    server: "./src/server.ts",
    bot: "./src/bot.ts",
  },
  output: {
    path: path.resolve(__dirname, "bin"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "src/db/*.sql", to: "db/[name].sql" }],
    }),
  ],
  externals: [nodeExternals()],
  module: {
    rules,
  },
  resolve: {
    extensions: [".ts", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    frontEnd.mode = "production";
    backEnd.mode = "production";
    frontEnd.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    frontEnd.mode = "development";
    backEnd.mode = "development";
  }
  return [frontEnd, backEnd];
};
