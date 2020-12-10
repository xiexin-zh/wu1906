import { RouteView } from '../layouts'
const EmergencyPlan = resolve => require(['../views/drill/EmergencyPlan.vue'], resolve)
const EvacuateRoute = resolve => require(['../views/drill/EvacuateRoute.vue'], resolve)
const RescueEquip = resolve => require(['../views/drill/RescueEquip.vue'], resolve)
const CommandCentre = resolve => require(['../views/drill/CommandCentre.vue'], resolve)
const AddRoute = resolve => require(['../views/drill/AddRoute.vue'], resolve)
const AddEquip = resolve => require(['../views/drill/AddEquip.vue'], resolve)
const AddTemplate = resolve => require(['../views/drill/AddTemplate.vue'], resolve)
const PreviewTemplate = resolve => require(['../views/drill/PreviewTemplate.vue'], resolve)
const DrillProcess = resolve => require(['../views/drill/DrillProcess.vue'], resolve)

const drill = {
  path: '/drill',
  name: 'drill',
  component: RouteView,
  meta: {
    title: '校园安全演练'
  },
  children: [
    {
      path: '/emergencyPlan/addTemplate',
      name: 'addTemplate',
      component: AddTemplate,
      meta: {
        title: '添加预案模板',
        isHide: true
      }
    },
    {
      path: '/emergencyPlan',
      name: 'emergencyPlan',
      component: EmergencyPlan,
      meta: {
        title: '应急预案'
      }
    },
    {
      path: '/evacuateRoute/addRoute',
      name: 'addRoute',
      component: AddRoute,
      meta: {
        title: '添加路线图',
        isHide: true
      }
    },
    {
      path: '/evacuateRoute',
      name: 'evacuateRoute',
      component: EvacuateRoute,
      meta: {
        title: '演练疏散路线'
      }
    },
    {
      path: '/emergencyPlan/previewTemplate',
      name: 'previewTemplate',
      component: PreviewTemplate,
      meta: {
        title: '预览预案模板',
        isHide: true
      }
    },
    {
      path: '/rescueEquip',
      name: 'rescueEquip',
      component: RescueEquip,
      meta: {
        title: '应急救援器材'
      }
    },
    {
      path: '/rescueEquip/addEquip',
      name: 'addEquip',
      component: AddEquip,
      meta: {
        title: '添加器材',
        isHide: true
      }
    },
    {
      path: '/commandCentre',
      name: 'commandCentre',
      component: CommandCentre,
      meta: {
        title: '应急演练指挥中心'
      }
    },
    {
      path: '/emergencyPlan/drillProcess',
      name: 'drillProcess',
      component: DrillProcess,
      meta: {
        title: '查看演练记录',
        isHide: true
      }
    }
  ]
}

export default drill
