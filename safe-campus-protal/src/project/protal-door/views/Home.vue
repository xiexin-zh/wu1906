<template>
  <div
    class="page-layout u-fx-ver home u-padd-b"
    :style="{ maxHeight: maxHeight, overflow: 'auto' }"
  >
    <div class="u-fx-ver">
      <div class="u-fx-f1 u-mar-t">
        <div class="middle-card task-left u-bd-t u-bd-l u-bd-b">
          <div class="u-padd-b30"></div>
          <div class="u-type-success">今日进校</div>
          <div class="u-padd-b30 u-font-1 u-type-success">{{ inoutDetail.inNum }}人</div>
          <div class="u-type-warning">今日出校</div>
          <div class="u-padd-b30 u-font-1 u-type-warning">{{ inoutDetail.outNum }}人</div>
          <div class="u-type-primary">实时在校</div>
          <div class="u-padd-b30 u-font-1 u-type-primary">{{ inoutDetail.total }}人</div>
        </div>
        <div class="middle-right task-list u-bd-1px">
          <div class="task-right">
            <div>
              <line-one :key="hourTag" :categories="hourCategories" :series="hourSeries"></line-one>
            </div>
          </div>
        </div>
        <div class="middle-card charge-list u-bd-1px">
          <div>
            <pie-one id="pie-one" :key="onlineTag" :data-list="onlineData"></pie-one>
          </div>
        </div>
      </div>
    </div>
    <div class="u-fx-ver">
      <div class="u-fx-f1 u-mar-t">
        <div class="middle-card service-list u-bd-1px">
          <div
            @click="goView(data.boardCode, data.boardName)"
            class="view-list"
            v-for="(data, index) in dataList"
            :key="index"
          >
            <div class="tip u-padd-l10">
              <a-tag color="blue">{{ data.boardName }}</a-tag>&nbsp;&nbsp;&nbsp;
              <a-popover>
                <template slot="content" v-for="cl in data.list">{{ cl.deviceName }}</template>
                <span class="content u-type-primary">设备数：{{ data.count }}</span>
              </a-popover>
            </div>
            <div class="tip-btn u-padd-r10">
              <a-tooltip placement="topLeft" title="编辑" @click.stop="modify(1, data)">
                <a-button size="small" class="edit-action-btn" icon="form"></a-button>
              </a-tooltip>
              <a-tooltip
                placement="topLeft"
                title="删除"
                @click.stop="delView(data)"
                v-if="data.defaultFlag !== '1'"
              >
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </div>
          </div>
          <div class="add-list u-border-radius">
            <div class="addbtn">
              <a-icon type="plus" @click="modify(0)" style="font-size: 80px; color:#6882da" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-view ref="addView" :title="title" @update="showList"></add-view>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Tools from '@u/tools'
