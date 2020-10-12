module.exports = {
    entry: {
        leason1main: './src/leason1/main.js',
        leason2main: './src/leason2/main.js'
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        ["@babel/plugin-transform-react-jsx", {
                            pragma: 'createElement'
                        }]
                    ],
                }
            }
        }]
    }
}