import { RouteView } from '../layouts'
const School = resolve => require(['../views/institution/School.vue'], resolve)
const Bureau = resolve => require(['../views/institution/Bureau.vue'], resolve)
const SchDetail = resolve => require(['../views/institution/SchDetail.vue'], resolve)

const institution = {
  path: '/school',
  name: '_school',
  component: RouteView,
  meta: {
    title: '机构管理'
  },
  children: [
    {
      path: '/school',
      name: 'school',
      component: School,
      meta: {
        title: '学校'
      }
    },
    {
      path: '/institution/schDetail',
      name: 'schDetail',
      component: SchDetail,
      meta: {
        title: '详情',
        isHide: true
      }
    },
    {
      path: '/bureau',
      name: 'bureau',
      component: Bureau,
      meta: {
        title: '教育局'
      }
    }
  ]
}

export default institution
