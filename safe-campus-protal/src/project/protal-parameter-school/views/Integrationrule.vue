<!--
 * @Author: your name
 * @Date: 2020-11-09 10:03:09
 * @LastEditTime: 2020-11-09 15:02:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \safe-campus-protal\src\project\protal-parameter-school\views\Integrationrule.vue
-->
<template>
  <div class="page-layout bg-fff qui-fx-ver">
    <div class="title u-bold u-font-1 u-padd-10">
      用户积分规则
    </div>
    <table-list
      class="u-padd-10"
      is-zoom
      :page-list="pageList"
      :columns="ruleColumns"
      :table-list="userList"
    >
    </table-list>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import { ruleColumns } from '../assets/js/tableColumns.js'
export default {
  components: {
    TableList
  },
  data() {
    return {
      ruleColumns,
      pageList: {
        page: 1,
        size: 10
      },
      userList: [
        {
          id:'1',
          name: '安全巡检',
          points: '2 分',
          pointsRules: '巡查任务完成后，处理过程中的相关职工每人计2分。'
        },
        {
           id:'2',
          name: '安全巡检',
          points: '5 分',
          pointsRules: '直接处理并完成任务的职工每人计5分。'
        },
        {
           id:'3',
          name: '隐患管理',
          points: '2 分',
          pointsRules: '手机APP和后台上报隐患，在隐患任务完成后，均可每次获得2分，无上限。'
        },
        {
           id:'4',
          name: '隐患管理',
          points: '5 分',
          pointsRules: '隐患任务完成后，处理人与验收人每人计5分（不重复计分）。'
        },
        {
           id:'5',
          name: '专项检查',
          points: '2 分',
          pointsRules: '专项检查完成后，完成自查的教职工计2分。'
        },
        {
           id:'6',
          name: '安全事故',
          points: '2 分',
          pointsRules: '安全事故完成后，上报、续报、结案的相关职工每人计2分。'
        },
        {
           id:'7',
          name: '安全任务',
          points: '5 分',
          pointsRules: '完成问卷填写，每人每完成1份答卷，计5分（提交即积分，不考虑打回）。'
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {},
  async mounted() {
    // await this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getDangerList'
    ]),
    async showList() {
      const req = {
        ...this.searchObj,
        ...this.pageList,
        schoolCodes: this.schoolCodes,
        hasSupervise: true
      }
      const res = await this.getDangerList(req)
      this.userList = res.data.records
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoed></style>
