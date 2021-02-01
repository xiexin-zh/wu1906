<template>
  <div class="visitor-view page-layout u-fx-ver">
    <div class="u-padd-10 u-type-white-bg u-border-radius">
      <div class="title">今日访客</div>
      <div class="u-fx-ac layout-padd-b">
        <div class="u-fx-f1 u-fx-ac u-fx-jc u-bd-r">
          <div class="visitor-icon"></div>
          <div class="u-fx-ac-jc">
            <div class="u-bold u-font-3">342</div>
            <div>预约今日来访(人)</div>
          </div>
        </div>
        <div class="u-fx-f1 u-fx-ac-jc">
          <div class="u-type-primary u-bold u-font-3">--</div>
          <div>预约已到访(人)</div>
        </div>
        <div class="u-fx-f1 u-fx-ac-jc">
          <div class="u-tips-color u-bold u-font-3">--</div>
          <div>预约已签离(人)</div>
        </div>
        <div class="u-fx-f1 u-fx-ac-jc">
          <div class="u-type-success u-bold u-font-3">--</div>
          <div>到访正在访(人)</div>
        </div>
        <div class="u-fx-f1 u-fx-ac-jc">
          <div class="u-type-warning u-bold u-font-3">--</div>
          <div>预约未到访(人)</div>
        </div>
      </div>
    </div>
    <div class="center u-fx-ver u-type-white-bg u-padd-10 u-mar-t u-mar-b u-border-radius">
      <div class="u-fx-jsb">
        <div class="title">访客人数走势(近30天)</div>
        <div v-if="false">
          <a-range-picker :locale="locale" @change="onChange" />
          <u-button class="u-mar-l10" type="light">搜索</u-button>
        </div>
      </div>
      <div class="u-fx-f1">
        <u-charts
          :isLegend="false"
          type="areaspline"
          xColor="#333"
          yColor="#333"
          yTitle="人员数"
          xLineColor="#eee"
          yLineColor="#eee"
          plotColor="#333"
          yTitleColor="#333"
          yGridColor="#eee"
          legendColor="#333"
          id="bar-one"
          :key="userTag"
          :categories="userCategories"
          :series="userSeries"
          plotBorderWidth="3"
        ></u-charts>
      </div>
    </div>
    <div class="u-fx-f1 u-fx-ver u-type-white-bg u-padd-10 u-border-radius">
      <div class="u-fx-jsb">
        <div class="title">今日预约</div>
        <u-radio @change="_appointToday" v-model="currentVal" :item-list="itemList"></u-radio>
      </div>
      <u-table is-zoom :columns="visitorTable" :table-list="userList">
        <template v-slot:slotOne="slotOne">
          <u-type>{{ getDataState('visitState', slotOne.record.visitState) }}</u-type>
        </template>
      </u-table>
    </div>
  </div>
</template>

<script>
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import visitorTable from '../table-columns/visitor'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'Home',
  components: {},
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      moment,
      locale,
      getDataState,
      visitorTable,
      userTag: false,
      userCategories: [],
      userSeries: [
        {
          name: '访客人数',
          color: 'rgb(0, 186, 255, .4)',
          data: new Array(30).fill(0)
        }
      ],
      currentVal: '',
      itemList: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '在访',
          value: '1'
        },
        {
          label: '签离',
          value: '2'
        },
        {
          label: '未到访',
          value: '0'
        }
      ],
      userList: []
    }
  },
  mounted() {
    this.userCategories = this.getLastDay(30)
    this._appointToday('')
    this._getLast30()
    this._visitorToday()
  },
  methods: {
    ...mapActions('home', ['appointToday', 'visitorToday', 'getLast30']),
    onChange(date, str) {},
    /**
     * 今日访客
     */
    async _visitorToday(visitState) {
      const res = await this.visitorToday({
        schoolCode: 'CANPOINTLIVE',
        date: '2020/01/10'
      })
      this.userList = res.data.list
    },
    /**
     * 进入预约访客列表
     */
    async _appointToday(visitState) {
      const res = await this.appointToday({
        pageNum: 1,
        pageSize: 100,
        schoolCode: 'CANPOINTLIVE',
        state: '',
        visitState
      })
      this.userList = res.data.list
    },
    // 进30日访客走势
    async _getLast30() {
      const res = await this.getLast30({
        schoolCode: 'CANPOINTLIVE',
        startDate: this.$tools.getDate(new Date().getTime() - 1000 * 60 * 60 * 24 * 200, 1).replace(/-/g, '/'),
        endDate: this.$tools.getDate(new Date().getTime(), 1).replace(/-/g, '/')
      })
      // 找出有访客对应日期的索引
      const _index = []
      this.userCategories.forEach((item, index) => {
        const ind = res.data.findIndex(it => {
          return this.$tools.getDate(it.date, 1).substr(5, 9) === item
        })
        if (ind > -1) {
          _index.push(index)
        }
      })
      _index.forEach((item, index) => {
        // this.userSeries[0].data[item] = res.data[index].realVisitorNum
        this.userSeries[0].data[item] = res.data[index].appointmentNum
        // this.userSeries[2].data[item] = res.data[index].registrationNum
      })
      this.userTag++
    },
    getLastDay(total) {
      const date = new Date().getTime()
      const dateArr = []
      for (let i = 0; i < total; i++) {
        const times = date - 1000 * 60 * 60 * 24 * i
        dateArr.push(this.$tools.getDate(times, 1).substr(5, 9))
      }
      return dateArr.reverse()
    }
  }
}
</script>
<style lang="less" scoped>
.visitor-view {
  .visitor-icon {
    width: 40px;
    height: 40px;
    background: url(../assets/img/visitor-icon.png) no-repeat;
    background-size: 40px 40px;
    border-radius: 100%;
    margin-right: 20px;
  }
  .title {
    height: 50px;
    font-size: 16px;
  }
  .center {
    height: 300px;
  }
}
</style>
