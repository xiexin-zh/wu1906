import { RouteView } from '../layouts'
const PostCard = resolve => require(['../views/riskNotice/PostCard.vue'], resolve)
const MajorRisk = resolve => require(['../views/riskNotice/MajorRisk.vue'], resolve)
const RiskCompare = resolve => require(['../views/riskNotice/RiskCompare.vue'], resolve)

const notice = {
  path: '/notice',
  name: 'notice',
  component: RouteView,
  meta: {
    title: '风险公告'
  },
  children: [
    {
      path: '/postCard',
      name: 'postCard',
      component: PostCard,
      meta: {
        title: '岗位安全风险告知卡'
      }
    },
    {
      path: '/majorRisk',
      name: 'majorRisk',
      component: MajorRisk,
      meta: {
        title: '重大风险点公告'
      }
    },
    {
      path: '/riskCompare',
      name: 'riskCompare',
      component: RiskCompare,
      meta: {
        title: '风险等级比较图'
      }
    }
  ]
}

export default notice
