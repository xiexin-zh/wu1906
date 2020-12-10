// 基础数据管理
const Organ = resolve => require(['../views/basedata/Organ.vue'], resolve)
const Role = resolve => require(['../views/basedata/Role.vue'], resolve)
const Impower = resolve => require(['../views/basedata/Impower.vue'], resolve)
const ClassUp = resolve => require(['../views/basedata/ClassUp.vue'], resolve)
const Site = resolve => require(['../views/basedata/Site.vue'], resolve)
const Teachers = resolve => require(['../views/basedata/Teachers.vue'], resolve)
const BulkImport = resolve => require(['../views/basedata/BulkImport.vue'], resolve)
const Subject = resolve => require(['../views/basedata/Subject.vue'], resolve)
const SubjectTeacher = resolve => require(['../views/basedata/SubjectTeacher.vue'], resolve)
const StudentDetail = resolve => require(['../views/basedata/StudentDetail.vue'], resolve)
const TeacherDetail = resolve => require(['../views/basedata/TeacherDetail.vue'], resolve)
const ClassDetail = resolve => require(['../views/basedata/ClassDetail.vue'], resolve)
const Post = resolve => require(['../views/basedata/Post.vue'], resolve)
const Major = resolve => require(['../views/basedata/Major.vue'], resolve)
const HighClass = resolve => require(['../views/basedata/HighClass.vue'], resolve)
const HighDetail = resolve => require(['../views/basedata/HighDetail.vue'], resolve)
const HighStuDetail = resolve => require(['../views/basedata/HighStuDetail.vue'], resolve)
const HighYear = resolve => require(['../views/basedata/HighYear.vue'], resolve)
const HighStudent = resolve => require(['../views/basedata/HighStudent.vue'], resolve)

const basedata = [
  {
    path: '/organ',
    name: 'organ',
    component: Organ,
    meta: {
      title: '组织机构'
    }
  },
  {
    path: '/basedata/bulkImport',
    name: 'bulkImport',
    component: BulkImport,
    meta: {
      title: '批量导入',
      isHide: true
    }
  },
  {
    path: '/Post',
    name: 'Post',
    component: Post,
    meta: {
      title: '职务管理'
    }
  },
  {
    path: '/basedata/classDetail',
    name: 'classDetail',
    component: ClassDetail,
    meta: {
      title: '班级详情',
      isHide: true
    }
  },
  {
    path: '/major',
    name: 'major',
    component: Major,
    meta: {
      title: '专业管理'
    }
  },
  {
    path: '/highClass',
    name: 'highClass',
    component: HighClass,
    meta: {
      title: '中职班级管理'
    }
  },
  {
    path: '/basedata/highDetail',
    name: 'highDetail',
    component: HighDetail,
    meta: {
      title: '班级详情',
      isHide: true
    }
  },
  {
    path: '/teachers',
    name: 'teachers',
    component: Teachers,
    meta: {
      title: '教职工管理'
    }
  },
  {
    path: '/highStudent',
    name: 'highStudent',
    component: HighStudent,
    meta: {
      title: '中职学生管理'
    }
  },
  {
    path: '/basedata/highStuDetail',
    name: 'highStuDetail',
    component: HighStuDetail,
    meta: {
      title: '学生详情',
      isHide: true
    }
  },
  {
    path: '/site',
    name: 'site',
    component: Site,
    meta: {
      title: '场地管理'
    }
  },
  {
    path: '/basedata/roleImpower',
    name: 'roleImpower',
    component: Impower,
    meta: {
      title: '授权用户',
      isHide: true
    }
  },
  {
    path: '/highYear',
    name: 'highYear',
    component: HighYear,
    meta: {
      title: '中职学年管理'
    }
  },
  {
    path: '/subject',
    name: 'subject',
    component: Subject,
    meta: {
      title: '学科管理'
    }
  },
  {
    path: '/basedata/subjectTeacher',
    name: 'subjectTeacher',
    component: SubjectTeacher,
    meta: {
      title: '教师详情',
      isHide: true
    }
  },
  {
    path: '/classUp',
    name: 'classUp',
    component: ClassUp,
    meta: {
      title: '班级升级'
    }
  },
  {
    path: '/basedata/teacherDetail',
    name: 'teacherDetail',
    component: TeacherDetail,
    meta: {
      title: '教师详情',
      isHide: true
    }
  },
  {
    path: '/role',
    name: 'role',
    component: Role,
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/basedata/stusentsDetail',
    name: 'studentDetail',
    component: StudentDetail,
    meta: {
      title: '学生详情',
      isHide: true
    }
  }
]

export default basedata
