module.exports = {
    entry: {
        leason1: './src/leason1/main.js',
        leason2: './src/leason2/main.js',
        leason3: './src/leason3/main.js',
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