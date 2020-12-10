<!--
 * @Author: your name
 * @Date: 2020-11-09 10:03:09
 * @LastEditTime: 2020-11-09 14:24:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \safe-campus-protal\src\project\protal-parameter-bureau\views\safeDataStatis\StatisTable.vue
-->
<template>
  <div class="page-layout daily-statis  qui-fx-ver">
    <div class="search-form u-padd-t10 u-padd-b10 u-tips-color">
      <a-month-picker
        v-model="startValue"
        placeholder="请选择月份"
        :disabled-date="disabledStartMonth"
      />&nbsp;&nbsp;-&nbsp;
      <a-month-picker
        v-model="endValue"
        placeholder="请选择月份"
        :disabled-date="disabledEndMonth"
      />
      <a-button class="u-mar-l10" type="primary" @click="search()">搜索</a-button>
    </div>
    <table-list
      class="u-bg-fff"
      :page-list="pageList"
      :columns="dailyStatis"
      :table-list="tableList"
    >
      <template v-slot:actions="action" class="u-fx">
        <div @click="undoneTaskCount(action.record)" class="text u-type-primary">{{ action.record.undoneTaskCount }}</div>
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <undone-task ref="undoneTask" v-model="undoneTask"></undone-task>
  </div>
</template>
<script>
import moment from 'moment'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import UndoneTask from './UndoneTask'
import { patrolAllColumns, dailyStatis } from '../../assets/js/tableColumns.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'StatisTable',
  components: {
    TableList,
    UndoneTask,
    PageNum
  },
  data() {
    return {
      undoneTask: false,
      startValue: moment(new Date()),
      endValue: moment(new Date()),
      schoolList: [],
      patrolAllColumns,
      dailyStatis,
      tableList: [],
      total: 0,
      pageList: {
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this.getSchools()
    await this.showList()
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', [
      'eduDailyStatisDetail',
      'underSchoolList'
    ]),
    // 获取教育下面的schoolCode集合
    async getSchools() {
      const req = {
        eduCode: this.userInfo.schoolCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 30
      }
      const res = await this.underSchoolList(req)
      this.schoolList = res.data.list.map(v => {
        return {
          schoolName: v.schoolName,
          schoolCode: v.schoolCode
        }
      })
    },
    // 月日期选择器
    disabledStartMonth(startValue) {
      if (startValue.valueOf() > new Date()) return true
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndMonth(endValue) {
      if (endValue.valueOf() > new Date()) return true
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    search() {
      this.showList()
    },
    async showList() {
      const req = {
        startYear: Number(this.startValue.format('YYYY')),
        startMonth: Number(this.startValue.format('M')),
        endYear: Number(this.endValue.format('YYYY')),
        endMonth: Number(this.endValue.format('M')),
        schoolList: this.schoolList,
        schoolName: this.userInfo.schoolName
      }
      const res = await this.eduDailyStatisDetail(req)
      this.tableList = res.data.records.map(el => {
        return {
          id: el.schoolCode,
          ...el
        }
      })
      this.total = res.data.total
    },
    // 未巡查弹框
    undoneTaskCount(record) {
      console.log(record)
      const { schoolCode, schoolName } = record
      this.undoneTask = true
      this.$refs.undoneTask.setData(schoolName, schoolCode, this.startValue, this.endValue)
    }
  }
}
</script>
<style lang="less" scoped>
.daily-statis{
  background-color: #f0f2f5;
  .content{
    height: calc(100% - 10px);
    // overflow-y: scroll;
    // overflow-x: hidden;
    .title{
      position: relative;
      .line{
        position: absolute;
        left:2px;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 4px;
        height: 13px;
        background: #9698D6;
      }
    }
    .schRanking{
      height: 100%;
      padding: 20px;
      padding-top: 10px;
      .list{
        height: 120px;
        img{
          width: 40px;
        }
      }
    }
  }
}
</style>
