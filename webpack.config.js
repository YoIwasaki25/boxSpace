const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
    //開発モードにする
    mode: 'development',
    //入力ファイルを設定
    // entry: [path.resolve(__dirname, "./src/main.ts")],
    entry: './src/main.ts',
    //出力ファイルを設定
    output: {
        //出力されるファイル名
        filename: 'bundle.js',
        //出力先ディレクトリ
        path: path.resolve(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                //ts-loaderの設定
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
				use: [
					require.resolve('raw-loader'),
					require.resolve('glslify-loader'),
				],
            },
        ],
    },

    //モジュール解決
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.js', '.json'],
    },

    //開発モード設定
    // devtool: "source-map",
    // devServer: {
    //   contentBase: "./dist",
    // },
};
