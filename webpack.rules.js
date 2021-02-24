/* eslint-disable @typescript-eslint/no-var-requires */
const nonce = require("./nonce");

module.exports = [
	// Add support for native node modules
	{
		test: /\.node$/,
		use: "node-loader",
	},
	{
		test: /\.m?js$/,
		exclude: /node_modules/,
		use: {
			loader: "babel-loader",
			options: {
				presets: [["@babel/preset-env", { targets: "defaults" }]],
			},
		},
	},
	{
		test: /\.tsx?$/,
		exclude: /(node_modules|\.webpack)/,
		use: {
			loader: "ts-loader",
			options: {
				transpileOnly: true,
			},
		},
	},
	{
		test: /\.(s[ac]ss)$/,
		use: [
			{ loader: "style-loader", options: { attrs: { nonce: nonce } } },
			{ loader: "css-loader" },
			{ loader: "sass-loader" },
			{ loader: "postcss-loader" },
		],
	},
	{
		test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
		use: {
			loader: "url-loader",
		},
	},
];
