var webpack = require('webpack');

var path = require('path');
var config = {
  context: path.resolve(__dirname, 'public/'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js',
	},

  plugins: [
    new webpack.DefinePlugin({
      ON_TEST: process.env.NODE_ENV === 'test'
    })
  ],

	module: {
    loaders: [
			//{test: /\.js$/, loader: 'imports?define=>false', exclude: /node_modules/},
      {test: /\.js$/, loader: 'imports?define=>false'},
      {test: /\.html$/, loader: 'raw', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style!css', include: [path.resolve(__dirname, 'public/'), 
																										  path.resolve(__dirname, 'node_modules/codemirror'),
																											path.resolve(__dirname, 'node_modules/angular-ui-notification')
																											]},
      {test: /\.scss$/, loader: 'style!css!sass!import-glob', exclude: /node_modules/},
			{test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=100000' }
			//{ test: /\.(ttf|eot|svg)(\?[a-z0-9=&.]+)?$/, loader: 'url-loader?limit=100000' },
			//{ test: /\.woff(2)?(\?[a-z0-9=&.]+)?$/, loader: "url-loader?limit=10000" }
      /*
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }

			{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"}, 
			{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"}, 
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
			*/
    ],
		preLoaders: [
			{test: /\.js$/, loader: 'ng-annotate', exclude: /node_modules/}
		]
  }
	
};

/*
if (process.env.NODE_ENV.replace(/\s+/g, '') === 'production') {
  config.output.filename = 'bundle.min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  //config.devtool = 'source-map';
}
*/

module.exports = config;