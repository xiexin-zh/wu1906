/** 项目管理路由 */
import Layout from '@/views/layout/managerLayout'

/**
 * 系统管理里的 客户管理
 */
const systemCustomerAuth = {
  requiresAuth: true,
  index: 1,
  type: 'manage',
  subType: 'crm'
}

const systemCustomerRouter = {
  name: 'system-customer',
  path: 'system-customer',
  meta: {
    title: '戶口管理',
    icon: 'customer',
    ...systemCustomerAuth
  },
  children: [{
    path: 'custom-field',
    component: () => import('@/views/SystemManagement/SystemCustomer/customField'),
    meta: {
      title: '自定義字段設置',
      ...systemCustomerAuth
    }
  }, {
    path: 'customer',
    component: () => import('@/views/SystemManagement/SystemCustomer/customer'),
    meta: {
      title: '戶口公海規則設置',
      ...systemCustomerAuth
    }
  },
  {
    path: 'sunface',
    component: () => import('@/views/SystemManagement/SystemCustomer/sunface'),
    meta: {
      title: '人臉識別規則設置',
      ...systemCustomerAuth
    }
  }, {
    path: 'biz-param',
    component: () => import('@/views/SystemManagement/SystemCustomer/bizParam'),
    meta: {
      title: '業務參數設置',
      ...systemCustomerAuth
    }
  }, {
    path: 'biz-goals',
    component: () => import('@/views/SystemManagement/SystemCustomer/bizGoals'),
    meta: {
      title: '業績目標設置',
      ...systemCustomerAuth
    }
  }]
}

/**
 * 不包含children的路由
 */
const systemOtherRouter = {
  path: '/manager',
  component: Layout,
  redirect: '/manager/systemconfig',
  name: 'manager',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '系統管理',
    index: 0,
    type: 'manage'
  },
  children: [
    // {
    //   name: 'systemconfig',
    //   path: 'systemconfig', // 系统配置
    //   component: () => import('@/views/SystemManagement/SystemConfig/index'),
    //   meta: {
    //     requiresAuth: true,
    //     title: '系統配置',
    //     icon: 'systemconfig',
    //     index: 1,
    //     type: 'manage',
    //     subType: 'system'
    //   }
    // },
    {
      name: 'employee-dep',
      path: 'employee-dep', // 员工与部门管理
      component: () => import('@/views/SystemManagement/SystemEmployee/EmployeeDepManagement'),
      meta: {
        requiresAuth: true,
        title: '員工與部門管理',
        icon: 'department',
        index: 1,
        type: 'manage',
        subType: 'user'
      }
    },
    {
      name: 'role-authorization',
      path: 'role-authorization',
      component: () => import('@/views/SystemManagement/RoleAuthorization'),
      meta: {
        requiresAuth: true,
        title: '角色權限管理',
        icon: 'contacts',
        index: 1,
        type: 'manage',
        subType: 'permission'
      }
    },
    {
      name: 'system-examine',
      path: 'system-examine',
      component: () => import('@/views/SystemManagement/SystemExamine/SystemExamine'),
      meta: {
        requiresAuth: true,
        title: '審批流程管理',
        icon: 'examine',
        index: 1,
        type: 'manage',
        subType: 'examineFlow'
      }
    },
    {
      name: 'systemworkbench',
      path: 'systemworkbench', // 工作台
      component: () => import('@/views/SystemManagement/SystemWorkbench'),
      meta: {
        requiresAuth: true,
        title: '工作台',
        icon: 'workbench',
        index: 1,
        type: 'manage',
        subType: 'oa'
      }
    }
  ]
}

const handlefieldRouter = {
  name: 'handlefield',
  path: 'custom-field/handlefield/:type/:id', // type customer contacts business contract money
  component: () => import('@/views/SystemManagement/SystemCustomer/HandleField'),
  meta: {
    changeMenu: false, // 跳转不更改路径
    menuSelct: 'system-customer'
  },
  hidden: true
}

export const managerRouter = {
  path: '/manager',
  component: Layout,
  redirect: '/manager/systemconfig',
  name: 'manager',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '系統管理',
    index: 0,
    type: 'manage'
  },
  children: [
    ...systemOtherRouter.children,
    ...systemCustomerRouter.children,
    handlefieldRouter
  ]
}

export const managerRouterMenu = [
  ...systemOtherRouter.children,
  systemCustomerRouter
]
