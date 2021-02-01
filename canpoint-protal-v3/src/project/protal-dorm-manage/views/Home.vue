<template>
  <div class="home page-layout u-fx-ver">
    <out-dialog v-if="outTag" :out-list="outList" v-model="outTag"></out-dialog>
    <div class="u-fx-f1 u-fx">
      <div class="u-fx-f1 u-fx u-mar-r">
        <div class="u-fx-f1 u-fx u-type-white-bg u-border-radius">
          <total-chart
            title="早查寝"
            :key="one"
            :data-list="dataOne"
            id="total-one"
            :total-type="totalOne"
          ></total-chart>
        </div>
        <div class="u-fx-f1 u-fx u-type-white-bg u-border-radius u-mar-l">
          <total-chart
            title="晚查寝"
            :key="two"
            :data-list="dataOne"
            id="total-two"
            :total-type="totalTwo"
          ></total-chart>
        </div>
      </div>
      <div class="home-box u-type-white-bg u-border-radius">
        <div class="u-fx-jsb u-fx-ac">
          <div class="title">查寝日期({{ currentDate }})</div>
        </div>
        <div class="u-fx-f1">
          <a-calendar :fullscreen="false" @change="changeDate" />
        </div>
      </div>
    </div>
    <div class="u-fx-f1 u-fx u-mar-t">
      <div class="u-fx-f1 u-fx u-type-white-bg u-mar-r u-border-radius">
        <div style="position: absolute; z-index: 99; height: 100px; top: 20px; right:40px">
          <u-radio v-model="currentVal" :item-list="itemList"></u-radio>
        </div>
        <div class="u-fx-f1 u-fx">
          <total-chart
            justify
            title="午查寝"
            :key="three"
            :data-list="dataThree"
            id="total-three"
            :total-type="totalThree"
          ></total-chart>
        </div>
      </div>
      <div class="home-box u-fx-ver u-type-white-bg u-border-radius">
        <div class="u-fx-jsb u-fx-ac">
          <div class="title">深夜外出（24人）</div>
          <div class="u-type-primary u-pointer" @click="outTag = true">查看详情</div>
        </div>
        <div class="u-fx-f1">
          <div style="padding-top: 100px" v-if="outList.length === 0">
            <u-empty description="暂无外出人员"></u-empty>
          </div>
          <div class="u-fx-ac-jc user-list" v-for="(user,index) in outList" :key="index">
            <img :src="user.photoUrl || autoUser" alt />
            <div class="u-content-color u-mar-t5">{{ user.userName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import OutDialog from '../component/OutDialog'
import autoUser from '@a/img/auto-user.png'
import moment from 'moment'
import 'moment/locale/zh-cn'
import TotalChart from '../component/TotalChart.vue'
moment.locale('zh-cn')
export default {
  name: 'Home',
  components: { TotalChart, OutDialog },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  watch: {
    currentVal(n, o) {
      if (n !== o) {
        this.noonCheck(this.checkData)
      }
    }
  },
  data() {
    return {
      autoUser,
      outTag: false,
      itemList: [
        {
          label: '归寝',
          value: 1
        },
        {
          label: '出寝',
          value: 2
        }
      ],
      currentVal: 1,
      one: 0,
      two: 0,
      three: 0,
      currentDate: this.$tools.getDate('', 1),
      totalOne: [
        {
          title: '应查寝(人)',
          total: '0'
        },
        {
          title: '出寝(人)',
          total: '0'
        },
        {
          title: '未出寝(人)',
          total: '0'
        }
      ],
      dataOne: [
        {
          name: '出寝',
          color: '#2889fc',
          y: 0
        },
        {
          name: '未出寝',
          color: '#f2ad11',
          y: 0
        }
      ],
      totalTwo: [
        {
          title: '应查寝(人)',
          total: '1000'
        },
        {
          title: '归寝(人)',
          total: '456'
        },
        {
          title: '未归寝(人)',
          total: '300'
        }
      ],
      dataTwo: [
        {
          name: '归寝',
          color: '#2889fc',
          y: 0
        },
        {
          name: '未归寝',
          color: '#f2ad11',
          y: 0
        }
      ],
      totalThree: [
        {
          title: '应查寝(人)',
          total: '1000'
        },
        {
          title: '出寝(人)',
          total: '456'
        },
        {
          title: '未出寝(人)',
          total: '300'
        }
      ],
      dataThree: [
        {
          name: '归寝',
          color: '#2889fc',
          y: 10
        },
        {
          name: '未归寝',
          color: '#f2ad11',
          y: 10
        }
      ],
      outList: []
    }
  },
  mounted() {
    this._homeCheckTotal()
    this._outAtNight()
  },
  methods: {
    ...mapActions('home', ['homeCheckTotal', 'outAtNight']),
    changeDate(item) {
      this.currentDate = moment(item).format('YYYY-MM-DD')
      this._homeCheckTotal()
      this._outAtNight()
    },
    /**
     * 查寝统计
     */
    async _homeCheckTotal() {
      const res = await this.homeCheckTotal({
        date: this.currentDate,
        schoolCode: this.schoolCode
      })
      this.checkData = res.data
      const data = res.data
      this.totalOne[0].total = data.morningTotal
      this.totalOne[1].total = data.morningOutNums
      this.totalOne[2].total = data.morningInNums
      this.dataOne[0].y = data.morningOutNums
      this.dataOne[1].y = data.morningInNums
      this.totalTwo[0].total = data.eveningTotal
      this.totalTwo[1].total = data.eveningReturnNums
      this.totalTwo[2].total = data.eveningUnReturnNums
      this.dataTwo[0].y = data.eveningReturnNums
      this.dataTwo[1].y = data.eveningUnReturnNums
      this.noonCheck(data)
      this.one++
      this.two++
    },
    /**
     * 午查寝
     */
    noonCheck(data) {
      if (this.currentVal === 1) {
        this.dataThree[0].y = data.noonReturnNums || 0
        this.dataThree[1].y = data.noonUnReturnNums || 0
        this.dataThree[0].name = '归寝'
        this.dataThree[1].name = '未归寝'
        this.totalThree[1].title = '归寝(人)'
        this.totalThree[2].title = '未归寝(人)'
      } else {
        this.dataThree[0].y = data.noonOutNums || 0
        this.dataThree[1].y = data.noonUnOutNums || 0
        this.dataThree[0].name = '出寝'
        this.dataThree[1].name = '未出寝'
        this.totalThree[1].title = '出寝(人)'
        this.totalThree[2].title = '未出寝(人)'
      }
      this.three++
    },
    /**
     * 深夜外出
     */
    async _outAtNight() {
      const res = await this.outAtNight({
        date: this.currentDate,
        schoolCode: this.schoolCode
      })
      this.outList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.home-box {
  padding: 10px;
  width: 450px;
  .title {
    font-size: 16px;
  }
  .user-list {
    img {
      border: 2px @u-type-primary-light solid;
      width: 60px;
      height: 60px;
      display: block;
      border-radius: 100%;
    }
    width: 24%;
    height: 100px;
    float: left;
    margin-left: 0.8%;
    margin-top: 20px;
  }
}
</style>
