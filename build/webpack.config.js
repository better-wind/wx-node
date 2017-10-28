var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry:{
        app:[path.resolve(__dirname,'../src/main.js')],
    },
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'[name].js'
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                loader:'babel-loader',
                include:[path.join(__dirname, '..', 'src')]
            }
        ]
    },
    devtool: '#cheap-module-eval-source-map',
    plugins:[

        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        // new HtmlWebpackPlugin({
        //     filename: path.resolve(__dirname,'../dist/index.html'),
        //     template: 'index.html',
        //     inject: true
        // }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
    ],
    // devServer:{
    //     contentBase: path.resolve(__dirname,'../dist/'),
    //     historyApiFallback:true,
    //     inline:true,
    //     hot:true
    // }
}