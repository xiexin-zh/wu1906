// 系统表单
import { RouteView } from '../layouts'
const StudyGround = resolve => require(['../views/StudyGround/StudyGround.vue'], resolve)
const AddStudy = resolve => require(['../views/StudyGround/AddStudy.vue'], resolve)
const studyGround = {
  path: '/studyGround',
  name: '/studyGround',
  component: RouteView,
  meta: {
    title: '学习园地'
  },
  children: [
    {
      path: '/studyGround',
      name: 'studyGround',
      component: StudyGround,
      meta: {
        title: '学习园地'
      }
    },
    {
      path: '/studyGround/addStudy',
      name: 'addStudy',
      component: AddStudy,
      meta: {
        title: '资源发布',
        isHide: true
      }
    }
  ]
}

export default studyGround
