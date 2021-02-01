<template>
  <div class="home page-layout u-fx-ver">
    <div class="door-info u-fx-jsa u-mar-b20">
      <div
        :class="[
          'list u-fx-ac-jc u-border-radius u-mar-r20',
          { 'colorone-bg': item.key === 'todayIn' },
          { 'colortwo-bg': item.key === 'todayOut' },
          { 'colorthree-bg': item.key === 'inSchool' }
        ]"
        v-for="item in doorInfo"
        :key="item.key"
      >
        <div class="u-fx">
          <div class="icon u-border-radius-all u-padd-20 u-type-white-bg u-fx-ac-jc u-mar-r20">
            <img :src="item.icon" alt="" />
          </div>
          <div class="u-fx-ac-jc u-type-white">
            <span class="u-font-3 u-bold">{{ item.count }}</span>
            <span class="u-font-1">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="door-chart u-fx u-mar-b20">
      <div class="home-box1 u-type-white-bg u-border-radius u-mar-r20 u-padd-10">
        <div class="u-font-2 u-padd-l10">今日出入校人次</div>
        <u-charts
          :key="one"
          type="line"
          xLineColor="#ddd"
          yLineColor="#ddd"
          yGridColor="#ddd"
          xColor="#444"
          plotColor="#444"
          yColor="#444"
          legendColor="#444"
          id="total-one"
          :categories="hourCategories"
          :series="hourSeries"
          plotBorderWidth="3"
        ></u-charts>
      </div>
      <div class="home-box2 u-fx-ver u-fx-f1 u-type-white-bg u-border-radius u-padd-10">
        <div class="u-font-2 u-padd-l10">实时在校</div>
        <div class="u-fx-f2">
          <div class="u-pos-box u-fx">
            <u-pie
              id="total-two"
              :key="two"
              :series="onlineData"
              plotBorderWidth="2"
              innerSize="10"
              legendColor="#444"
              plotColor="#444"
            ></u-pie>
          </div>
        </div>
      </div>
    </div>
    <div class="door-board u-type-white-bg u-border-radius u-fx-f1 u-fx-ver u-padd-10">
      <div class="u-font-2 u-padd-l10">实时看板</div>
      <div class="middle-card u-fx u-fx-wp u-mar-t10 u-scroll-y" :style="{height: autoHeight + 'px'}">
        <div
          @click="goView(data.boardCode, data.boardName)"
          class="view-list u-mar-10 u-shadow u-bd-1px u-border-radius"
          v-for="(data, index) in dataList"
          :key="index"
        >
          <div class="tip u-type-white-bg u-padd-10">
            <a-tag color="blue">{{ data.boardName }}</a-tag
            >&nbsp;&nbsp;&nbsp;
            <a-popover>
              <template slot="content" v-for="cl in data.list">{{ cl.deviceName }}</template>
              <span class="content u-type-primary">设备数：{{ data.count }}</span>
            </a-popover>
          </div>
          <div class="tip-btn u-padd-r10">
            <a-icon class="u-font-2" type="edit" @click.stop="modify(1, data)"></a-icon>
            <a-icon class="u-font-2 u-mar-l10" v-if="data.defaultFlag !== '1'" type="delete" @click.stop="delView(data)"></a-icon>
          </div>
        </div>
        <div class="add-list u-border-radius u-shadow u-bd-1px u-mar-10">
          <div class="addbtn">
            <a-icon type="plus" @click="modify(0)" style="font-size: 60px; color: #6882da" />
          </div>
        </div>
      </div>
    </div>
    <add-view ref="addView" :title="title" @update="showList"></add-view>
  </div>
</template>

