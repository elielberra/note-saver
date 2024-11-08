const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_, { mode }) => {
  const isProduction = mode === "production";
  return {
    entry: "./src/index.tsx",
    output: {
      filename: isProduction ? "[name].[contenthash].js" : "main.js"
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic"
                  }
                ]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      })
    ],
    devtool: "source-map",
    devServer: {
      port: 3000,
      static: {
        directory: path.join(__dirname, "public")
      },
      server: "http",
      allowedHosts: [
        "notesaver"
      ],
      historyApiFallback: true
    }
  };
};
