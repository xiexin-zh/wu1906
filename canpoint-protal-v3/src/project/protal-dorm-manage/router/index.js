import Vue from 'vue'
import Router from 'vue-router'
import RouterMap from '../config/router.config'

Vue.use(Router)
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: RouterMap
})