<script>
import InSchoolImg from '../assets/img/time.png'
import TodayOutImg from '../assets/img/out.png'
import TodayInImg from '../assets/img/advance.png'
import AddView from '../component/AddView'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Home',
  components: {
    AddView
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
  },
  data() {
    return {
      autoHeight: document.body.clientHeight - 620,
      doorInfo: [
        {
          key: 'todayIn',
          name: '今日进校（人）',
          icon: TodayInImg,
          count: 0
        },
        {
          key: 'todayOut',
          name: '今日出校（人）',
          icon: TodayOutImg,
          count: 0
        },
        {
          key: 'inSchool',
          name: '实时在校（人）',
          icon: InSchoolImg,
          count: 0
        }
      ],
      hourCategories: new Array(24).fill(1).map((item, index) => {
        return index < 10 ? `${'0' + index}:00` : `${index}:00`
      }),
      hourSeries: [
        {
          name: '进',
          color: '#348fe2',
          data: new Array(24).fill(0)
        },
        {
          name: '出',
          color: '#00acac',
          data: new Array(24).fill(0)
        }
      ],
      onlineData: [
        {
          name: '学生',
          color: '#348fe2',
          y: 0
        },
        {
          name: '教职工',
          color: '#727cb6',
          y: 0
        },
        {
          name: '访客',
          color: '#00acac',
          y: 0
        }
      ],
      dataList: [],
      one: 0,
      two: 10000,
      title: '添加看板'
    }
  },
  created() {
    this._getInOutTotal()
    this.showList()
    this._getHourList()
  },
  methods: {
    ...mapActions('home', [
      'getboardList',
      'addBoard',
      'delBoard',
      'getBoarddetail',
      'getboarddeviceList',
      'getInOutTotal',
      'getHourList'
    ]),
    // 实时看板列表
    async showList() {
      const res = await this.getboardList({
        schoolCode: this.schoolCode
      })
      this.dataList = res.data
    },
    // 删除实时看板
    delView(record) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delBoard({ id: record.id }).then((res) => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    // 编辑实时看板
    async modify(type, item) {
      if (type === 0) {
        this.title = '添加看板'
        this.$refs.addView.targetKeys = []
        this.$refs.addView.appForm = {}
      } else {
        const res = await this.getBoarddetail({ id: item.id })
        const data = res.data
        this.$refs.addView.appForm.name = data.boardName
        this.$refs.addView.appForm.id = data.id
        this.$refs.addView.targetKeys = data.list.map(ele => ele.deviceSn)
        this.title = '编辑看板'
      }
      this.$refs.addView.addVisible = true
    },
    // 获取今日出入校统计
    async _getInOutTotal() {
      const res = await this.getInOutTotal({ schoolCode: this.schoolCode })
      this.onlineData[0].y = res.data.inRealStudentNum
      this.onlineData[1].y = res.data.inRealTeacherNum
      this.onlineData[2].y = res.data.inRealVistorNum
      this.doorInfo[0].count = res.data.inNum
      this.doorInfo[1].count = res.data.outNum
      this.doorInfo[2].count = res.data.inRealTeacherNum + res.data.inRealStudentNum + res.data.inRealVistorNum
      this.two++
    },
    // 按小时查询出入人数
    async _getHourList() {
      const req = {
        schoolCodes: [this.schoolCode],
        size: 15,
        wdate: this.$tools.getDate(new Date().getTime()).substr(0, 10)
      }
      const hourList = new Array(24).fill(1).map((item, index) => {
        return index < 10 ? `${'0' + index}:00` : `${index}:00`
      })
      console.log(hourList)
      const res = await this.getHourList(req)
      const newRes = res.data.map((item) => {
        return {
          ...item,
          time: this.$tools.getDate(item.date).substring(11, 16)
        }
      })
      console.log(newRes)
      this.hourSeries[0].data = hourList.map((item) => {
        const obj = res.data.find((it) => this.$tools.getDate(it.date).substring(11, 16) === item)
        return obj ? obj.inNum : 0
      })
      console.log(this.hourSeries[0].data)
      this.hourSeries[1].data = hourList.map((item) => {
        const obj = res.data.find((it) => this.$tools.getDate(it.date).substring(11, 16) === item)
        return obj ? obj.outNum : 0
      })
      console.log(this.hourSeries[1].data)
      this.one++
    },
    // 实时看板
    goView(code, name) {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/door-data-view#/?schoolCode=${this.schoolCode}&schoolName=${this.schoolName}&boardCode=${code}&deviceName=${name}`
        )
      } else {
        window.open(
          `http://192.168.1.187:8081/door-data-view.html#/?schoolCode=${this.schoolCode}&schoolName=${this.loginInfo.schoolName}&boardCode=${code}&deviceName=${name}`
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
.door-info {
  .colorone-bg {
    background-color: #00acac;
  }
  .colortwo-bg {
    background-color: #348fe2;
  }
  .colorthree-bg {
    background-color: #727cb6;
    margin-right: 0;
  }
  .list {
    height: 110px;
    width: 33.3%;
    .icon {
      width: 60px;
      height: 60px;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
.door-chart {
  .home-box1 {
    width: calc(100% - 620px);
    height: 350px;
  }
  .home-box2 {
    width: 600px;
    height: 350px;
  }
}
.middle-card {
  height: 240px;
  .view-list {
    background: #f4f9fd url(../assets/img/sskb_default.png) no-repeat;
    background-size: 260px 155px;
    background-position: 50% 20px;
    min-width: 260px;
    width: calc(20% - 20px);
    height: 225px;
    position: relative;
    .tip {
      position: absolute;
      width: 100%;
      bottom: 0;
      z-index: 99;
      left: 0;
      height: 40px;
      text-align: left;
      color: #444;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
    }
    .tip-btn {
      position: absolute;
      width: 100%;
      bottom: 3px;
      z-index: 999;
      right: 0;
      height: 25px;
      text-align: right;
    }
  }
  .add-list {
    background: #f4f9fd;
    min-width: 260px;
    width: calc(20% - 20px);
    height: 225px;
    position: relative;
    .addbtn {
      position: absolute;
      width: 100%;
      z-index: 99;
      text-align: center;
      top: 80px;
    }
  }
}
</style>