import moment from 'moment'
import LineOne from '../component/LineOne'
import PieOne from '../component/PieOne'
import AddView from '../component/AddView'
export default {
  name: 'Home',
  components: { LineOne, PieOne, AddView },
  data() {
    return {
      moment,
      pageList: {
        page: 1,
        size: 20
      },
      recordList: [],
      xData: [],
      yData: [],
      hourTag: 0,
      hourCategories: new Array(24).fill(1).map((item, index) => {
        return index < 10 ? `${'0' + index}:00` : `${index}:00`
      }),
      hourSeries: [
        {
          name: '进',
          color: '#19be6b',
          data: new Array(24).fill(0)
        },
        {
          name: '出',
          color: '#ff9900',
          data: new Array(24).fill(0)
        }
      ],
      dataList: [],
      title: '添加看板',
      onlineTag: 0,
      onlineData: [
        {
          name: '学生',
          color: '#2d67dc',
          y: 0
        },
        {
          selected: true,
          name: '教职工',
          color: '#e05a71',
          y: 0
        },
        {
          name: '访客',
          color: '#ecb535',
          y: 0
        }
      ],
      inoutDetail: {
        inNum: 0,
        outNum: 0,
        inRealTeacherNum: 0,
        inRealStudentNum: 0,
        inRealVistorNum: 0,
        total: 0
      },
      maxHeight: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.maxHeight = window.screen.height - 270 + 'px'
  },
  mounted() {
    this.showList()
    this._getInOutTotal()
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
    showList() {
      this.getboardList({
        schoolCode: this.userInfo.schoolCode
      }).then(res => {
        this.dataList = res.data
      })
    },
    delView(record) {
      this.$tools.delTip('确认要删除吗？', () => {
        this.delBoard({ id: record.id }).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    async modify(type, item) {
      if (type === 0) {
        this.title = '添加看板'
        this.$refs.addView.groupList = []
        this.$refs.addView.appForm = {}
      } else {
        const res = await this.getBoarddetail({ id: item.id })
        const req = {
          schoolCode: this.userInfo.schoolCode,
          boradCode: item.boardCode
        }
        const data = res.data
        this.$refs.addView.appForm.name = data.boardName
        this.$refs.addView.appForm.id = data.id
        this.$refs.addView.groupList = data.list
        this.title = '编辑看板'
      }
      this.$refs.addView.addVisible = true
    },
    // 获取今日出入校统计
    async _getInOutTotal() {
      const res = await this.getInOutTotal({ schoolCode: this.userInfo.schoolCode })
      this.inoutDetail = res.data
      this.inoutDetail.total =
        res.data.inRealTeacherNum + res.data.inRealStudentNum + res.data.inRealVistorNum
      this.onlineData[0].y = res.data.inRealStudentNum
      this.onlineData[1].y = res.data.inRealTeacherNum
      this.onlineData[2].y = res.data.inRealVistorNum
      this.onlineTag++
    },
    // 按小时查询出入人数
    async _getHourList() {
      const req = {
        schoolCodes: [this.userInfo.schoolCode],
        size: 15,
        wdate: this.$tools.gmtToDate(new Date().getTime()).substr(0, 10)
      }
      const hourList = new Array(24).fill(1).map((item, index) => {
        return index < 10 ? `${'0' + index}:00` : `${index}:00`
      })
      console.log(hourList)
      const res = await this.getHourList(req)
      const newRes = res.data.map(item => {
        return {
          ...item,
          time: this.$tools.gmtToDate(item.date).substring(11, 16)
        }
      })
      console.log(newRes)
      this.hourSeries[0].data = hourList.map(item => {
        const obj = res.data.find(it => this.$tools.gmtToDate(it.date).substring(11, 16) == item)
        return obj ? obj.inNum : 0
      })
      console.log(this.hourSeries[0].data)
      this.hourSeries[1].data = hourList.map(item => {
        const obj = res.data.find(it => this.$tools.gmtToDate(it.date).substring(11, 16) == item)
        return obj ? obj.outNum : 0
      })
      console.log(this.hourSeries[1].data)
      this.hourTag++
    },
    goView(code, name) {
      if (process.env.NODE_ENV === 'production') {
        window.open(
          `/pc-protal/door-data-view#/?schoolCode=${this.userInfo.schoolCode}&schoolName=${this.userInfo.schoolName}&boardCode=${code}&deviceName=${name}`
        )
      } else {
        window.open(
          `http://192.168.1.187:8081/door-data-view.html#/?schoolCode=${this.userInfo.schoolCode}&schoolName=${this.userInfo.schoolName}&boardCode=${code}&deviceName=${name}`
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  .middle-card {
    padding: 10px 10px;
    float: left;
    margin-left: 2%;
    margin-top: 10px;
  }
  .middle-right {
    padding: 10px 10px;
    float: left;
    margin-top: 10px;
  }
  .task-list {
    width: 62%;
  }
  .task-left {
    width: 12%;
    height: 422px;
    text-align: center;
    .u-font-1 {
      font-size: 28px;
    }
    .u-padd-b30 {
      padding-bottom: 40px;
    }
  }
  .charge-list {
    width: 20%;
  }
  .service-list {
    width: 96%;
  }
}
.view-list {
  background: url(../assets/img/sskb_default.png) no-repeat;
  background-size: 100% 100%;
  width: 22.5%;
  height: 240px;
  float: left;
  margin-left: 2%;
  margin-top: 20px;
  position: relative;
  .tip {
    position: absolute;
    width: 100%;
    bottom: 4px;
    z-index: 99;
    left: 10px;
    height: 40px;
    text-align: left;
    color: #444;
    cursor: pointer;
  }
  .tip-btn {
    position: absolute;
    width: 100%;
    bottom: 4px;
    z-index: 999;
    right: 10px;
    height: 40px;
    text-align: right;
  }
}
.add-list {
  width: 22.5%;
  height: 220px;
  float: left;
  margin-left: 2%;
  margin-top: 20px;
  border: 1px @u-border-color solid;
  position: relative;
  .addbtn {
    position: absolute;
    width: 100%;
    z-index: 99;
    text-align: center;
    top: 60px;
  }
}
</style>
