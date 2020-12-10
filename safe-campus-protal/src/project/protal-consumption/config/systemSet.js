// 系统设置
import { RouteView } from '../layouts'
const CardSet = resolve => require(['../views/systemSet/CardSet.vue'], resolve)
const FaceBlacklist = resolve => require(['../views/systemSet/FaceBlacklist.vue'], resolve)
// const MessageSettings = resolve => require(['../views/systemSet/MessageSettings.vue'], resolve)
const systemSet = {
  path: '/systemSet',
  name: 'systemSet',
  component: RouteView,
  meta: {
    title: '系统设置'
  },
  children: [
    {
      path: '/cardSet',
      name: 'cardSet',
      component: CardSet,
      meta: {
        title: '消费规则'
      }
    },
    {
      path: '/faceBlacklist',
      name: 'faceBlacklist',
      component: FaceBlacklist,
      meta: {
        title: '人脸黑名单'
      }
    }/* ,
    {
      path: '/MessageSettings',
      name: 'MessageSettings',
      component: MessageSettings,
      meta: {
        title: '消息设置'
      }
    } */
  ]
}

export default systemSet
