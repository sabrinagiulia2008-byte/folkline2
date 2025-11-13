const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./index.web.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".web.js", ".js", ".json"],
    alias: {
      "react-native$": "react-native-web",
      "react-native-vector-icons": path.resolve(__dirname, "src/mocks/icons.js"),
      "expo-av": path.resolve(__dirname, "src/mocks/video.js"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./web/index.html",
      filename: "index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "web/map.html", to: "map.html" }],
    }),
  ],
  devServer: {
    static: "./dist",
    hot: true,
    port: 3001,
    open: true,
    historyApiFallback: true,
  },
};
