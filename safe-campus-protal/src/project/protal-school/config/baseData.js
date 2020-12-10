// 基础数据管理
const Organ = resolve => require(['../views/basedata/Organ.vue'], resolve)
const SchoolYear = resolve => require(['../views/basedata/SchoolYear.vue'], resolve)
const Class = resolve => require(['../views/basedata/Class.vue'], resolve)
const Role = resolve => require(['../views/basedata/Role.vue'], resolve)
const Impower = resolve => require(['../views/basedata/Impower.vue'], resolve)
const ClassUp = resolve => require(['../views/basedata/ClassUp.vue'], resolve)
const Site = resolve => require(['../views/basedata/Site.vue'], resolve)
const Teachers = resolve => require(['../views/basedata/Teachers.vue'], resolve)
const BulkImport = resolve => require(['../views/basedata/BulkImport.vue'], resolve)
const Subject = resolve => require(['../views/basedata/Subject.vue'], resolve)
const SubjectTeacher = resolve => require(['../views/basedata/SubjectTeacher.vue'], resolve)
const Students = resolve => require(['../views/basedata/Students.vue'], resolve)
const StudentDetail = resolve => require(['../views/basedata/StudentDetail.vue'], resolve)
const TeacherDetail = resolve => require(['../views/basedata/TeacherDetail.vue'], resolve)
const ClassDetail = resolve => require(['../views/basedata/ClassDetail.vue'], resolve)
const Post = resolve => require(['../views/basedata/Post.vue'], resolve)
const basedata = [
  {
    path: '/organ',
    name: 'organ',
    component: Organ,
    meta: {
      title: '部门管理'
    }
  },
  {
    path: '/schoolyear',
    name: 'schoolyear',
    component: SchoolYear,
    meta: {
      title: '学年管理'
    }
  },
  {
    path: '/class',
    name: 'class',
    component: Class,
    meta: {
      title: '班级管理'
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
    path: '/students',
    name: 'students',
    component: Students,
    meta: {
      title: '学生管理'
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
    path: '/site',
    name: 'site',
    component: Site,
    meta: {
      title: '场地管理'
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
    path: '/role',
    name: 'role',
    component: Role,
    meta: {
      title: '角色管理'
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
    path: '/basedata/roleImpower',
    name: 'roleImpower',
    component: Impower,
    meta: {
      title: '授权用户',
      isHide: true
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
    path: '/basedata/classDetail',
    name: 'classDetail',
    component: ClassDetail,
    meta: {
      title: '班级详情',
      isHide: true
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
  }
]

export default basedata
