const path = require('path')
function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	chainWebpack: config => {
		config.resolve.alias
			.set('@api', resolve('api-config'))
			.set('@store', resolve('store'))
			.set('@u', resolve('utils'))
			.set('@s', resolve('static'))
		/**
		 * 限制图片转码
		 */
		config.module
			.rule('images')
			.use('url-loader')
			.loader('url-loader')
			.tap(options => Object.assign(options, {
				limit: 40000
			}))
	}
}