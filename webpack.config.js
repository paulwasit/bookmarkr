var webpack = require('webpack');

var path = require('path');
var config = {
  context: path.resolve(__dirname, 'public/'),
	entry: [
		'./index.js'
	],

  output: {
    path: path.resolve(__dirname, 'public/dist'), // absolute path for the output file
		publicPath: '/dist/', // public URL address of the output files when referenced in a browser
    filename: 'bundle.js',
	},
	
  plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(), // optimizes chunks and modules by how much they are used in your app
		new webpack.optimize.CommonsChunkPlugin({
			name:      'main', // Move dependencies to our main file
			children:  true, 	 // Look for common dependencies in all children,
			minChunks: 2, 		 // How many times a dependency must come up before being extracted
		}),
		new webpack.DefinePlugin({
      ON_TEST: process.env.NODE_ENV === 'test'
    }),
  ],

	module: {
    loaders: [
      {test: /\.js$/, loader: 'imports?define=>false'},
      {test: /\.html$/, loader: 'raw', exclude: /node_modules/},
			{test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000' }
    ],
		preLoaders: [
			{test: /\.js$/, loader: 'ng-annotate', exclude: /node_modules/}
		]
  }
	
};

if (process.env.NODE_ENV.replace(/\s+/g, '') !== 'production') {
	config.entry = config.entry.concat([
		'webpack/hot/dev-server', //new
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', //new
	]);
	config.plugins = config.plugins.concat([
		new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
	]);
	config.module.loaders = config.module.loaders.concat([
		{test: /\.css$/, loader:'style!css', include: [
			path.resolve(__dirname, 'public/'), 
			path.resolve(__dirname, 'node_modules')
		]},
		{test: /\.scss$/, loader: 'style!css!sass!import-glob', exclude: /node_modules/},
	]);
}

else if (process.env.NODE_ENV.replace(/\s+/g, '') === 'production') {
	
	var CleanPlugin = require('clean-webpack-plugin');
	var ExtractPlugin = require('extract-text-webpack-plugin');
	var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
	
	config.entry = ['./index.js'];
	config.output.filename = "bundle.min.js";
  //config.output.filename = 'bundle.js';
  config.plugins = config.plugins.concat([
	new ExtractPlugin('bundle.min.css', {allChunks: true}), 			 // <=== where should content be piped
		new CleanPlugin(config.output.path),			 // Cleanup the builds/ folder before compiling our final assets
		new webpack.optimize.DedupePlugin(), 			 // looks for similar chunks and files and merges them for better caching by the user
		new webpack.optimize.MinChunkSizePlugin({  // prevents Webpack from creating chunks that would be too small to be worth loading separately
			MinChunkSize: 51200, // ~50kb
		}),
		new OptimizeCssAssetsPlugin(), // This plugin minifies all the css code of the final bundle
		new webpack.optimize.UglifyJsPlugin({ // This plugin minifies all the Javascript code of the final bundle
			mangle: true,
			compress: {
				warnings: false, // Suppress uglification warnings
			},
		})
	]);
	config.module.loaders = config.module.loaders.concat([
		{test: /\.css$/, loader: ExtractPlugin.extract('style','css'), include: [
			path.resolve(__dirname, 'public/'), 
			path.resolve(__dirname, 'node_modules')
		]},
		{test: /\.scss$/, loader: ExtractPlugin.extract('style', 'css!sass!import-glob'), exclude: /node_modules/},
	]);
  config.devtool = 'source-map';
	
}


module.exports = config;