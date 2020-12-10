<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="1100px"
    :title="title"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close">
    <div class="qui-fx-ver statistic" >
      <div class="title ">{{ schoolName }}
      </div>
      <polyline-echarts1
        :key="componentKey"
        v-if="chartList.length>0"
        :legendData="legendData"
        :data="chartList"
        id="DailyStatis1"
      ></polyline-echarts1>
    </div>
  </a-modal>
</template>
<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import PolylineEcharts1 from '../component/PolylineEcharts1'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
export default {
  name: 'PreviewReport',
  components: {
    TableList,
    SearchForm,
    PageNum,
    PolylineEcharts1
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      componentKey: 0,
      title: '',
      schoolName: '',
      eduCode: '', // 当前教育局上述教育局
      eduSchoolCodes: [], // 教育局下属学校
      legendData: [
        { name: '任务总数', value: 'allTaskCount', color: '#F5B111FF', middleColor: '#fcf8eb' },
        { name: '已巡查人数', value: 'donePersonCount', color: '#00A35F', middleColor: '#e6f6ef' },
        { name: '已巡查任务数', value: 'doneTaskCount', color: '#0084FF', middleColor: '#e6f3ff' }
      ],
      confirmLoading: false,
      chartList: [],
      detail: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        // return true
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  watch: {
  },
  async created() {
  },
  methods: {
    ...mapActions('home', [
      'schDailyStatis',
      'schDangerStatis',
      'schSpecialStatis',
      'getEduCode',
      'underSchoolList'
    ]),
    async setData(type, code, timeObj, schoolName) {
      this.componentKey++
      this.schoolName = schoolName
      if (type === 'daily') {
        this.title = '日常巡检统计详情'
        const res1 = await this.schDailyStatis({ ...timeObj, schoolCode: code })
        this.chartList = res1.data.lineChartList
      } else if (type === 'danger') {
        this.title = '隐患统计详情'
        this.legendData = [
          { name: '隐患总数', value: 'all', color: '#F5B111FF', middleColor: '#fcf8eb' },
          { name: '已整改隐患', value: 'all', color: '#0084FF', middleColor: '#e6f3ff' }
        ]
        const res2 = await this.schDangerStatis({ ...timeObj, schoolCode: code })
        this.chartList = res2.data.barChart
      } else if (type === 'special') {
        this.title = '专项检查统计详情'
        this.legendData = [
          { name: '任务总数', value: 'all', color: '#F5B111FF', middleColor: '#fcf8eb' },
          { name: '已完成任务数', value: 'done', color: '#0084FF', middleColor: '#e6f3ff' }
        ]
        await this.getEducode(code)
        await this.getSchools(code)
        const res3 = await this.schSpecialStatis({ ...timeObj, schoolCode: code, schoolCodeList: this.eduSchoolCodes })
        this.chartList = res3.data.chartList
      }
    },
    // 获取上级教育局code
    async getEducode(code) {
      const res = await this.getEduCode({ schoolCode: code })
      this.eduCode = res.data.schoolCode
    },
    // 获取教育下面的schoolCode集合
    async getSchools() {
      const req = {
        eduCode: this.eduCode,
        areas: [],
        keyWord: '',
        page: 1,
        schoolStage: '',
        size: 30
      }
      const res = await this.underSchoolList(req)
      this.eduSchoolCodes = res.data.list.map(v => v.schoolCode)
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    close() {
      this.reset()
      // this.$emit('closeModal')
    }
  }
}
</script>
<style lang="less" scoped>
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
    .statistic{
      height: 300px;
    }
  // .content {
  //   height: calc(100% - 10px);
  //   overflow-y: scroll;
  //  }
</style>
