import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  history: 'hash',
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['superAdmin'],
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              //通讯录管理
              path: '/account/address',
              // name: 'home',
              // icon: 'home',
              hideInMenu: 'false',
              authority: ['superAdmin'],
              component: './account/Address',
            },
            {
              //首页
              path: '/home',
              name: 'home',
              icon: 'home',
              component: './HomePage',
            },
            {
              //工单管理
              path: '/WorkOrderManagement',
              name: 'workOrderManagement',
              icon: 'FileDoneOutlined',
              authority: ['superAdmin'],
              routes: [
                {
                  //工单处置
                  path: '/WorkOrderManagement/WorkOrderDisposal',
                  name: 'workOrderDisposal',
                  // icon: 'smile',
                  // component: './WorkOrderManagement/WorkOrderDisposal',
                  authority: ['superAdmin'],
                  routes: [
                    {
                      path: '/WorkOrderManagement/WorkOrderDisposal',
                      redirect: '/WorkOrderManagement/WorkOrderDisposal/WorkOrderDetails',
                    },
                    // {
                    //   // 工单列表
                    //   path: '/WorkOrderManagement/WorkOrderDisposal/WorkOrderList',
                    //   name: 'workOrderList',
                    //   component: './WorkOrderManagement/WorkOrderDisposal/WorkOrderList',
                    //   authority: ['superAdmin'],
                    //   hideInMenu: true,
                    // },
                    {
                      // 创建新工单
                      path: '/WorkOrderManagement/WorkOrderDisposal/CreateWorkOrder',
                      name: 'createWorkOrder',
                      component: './WorkOrderManagement/WorkOrderDisposal/CreateWorkOrder',
                      authority: ['superAdmin'],
                      hideInMenu: true,
                    },
                    {
                      // 工单列表/详情
                      path: '/WorkOrderManagement/WorkOrderDisposal/WorkOrderDetails',
                      name: 'workOrderDetails',
                      component: './WorkOrderManagement/WorkOrderDisposal/WorkOrderDetails',
                      authority: ['superAdmin'],
                      hideInMenu: true,
                    },
                  ],
                },
                {
                  //工单台账
                  path: '/WorkOrderManagement/WorkOrderAccount',
                  name: 'workOrderAccount',
                  // icon: 'smile',
                  component: './WorkOrderManagement/WorkOrderAccount',
                  authority: ['superAdmin'],
                },
                {
                  //一案一档
                  path: '/WorkOrderManagement/CaseByCase',
                  name: 'caseByCase',
                  // icon: 'smile',
                  component: './WorkOrderManagement/CaseByCase',
                  authority: ['superAdmin'],
                },
                {
                  //删挂账管理
                  path: '/WorkOrderManagement/DeleteAccountManagement',
                  name: 'caseByCase',
                  // icon: 'smile',
                  component: './empty.jsx',
                  authority: ['superAdmin'],
                },
              ],
            },
            {
              //业务考核
              path: '/BusinessAssessment',
              name: 'businessAssessment',
              icon: 'crown',
              authority: ['superAdmin'],
              routes: [
                {
                  //考核展示系统
                  path: '/BusinessAssessment/AssessmentDisplay',
                  name: 'assessmentDisplay',
                  // icon: 'smile',
                  component: './BusinessAssessment/AssessmentDisplay',
                  authority: ['superAdmin'],
                },
                {
                  //承办单位考核
                  path: '/BusinessAssessment/AssessmentUndertaker',
                  name: 'assessmentUndertaker',
                  // icon: 'smile',
                  component: './BusinessAssessment/AssessmentUndertaker',
                  authority: ['superAdmin'],
                },
              ],
            },
            {
              //统计分析
              path: '/StatisticalAnalysis',
              name: 'statisticalAnalysis',
              icon: 'FundOutlined',
              authority: ['superAdmin'],
              routes: [
                {
                  //工单分析
                  path: '/StatisticalAnalysis/CaseAnalysis',
                  name: 'caseAnalysis',
                  // icon: 'smile',
                  component: './StatisticalAnalysis/CaseAnalysis',
                  authority: ['superAdmin'],
                },
                {
                  //周月报
                  path: '/StatisticalAnalysis/WeeklyAndMonthlyReport',
                  name: 'weeklyAndMonthlyReport',
                  // icon: 'smile',
                  component: './StatisticalAnalysis/WeeklyAndMonthlyReport',
                  authority: ['superAdmin'],
                },
              ],
            },
            {
              //权限管理
              path: '/RightsManagement',
              name: 'rightsManagement',
              icon: 'UserDeleteOutlined',
              authority: ['superAdmin'],
              routes: [
                {
                  //用户管理
                  path: '/RightsManagement/UserManagement',
                  name: 'userManagement',
                  // icon: 'smile',
                  // hideInMenu: 'false',
                  component: './RightsManagement/UserManagement',
                  authority: ['superAdmin'],
                },
                {
                  //角色管理
                  path: '/RightsManagement/RoleManagement',
                  name: 'roleManagement',
                  // icon: 'smile',
                  component: './RightsManagement/RoleManagement',
                  authority: ['superAdmin'],
                },
                // {
                //   //权限管理
                //   path: '/RightsManagement/rightManagement',
                //   name: 'rightManagement',
                //   // icon: 'smile',
                //   component: './empty.jsx',
                //   authority: ['superAdmin'],
                // },
                {
                  //菜单管理
                  path: '/RightsManagement/MenuManagement',
                  name: 'menuManagement',
                  // icon: 'smile',
                  component: './RightsManagement/MenuManagement',
                  authority: ['superAdmin'],
                },
              ],
            },
            // {
            //   //知识库
            //   path: '/KnowledgeBase',
            //   name: 'knowledgeBase',
            //   icon: 'crown',
            //   authority: ['superAdmin'],
            //   routes: [
            //     {
            //       path: '/KnowledgeBase/PolicyClassificationManagement',
            //       name: 'PolicyClassificationManagement',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/ProvincesTownsSet',
            //       name: 'ProvincesTownsSet',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/IndustrySet',
            //       name: 'IndustrySet',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/Classification',
            //       name: 'Classification',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/HousingUse',
            //       name: 'HousingUse',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/TalentType',
            //       name: 'TalentType',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/TalentLevel',
            //       name: 'TalentLevel',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //     {
            //       path: '/KnowledgeBase/Education',
            //       name: 'Education',
            //       authority: ['superAdmin'],
            //       component: './empty.jsx',
            //     },
            //   ],
            // },
            {
              //基础数据管理
              path: '/BasicDataManagement',
              name: 'BasicDataManagement',
              icon: 'DatabaseFilled',
              authority: ['superAdmin'],
              routes: [
                {
                  //工单来源
                  path: '/BasicDataManagement/WorkOrderSource',
                  name: 'WorkOrderSource',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/WorkOrderSource',
                },
                {
                  //来电主体
                  path: '/BasicDataManagement/CallerSubject',
                  name: 'CallerSubject',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/CallerSubject',
                },
                {
                  //工单类型
                  path: '/BasicDataManagement/JobType',
                  name: 'JobType',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/JobType',
                },
                {
                  //任务类型
                  path: '/BasicDataManagement/TaskType',
                  name: 'TaskType',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/TaskType',
                },
                {
                  //市级问题分类
                  path: '/BasicDataManagement/CityProblemType',
                  name: 'CityProblemType',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/CityProblemType',
                },
                {
                  //中心问题分类
                  path: '/BasicDataManagement/CoreProblemType',
                  name: 'CoreProblemType',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/CoreProblemType',
                },
                {
                  //挂帐类别
                  path: '/BasicDataManagement/RegisteredAccountCategory',
                  name: 'RegisteredAccountCategory',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/RegisteredAccountCategory',
                },
                {
                  //剔除类别
                  path: '/BasicDataManagement/RejectCategory',
                  name: 'RejectCategory',
                  authority: ['superAdmin'],
                  component: './BasicDataManagement/RejectCategory',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  // chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://ticketapi.prosuntech.com',
      changeOrigin: true,
    },
  },
};
