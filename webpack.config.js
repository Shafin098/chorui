const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-renderer",
  entry: {
    editor: "./main_window.tsx",
    output: "./output_window.ts",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
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
