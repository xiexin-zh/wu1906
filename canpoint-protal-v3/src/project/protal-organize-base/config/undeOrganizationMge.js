import { RouteView } from '../layouts'
const undeOrganizationMge = {
  path: '/street',
  name: '_street',
  component: RouteView,
  meta: {
    title: '下属机构'
  },
  children: [
    {
      path: '/street',
      name: 'street',
      component: () => import('../views/undeOrganizationMge/Street.vue'),
      meta: {
        title: '下属街道'
      }
    },
    {
      path: '/school',
      name: 'school',
      component: () => import('../views/undeOrganizationMge/schoolMge/School.vue'),
      meta: {
        title: '学校管理'
      }
    },
    {
      path: '/school/schoolDetail',
      name: 'schoolDetail',
      component: () => import('../views/undeOrganizationMge/schoolMge/SchoolDetail.vue'),
      meta: {
        isHide: true,
        title: '详情'
      }
    },
    {
      path: '/group',
      name: 'group',
      component: () => import('../views/undeOrganizationMge/group/Group.vue'),
      meta: {
        title: '督办小组'
      }
    },
    {
      path: '/school/classDetail',
      name: 'classDetail',
      component: () => import('../views/undeOrganizationMge/schoolMge/ClassDetail.vue'),
      meta: {
        isHide: true,
        title: '班级详情'
      }
    }
  ]
}

export default undeOrganizationMge
