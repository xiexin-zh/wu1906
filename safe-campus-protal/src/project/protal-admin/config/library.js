// 系统表单
import {
  RouteView
} from '../layouts'
const Knowledge = resolve => require(['../views/library/Knowledge.vue'], resolve)
const AddKlg = resolve => require(['../views/library/AddKlg.vue'], resolve)
const ResourIfication = resolve => require(['../views/library/ResourIfication.vue'], resolve)
const Preview = resolve => require(['../views/library/Preview.vue'], resolve)
const library = {
  path: '/library',
  name: 'library',
  component: RouteView,
  meta: {
    title: '公共资源库'
  },
  children: [
    {
      path: '/knowledge',
      name: 'knowledge',
      component: Knowledge,
      meta: {
        title: '安全知识'
      }
    },
    {
      path: '/library/addKlg',
      name: 'addKlg',
      component: AddKlg,
      meta: {
        title: '添加安全知识',
        isHide: true
      }
    },
    {
      path: '/safeClass',
      name: 'safeClass',
      component: () => import('../views/library/safeClass/SafeClass.vue'),
      meta: {
        title: '安全课堂'
      }
    },
    {
      path: '/library/preview',
      name: 'preview',
      component: Preview,
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/resourIfication',
      name: 'resourIfication',
      component: ResourIfication,
      meta: {
        title: '资源分类'
      }
    },
    {
      path: '/safeClass/addClass',
      name: 'addClass',
      component: () => import('../views/library/safeClass/addClass/AddClass.vue'),
      meta: {
        title: '添加安全课堂',
        isHide: true
      }
    },
    {
      path: '/safeClass/addExercises',
      name: 'addExercises',
      component: () => import('../views/library/safeClass/AddExercises.vue'),
      meta: {
        title: '添加课堂习题',
        isHide: true
      }
    },
    {
      path: '/safeClass/addResources',
      name: 'addResources',
      component: () => import('../views/library/safeClass/AddResources.vue'),
      meta: {
        title: '添加课堂资源',
        isHide: true
      }
    },
    {
      path: '/safeClass/previewClass',
      name: 'previewClass',
      component: () => import('../views/library/safeClass/PreviewClass.vue'),
      meta: {
        title: '查看课堂详情',
        isHide: true
      }
    },
    {
      path: '/safeClass/classPageList',
      name: 'classPageList',
      component: () => import('../views/library/safeClass/ClassPageList.vue'),
      meta: {
        title: '安全课堂',
        isHide: true
      }
    }
  ]
}

export default library
