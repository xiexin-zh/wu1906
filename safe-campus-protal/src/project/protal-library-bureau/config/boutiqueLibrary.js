import { RouteView } from '../layouts'
// 精品资源库
const boutique = {
  path: '/boutiqueLibrary',
  name: 'boutiqueLibrary',
  component: RouteView,
  meta: {
    title: '校精品资源库'
  },
  children: [
    {
      path: '/knowledgeBout',
      name: 'knowledgeBout',
      component: () => import('../views/boutiqueLibrary/KnowledgeBout.vue'),
      meta: {
        title: '精品安全知识'
        // isHide: true
      }
    },
    {
      path: '/knowledgeBout/preview',
      name: 'preview',
      component: () => import('../views/boutiqueLibrary/Preview.vue'),
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/safeClassBout',
      name: 'safeClassBout',
      component: () => import('../views/boutiqueLibrary/SafeClassBout.vue'),
      meta: {
        title: '精品安全课堂'
      }
    },
    {
      path: '/safeClassBout/previewClass',
      name: 'previewClass',
      component: () => import('../views/boutiqueLibrary/PreviewClass.vue'),
      meta: {
        title: '查看课堂详情',
        isHide: true
      }
    },
    {
      path: '/safeClassBout/classPageList',
      name: 'classPageList',
      component: () => import('../views/boutiqueLibrary/ClassPageList.vue'),
      meta: {
        title: '安全课堂',
        isHide: true
      }
    }
  ]
}

export default boutique
