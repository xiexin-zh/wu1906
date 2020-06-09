module.exports = {
    lintOnSave: false,
    publicPath: '/',
    devServer: {
        // host: 'localhost',
        port: 8000,
        open: true,              //  自动打开浏览器
        proxy: {
            '/vue': {
                target: 'http://117.50.36.141/api/v1.0/',
                changeOrigin: false,
                pathRewrite: {
                    '^/vue': ''
                }
            }
        },
    }
}