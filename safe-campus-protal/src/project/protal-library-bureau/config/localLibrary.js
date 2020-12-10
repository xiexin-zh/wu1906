import { RouteView } from '../layouts'
// 精品资源库
const loca = {
  path: '/localLibrary',
  name: 'localLibrary',
  component: RouteView,
  meta: {
    title: '本地资源库'
  },
  children: [
    {
      path: '/knowledgeLocal',
      name: 'knowledgeLocal',
      component: () => import('../views/localLibrary/KnowledgeLocal.vue'),
      meta: {
        title: '安全知识'
        // isHide: true
      }
    },

    {
      path: '/localLibrary/addKnowledge',
      name: 'addKnowledge',
      component: () => import('../views/localLibrary/AddKnowledge.vue'),
      meta: {
        title: '添加安全知识',
        isHide: true
      }
    },
    {
      path: '/safeClassLocal',
      name: 'safeClassLocal',
      component: () => import('../views/localLibrary/safeClass/SafeClass.vue'),
      meta: {
        title: '安全课堂'
      }
    },
    {
      path: '/safeClassLocal/addClass',
      name: 'addClass',
      component: () => import('../views/localLibrary/safeClass/addClass/AddClass.vue'),
      meta: {
        title: '添加安全课堂',
        isHide: true
      }
    },
    {
      path: '/safeClassLocal/addExercises',
      name: 'addExercises',
      component: () => import('../views/localLibrary/safeClass/AddExercises.vue'),
      meta: {
        title: '添加课堂习题',
        isHide: true
      }
    },
    {
      path: '/safeClassLocal/addResources',
      name: 'addResources',
      component: () => import('../views/localLibrary/safeClass/AddResources.vue'),
      meta: {
        title: '添加课堂资源',
        isHide: true
      }
    },
    {
      path: '/safeClassLocal/previewClass',
      name: 'previewClass',
      component: () => import('../views/localLibrary/safeClass/PreviewClass.vue'),
      meta: {
        title: '查看课堂详情',
        isHide: true
      }
    },

    {
      path: '/knowledgeLocal/preview',
      name: 'preview',
      component: () => import('../views/localLibrary/Preview.vue'),
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/safeClassLocal/classPageList',
      name: 'classPageList',
      component: () => import('../views/localLibrary/ClassPageList.vue'),
      meta: {
        title: '安全课堂',
        isHide: true
      }
    }
  ]
}

export default loca
