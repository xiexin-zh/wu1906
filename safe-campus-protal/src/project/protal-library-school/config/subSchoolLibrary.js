import { RouteView } from '../layouts'
// 精品资源库
const subSchool = {
  path: '/subSchoolLibrary',
  name: 'subSchoolLibrary',
  component: RouteView,
  meta: {
    title: '下属学校资源库'
  },
  children: [
    {
      path: '/knowledgeSchool',
      name: 'knowledgeSchool',
      component: () => import('../views/subSchoolLibrary/KnowledgeSchool.vue'),
      meta: {
        title: '安全知识库'
        // isHide: true
      }
    },
    {
      path: '/knowledgeSchool/preview',
      name: 'preview',
      component: () => import('../views/subSchoolLibrary/Preview.vue'),
      meta: {
        title: '查看',
        isHide: true
      }
    },
    {
      path: '/safeClassSchool',
      name: 'safeClassSchool',
      component: () => import('../views/subSchoolLibrary/SafeClassSchool.vue'),
      meta: {
        title: '安全课堂库'
      }
    },
    {
      path: '/safeClassSchool/previewClass',
      name: 'previewClass',
      component: () => import('../views/subSchoolLibrary/PreviewClass.vue'),
      meta: {
        title: '查看课堂详情',
        isHide: true
      }
    },
    {
      path: '/safeClassSchool/classPageList',
      name: 'classPageList',
      component: () => import('../views/subSchoolLibrary/ClassPageList.vue'),
      meta: {
        title: '安全课堂',
        isHide: true
      }
    }
  ]
}

export default subSchool
