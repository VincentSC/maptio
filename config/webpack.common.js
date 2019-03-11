const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./helpers');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const AngularNamedLazyChunksWebpackPlugin = require('angular-named-lazy-chunks-webpack-plugin');
 

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: {
    'polyfills-entry': './src/polyfills.ts',
    'vendor-entry': './src/vendor.ts',
    'app-entry': process.env.NODE_ENV === "production" 
      ? ['./src/bootstrap.ts'] 
      : ['./src/bootstrap.ts', 'webpack-hot-middleware/client']
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'lodash': 'lodash-es',

      /*
Error : "There are multiple modules with names that only differ in casing" created by poor import 
of lodash in @exalif/ngx-breadcrums
'lodash.template': 'lodash-es/template',
    'lodash.templatesettings': 'lodash-es/templatesettings',
      'lodash.templateSettings': 'lodash-es/templatesettings',
      'lodash._reinterpolate': 'lodash-es/_reinterpolate',
      */

      'lodash.includes': 'lodash-es/includes',
      'lodash.isboolean': 'lodash-es/isboolean',
      'lodash.isinteger': 'lodash-es/isinteger',
      'lodash.isnumber': 'lodash-es/isnumber',
      'lodash.isplainobject': 'lodash-es/isplainobject',
      'lodash.isstring': 'lodash-es/isstring',
      'mobx': 'mobx/lib/mobx.module'
    }
  },

  optimization: {
    // runtimeChunk: 'single',
    // splitChunks: {
    //   chunks: 'all',
    //   maxInitialRequests: Infinity,
    //   minSize: 0,
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         // get the name. E.g. node_modules/packageName/not/this/part.js
    //         // or node_modules/packageName
    //         const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

    //         // npm package names are URL-safe, but some servers don't like @ symbols
    //         return `+npm.${packageName.replace('@', '')}`;
    //       },
    //     },
    //   },
    // }
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /\/node_modules\//,
          chunks: 'all',
          priority: 0,
          enforce: true
        }
      }
    },
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(json|png|jpe?g|gif|svg|ico|cur)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader?sourceMap"
        ]
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      }
    ]
  },




  plugins: [

    new AngularNamedLazyChunksWebpackPlugin(),
    
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true,
      },
      // chunksSortMode: "" 
      /*function (a, b) {
        // polyfills always first
        if (a.names[0].includes('polyfills'))
          return -1
        else if (b.names[0].includes('polyfills')) {
          return 1
        }
        else {
          if (a.names[0] > b.names[0]) {
            return 1;
          }
          if (a.names[0] < b.names[0]) {
            return -1;
          }
          return 0;
        }


      }*/
    }),

    new HtmlWebpackExternalsPlugin({

      hash: true,
      externals: [
        {
          module: 'jquery',
          entry: {
            path: 'dist/jquery.min.js',
            attributes : {
              defer: ""
            }
          },
          global: 'jQuery',
          append: true

        },
        {
          module: 'popper.js',
          entry: {
            path: 'dist/umd/popper.min.js',
            attributes : {
              defer: ""
            }
          },
          global: 'popper',
          append: true
        },
        {
          module: 'bootstrap',
          entry: {
            path: 'dist/js/bootstrap.min.js',
            attributes : {
              defer: ""
            }
          },
          global: 'bootstrap',
          append: true
        },
        // {
        //   module: 'marked',
        //   entry: {
        //     path: 'marked.min.js'
        //   },
        //   global: 'marked'
        // },
      ],
    }),

    new ScriptExtHtmlWebpackPlugin({
      sync: '-entry',
      async : 'npm',
      // defaultAttribute: 'async'
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'allAssets', // or 'initial',
      fileWhitelist: [/\.css$/]
    }),

   

    new webpack.IgnorePlugin(
      //https://medium.com/@ahmedelgabri/analyzing-optimizing-your-webpack-bundle-8590818af4df
      //Used in the slug package ....To comment back if we ever get Arabic or Tibetan users
      /unicode\/category\/So/, /node_modules/
    ),


    new CopyWebpackPlugin([
      { from: 'src/assets/images', to: 'assets/images' },
      { from: 'src/assets/templates', to: 'assets/templates' }
    ]),

  ]
};
