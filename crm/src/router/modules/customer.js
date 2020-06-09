/** 客户管理路由 */
import Layout from "@/views/layout/customerLayout";

const customerRouter = {
  path: "/crm",
  component: Layout,
  redirect: "/crm/workbench",
  name: "crm",
  hidden: true,
  meta: {
    requiresAuth: true,
    title: "戶口管理",
    index: 0,
    type: "crm"
  },
  children: [
    {
      path: "workbench", // 工作台
      component: () =>
        import("@/views/customermanagement/workbench/newWorkbench"),
      meta: {
        requiresAuth: false,
        title: "總攬",
        icon: "dashboard",
        show: true
      }
    },
    {
      path: "message", // 待办事项
      component: () => import("@/views/customermanagement/message/Message"),
      meta: {
        requiresAuth: false,
        title: "待辦事項",
        icon: "message",
        num: 0
      }
    },
    {
      path: "clue", // 线索列表
      component: () => import("@/views/customermanagement/clue/ClueIndex"),
      meta: {
        requiresAuth: true,
        title: "線索",
        icon: "leads",
        index: 1,
        type: "crm",
        subType: "leads"
      }
    },
    {
      path: "customer", // 客户列表
      component: () =>
        import("@/views/customermanagement/customer/CustomerIndex"),
      meta: {
        requiresAuth: true,
        title: "戶口",
        icon: "customer",
        index: 1,
        type: "crm",
        subType: "customer"
      }
    },
    {
      path: "contacts", // 联系人列表
      component: () =>
        import("@/views/customermanagement/contacts/ContactsIndex"),
      meta: {
        requiresAuth: true,
        title: "自然人",
        icon: "contacts",
        index: 1,
        type: "crm",
        subType: "contacts"
      }
    },
    {
      path: "seas", // 公海列表
      component: () => import("@/views/customermanagement/seas/SeasIndex"),
      meta: {
        requiresAuth: true,
        title: "公海",
        icon: "seas",
        index: 2,
        type: "crm",
        subType: ["customer", "pool"]
      }
    },
    {
      path: "business", // 商机列表
      name: "business",
      component: () =>
        import("@/views/customermanagement/business/BusinessIndex"),
      meta: {
        requiresAuth: true,
        title: "商機",
        icon: "business",
        index: 1,
        type: "crm",
        subType: "business"
      }
    },
    {
      path: "contract", // 合同列表
      component: () =>
        import("@/views/customermanagement/contract/ContractIndex"),
      meta: {
        requiresAuth: true,
        title: "合同",
        icon: "contract",
        index: 1,
        type: "crm",
        subType: "contract"
      }
    },
    {
      path: "money", // 回款列表
      component: () => import("@/views/customermanagement/money/MoneyIndex"),
      meta: {
        requiresAuth: true,
        title: "回款",
        icon: "money",
        index: 1,
        type: "crm",
        subType: "receivables"
      }
    },
    {
      path: "product", // 产品列表
      component: () =>
        import("@/views/customermanagement/product/ProductIndex"),
      meta: {
        requiresAuth: true,
        title: "產品",
        icon: "product",
        index: 1,
        type: "crm",
        subType: "product"
      }
    },
    // 正在修改的页面----------------------------- start
    {
      path: "customerInformation", // 客戶信息
      component: () => import("@/views/customermanagement/customerInformation"),
      meta: {
        requiresAuth: true,
        title: "客戶信息",
        icon: "customer",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: true
      }
    },
    {
      path: "customerAnalysis", // 客戶分析
      component: () => import("@/views/customermanagement/customerAnalysis"),
      meta: {
        requiresAuth: true,
        title: "客戶分析",
        icon: "customer",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: true
      }
    },
    {
      path: "customerContact", // 客戶接觸
      component: () => import("@/views/customermanagement/customerContact"),
      meta: {
        requiresAuth: true,
        title: "客戶接觸",
        icon: "seas",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: true
      }
    },
    {
      path: "shoppingRecord", // 購物紀錄
      component: () => import("@/views/customermanagement/shoppingRecord"),
      meta: {
        requiresAuth: true,
        title: "購物紀錄",
        icon: "task",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    // {
    //   path: "salesman", // 業務
    //   meta: {
    //     title: "業務",
    //     icon: "product"
    //   },
    //   children: [
    //     {
    //       path: "professionalWork", // 業績
    //       component: () =>
    //         import("@/views/customermanagement/salesman/professionalWork"),
    //       meta: {
    //         title: "業績",
    //         ...salesman
    //       }
    //     },
    //     {
    //       path: "Boardcom", // 博彩産品
    //       component: () =>
    //         import("@/views/customermanagement/salesman/Boardcom"),
    //       meta: {
    //         title: "博彩産品",
    //         ...salesman
    //       }
    //     },
    //     {
    //       path: "followCustomer", // 博彩産品
    //       component: () =>
    //         import("@/views/customermanagement/salesman/followCustomer"),
    //       meta: {
    //         title: "批額/傭金條件/資金流",
    //         ...salesman
    //       }
    //     }
    //   ]
    // },
    {
      path: "professionalWork", // 業績
      component: () =>
        import("@/views/customermanagement/salesman/professionalWork"),
      meta: {
        requiresAuth: true,
        title: "業績",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: true
      }
    },
    {
      path: "Boardcom", // 产品列表
      component: () => import("@/views/customermanagement/salesman/Boardcom"),
      meta: {
        requiresAuth: true,
        title: "博彩産品",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "followCustomer", // 产品列表
      component: () =>
        import("@/views/customermanagement/salesman/followCustomer"),
      meta: {
        requiresAuth: true,
        title: "批額/傭金條件/資金流",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "schedule", // 产品列表
      component: () => import("@/views/OAManagement/schedule"),
      meta: {
        requiresAuth: true,
        title: "日程",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "demand", // 需求
      component: () =>
        import("@/views/customermanagement/customerFeedback/demand"),
      meta: {
        requiresAuth: true,
        title: "需求",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "complain", // 投诉
      component: () =>
        import("@/views/customermanagement/customerFeedback/complain"),
      meta: {
        requiresAuth: true,
        title: "投诉",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "opinion", // 投诉
      component: () =>
        import("@/views/customermanagement/customerFeedback/opinion"),
      meta: {
        requiresAuth: true,
        title: "投诉",
        icon: "schedule",
        index: 1,
        type: "crm",
        subType: "receivables",
        show: false
      }
    },
    {
      path: "customerFeedback", // 产品列表
      // component: () => import("@/views/customermanagement/customerFeedback"),
      meta: {
        // requiresAuth: true,
        title: "客戶反饋",
        icon: "message"
        // index: 1,
        // type: "crm",
        // subType: "receivables",
        // ...customerFeedback,
        // show: true
      },
      children: [
        {
          path: "complain", // 投诉
          component: () =>
            import("@/views/customermanagement/customerFeedback/complain"),
          meta: {
            title: "投诉",
            ...customerFeedback
          }
        },
        {
          path: "demand", // 需求
          component: () =>
            import("@/views/customermanagement/customerFeedback/demand"),
          meta: {
            title: "需求",
            ...customerFeedback
          }
        },
        {
          path: "opinion", // 意见
          component: () =>
            import("@/views/customermanagement/customerFeedback/opinion"),
          meta: {
            title: "意见",
            ...customerFeedback
          }
        }
      ]
    }
  ]
};
const customerFeedback = {
  requiresAuth: true,
  index: 1,
  type: "bi",
  subType: "customerRouter",
  ...customerRouter
};
const salesman = {
  requiresAuth: true,
  index: 1,
  type: "bi",
  subType: "customerRouter",
  ...customerRouter
};
export default customerRouter;
