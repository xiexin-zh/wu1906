import { RouteView } from '../layouts'
const NcovView = resolve => require(['../views/organize/NcovView.vue'], resolve)
const SchoolView = resolve => require(['../views/organize/SchoolView.vue'], resolve)
const menu = {
  path: '/ncovView',
  name: 'ncovView',
  component: RouteView,
  redirect: '/ncovView',
  meta: {
    title: '局端菜单',
    icon: 'folder-open'
  },
  children: [
    {
      path: '/ncovView',
      name: 'ncovView',
      component: NcovView,
      meta: {
        title: '疫情统计',
        icon: 'folder-open'
      }
    },
    {
      path: '/schoolView',
      name: 'schoolView',
      component: SchoolView,
      meta: {
        title: '学校概览',
        icon: 'folder-open'
      }
    }
  ]
}

export default menu
