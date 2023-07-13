const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
module.exports = {
	chainWebpack: (config) => {
		config.module.rules.delete("eslint");
	},
	configureWebpack: {
		plugins: [
			new BundleAnalyzerPlugin({ analyzerPort: 8894 }),
			new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|fr/),
		],
		// plugins: [new BundleAnalyzerPlugin()],
		performance: {
			hints: false,
		},
		// resolve: {
		//   alias: {
		//     moment: 'moment/src/moment'
		//   }
		// },
	},
	css: {
		// extract: false, //Bit expensive but works well for CSS sequencing issue
	},
	publicPath: "",
	//"publicPath":"/avsandbox/"
};
