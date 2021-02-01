const ClassManage = resolve => require(['../views/class-manage/ClassManage.vue'], resolve)
const ClassDetail = resolve => require(['../views/class-manage/ClassDetail.vue'], resolve)
const StuDetail = resolve => require(['../views/student/StuDetail.vue'], resolve)

const classManage = [
  {
    path: '/classManage/classDetail/stuDetail',
    name: 'stuDetail',
    component: StuDetail,
    meta: {
      title: '学生详情'
    },
    hidden: true
  },
  {
    path: '/classManage',
    name: 'classManage',
    component: ClassManage,
    meta: {
      title: '班级管理'
    }
  },
  {
    path: '/classManage/classDetail',
    name: 'classDetail',
    component: ClassDetail,
    meta: {
      title: '班级详情'
    },
    hidden: true
  }
]

export default classManage
