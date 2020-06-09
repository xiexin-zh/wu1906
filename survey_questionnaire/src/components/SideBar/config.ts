export interface NavMenu {
  index: string
  icon?: string
  title: string
  children?: NavSubMenu[]
}

export interface NavSubMenu extends NavMenu {
  auth?: string[]
}

const navigations: NavMenu[] = [
  {
    index: '/list',
    icon: 'el-icon-document',
    title: '我的问卷'
  },
  {
    index: '/template',
    icon: 'el-icon-s-promotion',
    title: '问卷模板'
  },
  {
    index: '/recycle',
    icon: 'el-icon-delete',
    title: '回收站'
  },
  {
    index: '/user',
    icon: 'el-icon-user-solid',
    title: '参与者管理'
  }
]
export default navigations
