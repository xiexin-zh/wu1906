// 基础数据管理
const Organ = resolve => require(['../views/basedata/Organ.vue'], resolve)
const Role = resolve => require(['../views/basedata/Role.vue'], resolve)
const SchoolManage = resolve => require(['../views/basedata/SchoolManage.vue'], resolve)
const SchoolDetail = resolve => require(['../views/basedata/SchoolDetail.vue'], resolve)
const Impower = resolve => require(['../views/basedata/Impower.vue'], resolve)
const ClassDetail = resolve => require(['../views/basedata/ClassDetail.vue'], resolve)
const UserManage = resolve => require(['../views/basedata/UserManage.vue'], resolve)
const Post = resolve => require(['../views/basedata/Post.vue'], resolve)
const Street = resolve => require(['../views/basedata/Street.vue'], resolve)
const Group = resolve => require(['../views/basedata/Group.vue'], resolve)
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
    path: '/schoolManage',
    name: 'schoolManage',
    component: SchoolManage,
    meta: {
      title: '学校管理'
    }
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage,
    meta: {
      title: '员工管理'
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
    path: '/Street',
    name: 'Street',
    component: Street,
    meta: {
      title: '下属街道'
    }
  },
  {
    path: '/Group',
    name: 'Group',
    component: Group,
    meta: {
      title: '督办小组'
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
    path: '/basedata/roleImpower',
    name: 'roleImpower',
    component: Impower,
    meta: {
      title: '授权用户',
      isHide: true
    }
  },
  {
    path: '/basedata/schoolDetail',
    name: 'schoolDetail',
    component: SchoolDetail,
    meta: {
      title: '学校详情',
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
  }
]

export default basedata
