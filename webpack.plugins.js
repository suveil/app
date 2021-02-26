/* eslint-disable @typescript-eslint/no-var-requires */
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const nonce = require("./nonce");

module.exports = [
	new ForkTsCheckerWebpackPlugin(),
	new CspHtmlWebpackPlugin(
		{
			"base-uri": ["'self'", "https://cdn.discordapp.com/app-assets/"],
			"object-src": ["'none'"],
			"script-src": ["'self'"],
			"style-src": ["'self'", `'nonce-${nonce}'`],
			"frame-src": ["'none'"],
			"worker-src": ["'none'"],
		},
		{ hashEnabled: { "style-src": false } }
	),
];
