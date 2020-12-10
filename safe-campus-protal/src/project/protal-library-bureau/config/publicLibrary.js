import { RouteView } from '../layouts'
// 隐患管理
// const SchoolDanger = resolve => require(['../views/dangerManage/SchoolDanger.vue'], resolve)
// const ReportDangers = resolve => require(['../views/dangerManage/ReportDangers.vue'], resolve)
// const ViewDangers = resolve => require(['../views/dangerManage/ViewDangers.vue'], resolve)
// const RectificationNotice = resolve => require(['../views/dangerManage/RectificationNotice.vue'], resolve)
// const EidtRectificationNotice = resolve => require(['../views/dangerManage/EidtRectificationNotice.vue'], resolve)
const publicLibrary = {
  path: '/publicLibrary',
  name: 'publicLibrary',
  component: RouteView,
  meta: {
    title: '公共资源库'
  },
  children: [
    {
      path: '/knowledgePublic',
      name: 'knowledgePublic',
      component: () => import('../views/publicLibrary/KnowledgePublic.vue'),
      meta: {
        title: '安全知识库'
      }
    },
    {
      path: '/knowledgePublic/previewKlg',
      name: 'previewKlg',
      component: () => import('../views/publicLibrary/PreviewKlg.vue'),
      meta: {
        title: '查看',
        isHide: true
      }
    },
    // {
    //   path: '/accountList/reportDangers',
    //   name: 'reportDangers',
    //   component: ReportDangers,
    //   meta: {
    //     title: '上报隐患',
    //     isHide: true
    //   }
    // },
    {
      path: '/safeClassPulic',
      name: 'safeClassPulic',
      component: () => import('../views/publicLibrary/SafeClassPulic.vue'),
      meta: {
        title: '安全课堂库'
      }
    },
    {
      path: '/safeClassPulic/previewClass',
      name: 'previewClass',
      component: () => import('../views/publicLibrary/PreviewClass.vue'),
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/safeClassPulic/classPageList',
      name: 'classPageList',
      component: () => import('../views/publicLibrary/ClassPageList.vue'),
      meta: {
        title: '安全课堂',
        isHide: true
      }
    }
    // {
    //   path: '/accountList/viewDangers',
    //   name: 'viewDangers',
    //   component: ViewDangers,
    //   meta: {
    //     title: '查看隐患',
    //     isHide: true
    //   }
    // }
    // {
    //   path: '/accountList/rectificationNotice',
    //   name: 'rectificationNotice',
    //   component: RectificationNotice,
    //   meta: {
    //     title: '整改通知书',
    //     isHide: true
    //   }
    // },
    // {
    //   path: '/accountList/eidtRectificationNotice',
    //   name: 'eidtRectificationNotice',
    //   component: EidtRectificationNotice,
    //   meta: {
    //     title: '编辑整改通知书',
    //     isHide: true
    //   }
    // }
  ]
}

export default publicLibrary
