import { RouteView } from '../layouts'
const OutIn = resolve => require(['../views/outIn-record/OutIn.vue'], resolve)
const Invade = resolve => require(['../views/outIn-record/Invade.vue'], resolve)
const outInRecord = {
  path: '/outIn',
  name: 'outInRecord',
  component: RouteView,
  meta: {
    title: '出入记录'
  },
  children: [
    {
      path: '/outIn',
      name: 'outIn',
      component: OutIn,
      meta: {
        title: '出入记录'
      }
    },
    {
      path: '/invade',
      name: 'invade',
      component: Invade,
      meta: {
        title: '入侵记录'
      }
    }

  ]
}

export default outInRecord
