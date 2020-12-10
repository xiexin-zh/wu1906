import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/Home'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
