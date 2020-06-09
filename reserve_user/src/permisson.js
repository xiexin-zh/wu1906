import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // 验权
// import Cookie from 'js-cookie'



router.beforeEach((to, from, next) => {
    NProgress.start()
    let token =Cookie.get('userInfo')?JSON.parse(Cookie.get('userInfo')).state==2:''
    if(token){
        console.log(to.path)
        if(to.path =='/login'){
            next({ path: '/index' })
            NProgress.done()
        }
        else{
            next()
            NProgress.done()
        }
    }else{
        whiteList.indexOf(to.path)
        if (whiteList.indexOf(to.path) !== -1) {
            next()
          } else {
            next('/login')
            NProgress.done()
          }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})
