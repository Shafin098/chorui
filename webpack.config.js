const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-renderer",
  entry: "./main_window.tsx",
  output: {
    path: path.resolve(__dirname),
    filename: "out.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" },
      {
        test: /\.jsx?$/,
        use: "babel-loader",
      },
    ],
  },
};
