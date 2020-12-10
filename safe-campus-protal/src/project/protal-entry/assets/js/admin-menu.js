import autoApp from '../img/auto_app.png'
const ConfigEnv = process.env.NODE_ENV

const adminMenu = [
  {
    id: '100',
    name: '平台管理',
    icon: autoApp,
    children: [
      {
        id: '200',
        name: '应用管理',
        children: [
          {
            id: '201',
            name: 'PC菜单库',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/pcMenu' : '/protal-admin.html#/pcMenu'
          },
          {
            id: '202',
            name: 'PC应用库',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/pcApp' : '/protal-admin.html#/pcApp'
          },
          {
            id: '203',
            name: 'APP菜单库',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/mobileMenu' : '/protal-admin.html#/mobileMenu'
          },
          {
            id: '204',
            name: 'APP应用库',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/mobileApp' : '/protal-admin.html#/mobileApp'
          }
        ]
      },
      {
        id: '300',
        name: '机构管理',
        children: [
          {
            id: '301',
            name: '学校机构',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/institute' : '/protal-admin.html#/institute'
          },
          {
            id: '302',
            name: '局端机构',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/bureau' : '/protal-admin.html#/bureau'
          }
        ]
      },
      {
        id: '400',
        name: '用户管理',
        children: [
          {
            id: '401',
            name: '角色管理',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/role' : '/protal-admin.html#/role'
          },
          {
            id: '402',
            name: '员工管理',
            icon: '',
            url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/staff' : '/protal-admin.html#/staff'
          }
        ]
      },
      {
        id: '500',
        name: '学科管理',
        url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/subject' : '/protal-admin.html#/subject'
      },
      {
        id: '600',
        name: '平台消息',
        url: ConfigEnv === 'production' ? '/pc-protal/protal-admin#/notice' : '/protal-admin.html#/notice'
      }
    ]
  }
]

export default adminMenu
