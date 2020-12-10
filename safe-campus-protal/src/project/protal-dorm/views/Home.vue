<template>
  <div class="page-home">
    <!-- <guide-dialog top="342" title="欢迎使用宿管系统，请先新增宿舍" :show-tag="dormTag">
      <div @click="goDrom">宿舍管理</div>
    </guide-dialog>-->
    <div class="home-banner" :style="{ marginTop: bannerTop + 'px' }">
      <div class="home-total-info">
        <div class="info-title">
          <div style="float:left">
            总人数：
            <span>{{ totalInfo.total || 0 }}人</span>
          </div>
          <div style="float:left; margin-left: 30px">
            已归寝：
            <span>{{ totalInfo.inCount || 0 }}人</span>
          </div>
        </div>
        <div class="home-number">
          <div class="home-number-button" @click="getNumberDetail(2, totalInfo.lateCount)">
            晚归人数：
            <span>{{ totalInfo.lateCount || 0 }}</span>人
          </div>
          <div class="home-number-button" @click="getNumberDetail(3, totalInfo.noCount)">
            未归人数：
            <span>{{ totalInfo.noCount || 0 }}</span>人
          </div>
          <div class="home-number-button" @click="getNumberDetail(1, totalInfo.leaveCount)">
            请假人数：
            <span>{{ totalInfo.leaveCount || 0 }}</span>人
          </div>
          <div style="clear: both"></div>
        </div>
        <div style="font-size: 16px">统计数据截止时间：{{ totalInfo.endDate }}</div>
      </div>
    </div>
    <div class="home-build" :style="{ height: homeBuildHeight + 'px' }">
      <build-list :is-load="false" ref="buildList" @get-floor="getFloorList">
        <div class="home-state-flag" slot="right">
          <a-tag color="#efefef"></a-tag>
          <span>在宿舍</span>
          <a-tag color="#ffba00"></a-tag>
          <span>晚归</span>
          <a-tag color="#cc0000"></a-tag>
          <span>未归</span>
          <a-tag color="#999"></a-tag>
          <span>请假</span>
        </div>
      </build-list>
      <div style="clear: both"></div>
      <a-row type="flex">
        <a-col>
          <floor-list ref="floorList" @get-room="getRoomList" :current-date="currentDate"></floor-list>
        </a-col>
        <a-col
          class="room-container"
          :style="{ overflowY: 'auto', padding: '5px', overflowX: 'hidden', height: homeBuildHeight - 85 + 'px' }"
        >
          <room-list @get-person="getPerson" room-type="home" :room-list="roomList"></room-list>
        </a-col>
      </a-row>
    </div>
    <!-- <a-modal
      cancelText=""
      :maskClosable="false"
      @ok="isFirst = false"
      title="宿管系统配置"
      v-model="isFirst"
      :footer="null"
      width="500px"
    >
      <guide-info>
        <a-button @click="isFirst = false" type="primary">知道了</a-button>
      </guide-info>
    </a-modal>-->
    <a-modal :title="'记录详情-' + dialogTitle" v-model="numberVisible" width="985px" :footer="null">
      <a-table
        :columns="columns"
        :dataSource="numberListDetail"
        :pagination="false"
        :loading="loading"
        :scroll="{ y: 471 }"
        style="height:550px"
        :rowKey="(record,index) => index"
      >
        <template slot="other1" slot-scope="text, record, index">
          <div>{{ (schoolType === '8' || schoolType === '9')? `${text.schoolYearId}级${text.gradeName}${text.className}` : text.className }}</div>
        </template>
        <template slot="number" slot-scope="text, record, index">
          <span>{{ (searchForm.page - 1) * searchForm.size + (index + 1) }}</span>
        </template>
        <template slot="name" slot-scope="name">{{ name.first }} {{ name.last }}</template>
        <template slot="parentsList" slot-scope="parentsList">
          <div v-if="!parentsList || parentsList.length === 0">--</div>
          <a-popover placement="top" v-else>
            <template slot="content">
              <div v-for="list in parentsList" :key="list.parentsPhone">
                <p>{{ list.relation | getParentType }}：{{ list.parentsName }} &nbsp; 联系电话：{{ list.parentsPhone }}</p>
              </div>
            </template>
            <div>{{ parentsList[0].relation | getParentType }}：{{ parentsList[0].parentsName }}...</div>
          </a-popover>
        </template>
      </a-table>
      <a-row type="flex" justify="end" align="middle" class="pagination-com">
        <span class="page-total">一共{{ total }}条</span>
        <a-pagination
          :pageSize.sync="searchForm.size"
          :total="total"
          showSizeChanger
          showQuickJumper
          @change="pageChange"
          @showSizeChange="SizeChange"
        />
      </a-row>
    </a-modal>
    <a-modal title="记录详情" v-model="personVisible" :footer="null" width="800px">
      <div class="person-box">
        <div class="user-left">
          <div class="user-date">{{ personStatusDetail.wdate }} {{ personStatusDetail.week }}</div>
          <div class="user-info-box">
            <img :src="renyuan" />
            <span>人员信息</span>
            <span :class="['user-item', selectClass(personStatusDetail.type)]"></span>
            <span style="color:#666;font-size:16px;">{{ getPersonType(personStatusDetail.type) }}</span>
            <p>姓名：{{ personDetail.userName }}</p>
            <p>性别：{{ personDetail.gender === '1' ? '男' : personDetail.gender === '2' ? '女' : '未知' }}</p>
            <p>学号：{{ personDetail.studentNo }}</p>
            <p>班级：{{ (schoolType === '8' || schoolType === '9')? `${personDetail.schoolYearId}级${personDetail.gradeName}${personDetail.className}` : personDetail.className }}</p>
            <p>
              班主任：{{ personDetail.teacherName ? personDetail.teacherName : '暂无' }} &nbsp;&nbsp; 联系电话：{{
                personDetail.teacherPhone ? personDetail.teacherPhone : '暂无'
              }}
            </p>
            <div v-if="personDetail.parentsList && personDetail.parentsList.length > 0">
              <div v-for="list in personDetail.parentsList" :key="list.parentsPhone">
                <p>
                  {{ list.relation | getParentType }}：{{ list.parentsName }} &nbsp;&nbsp; 联系电话：{{
                    list.parentsPhone
                  }}
                </p>
              </div>
            </div>
            <div v-else>
              <p>家长：暂无 &nbsp;&nbsp; 联系电话：暂无</p>
            </div>
          </div>
          <div class="user-info-box">
            <img :src="tongji" />
            <span>人员当前月份累计异常状态次数</span>
            <div id="myChart" style="height:400px"></div>
          </div>
        </div>
        <div class="user-right">
          <div class="user-info-box">
            <img :src="jilu" />
            <span style="color:#6882da">记录详情</span>
          </div>
          <div class="user-img">
            <p>备案照片/当天最新抓拍照片</p>
            <img :src="personDetail.photoSrc ? personDetail.photoSrc : nouser" />
            <img :src="personStatusDetail.img ? personStatusDetail.img : nouser" />
          </div>
          <div class="violation-info">
            <div v-if="personStatusDetail.type === '4'" style="margin-top:40px;">
              <div>
                <img :src="zhuapaishijian" />
                <span>请假开始时间：{{ personStatusDetail.startTime | gmtToDate }}</span>
              </div>
              <div>
                <img :src="shijian" />
                <span>请假结束时间：{{ personStatusDetail.endTime | gmtToDate }}</span>
              </div>
            </div>
            <div v-if="personStatusDetail.type !== '4'">
              <div>
                <img :src="tongguofangxiang" />
                <span>通过方向：{{ personStatusDetail.passDirection ? personStatusDetail.passDirection : '暂无' }}</span>
              </div>
              <div>
                <img style="margin-bottom:3px" :src="zhuapaishebei" />
                <span>抓拍设备：{{ personStatusDetail.controller ? personStatusDetail.controller : '暂无' }}</span>
              </div>
              <div>
                <img :src="weizhi" />
                <span>所在位置：{{ personStatusDetail.position ? personStatusDetail.position : '暂无' }}</span>
              </div>
              <div>
                <img :src="zhuapaishijian" />
                <span>抓拍时间：{{ personStatusDetail.accessTime ? personStatusDetail.accessTime : '暂无' }}</span>
              </div>
              <div>
                <img :src="shijian" />
                <span>
                  应归时间：{{
                    personStatusDetail.shouldReturnTime ? personStatusDetail.shouldReturnTime : '暂无'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import mixins from '@u/mixins'
import BuildList from './components/BuildList'
import GuideInfo from './components/GuideInfo'
import GuideDialog from './components/GuideDialog'
import FloorList from './components/FloorList'
import RoomList from './components/RoomList'
import schoolApi from '../api/school'
import renyuan from '../assets/img/renyuan.png'
import tongji from '../assets/img/tongji.png'
import jilu from '../assets/img/jilu.png'
import nouser from '../assets/img/nouser.jpg'
import zhuapaishijian from '../assets/img/zhuapaishijian.png'
import shijian from '../assets/img/shijian.png'
import tongguofangxiang from '../assets/img/tongguofangxiang.png'
import zhuapaishebei from '../assets/img/zhuapaishebei.png'
import weizhi from '../assets/img/weizhi.png'
import { mapState, mapActions } from 'vuex'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: '7%',
    align: 'center',
    scopedSlots: {
      customRender: 'number'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%',
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '8%',
    align: 'center',
    customRender: function (text, row, index) {
      if (text === '1') {
        text = '男'
      } else if (text === '2') {
        text = '女'
      } else {
        text = '未知'
      }
      return text
    }
  },
  {
    title: '学号',
    dataIndex: 'userNo',
    width: '15%',
    align: 'center'
  },
  {
    title: '班级',
    width: '18%',
    align: 'center',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '班主任/联系电话',
    dataIndex: 'teacherName',
    width: '18%',
    align: 'center',
    customRender: function (text, row, index) {
      if (text) {
        text = row.teacherName + '/' + row.teacherPhone
      } else {
        text = '--'
      }
      return text
    }
  },
  {
    title: '家长/联系电话',
    dataIndex: 'parentsList',
    width: '18%',
    align: 'center',
    scopedSlots: {
      customRender: 'parentsList'
    }
    // customRender: function (text, row, index) {
    //   if (text) {
    //     text = row.parentsList.parentsName + '/' + row.parentsList.parentsPhone
    //   } else {
    //     text = '--'
    //   }
    //   return text
    // }
  }
]
export default {
  name: 'Home',
  components: {
    GuideDialog,
    GuideInfo,
    BuildList,
    FloorList,
    RoomList
  },
  mixins: [mixins],
  computed: {
    ...mapState('home', ['totalInfo', 'numberListDetail', 'personDetail', 'personStatusDetail', 'total'])
  },
  data() {
    return {
      isFirst: false,
      dormTag: false,
      currentDate: this.getDateTime(new Date()),
      renyuan,
      tongji,
      jilu,
      nouser,
      zhuapaishijian,
      shijian,
      tongguofangxiang,
      zhuapaishebei,
      weizhi,
      schoolApi,
      roomList: [],
      userState: [],
      rawRoomList: [],
      loading: true,
      totalDetail: {},
      numberVisible: false,
      pagination: false,
      columns,
      personVisible: false,
      countTitle: '',
      dialogTitle: '',
      searchForm: {
        page: 1
      },
      params: {},
      schoolType: JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
    }
  },
  filters: {
    gmtToDate(t) {
      const d = new Date(t)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 10 ? d.getDate() : '0' + d.getDate()) +
        ' ' +
        (d.getHours() > 10 ? d.getHours() : '0' + d.getHours()) +
        ':' +
        (d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes()) +
        ':' +
        (d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds())
      )
    },
    getParentType(type) {
      if (type === '1') {
        return '爸爸'
      } else if (type === '2') {
        return '妈妈'
      } else if (type === '3') {
        return '爷爷'
      } else if (type === '4') {
        return '奶奶'
      } else {
        return '家长'
      }
    }
  },
  methods: {
    ...mapActions('home', ['getTotal', 'getNumberList', 'getPersonChart', 'getPersonDetail', 'getPersonStatus']),
    ...mapActions('timeSet', ['oneUpdateSignTaskInfo', 'oneUpdateWarningSet', 'oneUpdateStatCycle', 'getCycleList']),
    goDrom() {
      this.$router.push('/roomManage')
    },
    getPersonType(type) {
      switch (type) {
        case '2':
          return '晚归'
          break
        case '3':
          return '未归'
          break
        case '1':
          return '请假'
          break
        default:
          return '正常'
          break
      }
    },
    selectClass(type) {
      switch (type) {
        case '2':
          return 'wangui'
          break
        case '3':
          return 'weigui'
          break
        case '1':
          return 'qingjia'
          break
        default:
          return 'zaiqin'
          break
      }
    },
    getPerson(id, type) {
      this.getPersonDetail({
        userCode: id,
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      })
      this.getPersonStatus(
        '?studentId=' +
          id +
          '&date=' +
          this.currentDate +
          '&status=' +
          type +
          '&schoolScheme=' +
          sessionStorage.getItem('schoolScheme')
      )
      this.getPersonChart('?studentId=' + id + '&schoolScheme=' + sessionStorage.getItem('schoolScheme')).then(
        (res) => {
          this.personPie(res)
        }
      )
      this.personVisible = true
    },
    personPie(res) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      var pieData = [
        {
          value: res.lateNum,
          name: '晚归'
        },
        {
          value: res.leaveNum,
          name: '请假'
        },
        {
          value: res.noReturnNum,
          name: '未归'
        }
      ]
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          itemGap: 30,
          formatter: '{a} <br/>{b} : {c}次'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          align: 'left',
          top: 20,
          data: ['晚归', '未归', '请假'],
          icon: 'stack',
          itemWidth: 14, // 设置宽度
          itemHeight: 14 // 设置高度
        },
        color: ['#ffba00', '#999', '#cc0000', '#cc3333'],
        series: [
          {
            name: '当前月份累计',
            type: 'pie',
            radius: '32%',
            center: ['37%', '25%'],
            data: pieData,
            label: {
              normal: {
                formatter: '{b}\n{c}次'
              }
            },
            labelLine: {
              // 指示线状态
              show: true,
              length: 8
            }
          },
          {
            name: '当前月份累计',
            type: 'pie',
            radius: '32%',
            center: ['37%', '25%'],
            data: pieData,
            itemStyle: {
              normal: {
                label: {
                  // 此处为指示线文字
                  show: true,
                  position: 'inner', // 标签的位置
                  textStyle: {
                    fontWeight: 200,
                    fontSize: 12 // 文字的字体大小
                  },
                  formatter: '{d}%'
                }
              }
            }
          }
        ]
      })
    },
    // 统计获取学生归寝情况
    getNumberDetail(type, totalCount) {
      this.params.schoolScheme = sessionStorage.getItem('schoolScheme')
      this.params.checkStatus = type
      // this.params.excType = type
      this.params.date = this.totalInfo.date
      this.searchForm.page = 1
      this.searchForm.size = 20
      if (type === 2) {
        this.dialogTitle = '晚归人数'
      } else if (type === 3) {
        this.dialogTitle = '未归人数'
      } else if (type === 1) {
        this.dialogTitle = '请假人数'
      } else {
        this.dialogTitle = '正常人数'
      }
      if (totalCount > 0) {
        this.numberListGet()
      }
    },
    SizeChange(page, size) {
      this.searchForm.page = page
      this.searchForm.size = size
      this.numberListGet()
    },
    pageChange(page, size) {
      this.searchForm.page = page
      this.searchForm.size = size
      this.numberListGet()
    },
    numberListGet() {
      this.getNumberList({
        ...this.params,
        ...this.searchForm
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.list.length > 0) {
            this.numberVisible = true
          }
        }
      })
    },
    getFloorList(code) {
      this.$refs.floorList.getFloorList(code)
    },
    getRoomList(code) {
      if (code === '') {
        this.roomList = []
        return false
      } else {
        if (this.currentDate === '') {
          this.showRoom(code)
          return
        }
        this.$ajax
          .post({
            url:
              this.schoolApi.getAccessUsers +
              '?schoolScheme=' +
              sessionStorage.getItem('schoolScheme') +
              '&floorId=' +
              code +
              '&date=' +
              this.currentDate,
            params: {}
          })
          .then((res) => {
            this.userState = res.data
            this.showRoom(code)
          })
      }
    },
    showRoom(code) {
      this.$ajax
        .postJsonQuery({
          url: this.schoolApi.roomList,
          params: {
            schoolScheme: window.sessionStorage.getItem('schoolScheme'),
            floorId: code
          }
        })
        .then((res) => {
          this.rawRoomList = res.data
          this.filterRoomData()
        })
    },
    // 处理每个房间的数据
    filterRoomData() {
      const filterRoomState = {}
      if (!this.userState) {
        this.rawRoomList.forEach((item) => {
          item.personList.forEach((elem) => {
            elem.type = 0
          })
        })
      } else {
        this.userState.forEach((el) => {
          if (el.inFlag === '1') {
            filterRoomState[el.studentId] = 0
          } else if (el.inFlag === '2') {
            filterRoomState[el.studentId] = 2
          } else if (el.outFlag === '1') {
            filterRoomState[el.studentId] = 3
          } else if (el.leaveFlag === '1') {
            filterRoomState[el.studentId] = 1
          } else {
            filterRoomState[el.studentId] = 0
          }
        })
        this.rawRoomList.forEach((item) => {
          item.personList.forEach((elem) => {
            if (!filterRoomState[elem.personId]) {
              elem.type = 0
            } else {
              elem.type = filterRoomState[elem.personId]
            }
          })
        })
      }

      this.roomList = this.rawRoomList.map((item) => {
        return {
          ...item,
          blockNum: item.personList.length + ''
        }
      })
      this.$forceUpdate()
    }
  },
  created() {},
  mounted() {
    this.getTotal().then((res) => {
      if (res.data === null) {
        this.totalInfo.endDate = '数据正在统计中...'
      }
      console.log('res', res.data)
      this.currentDate = res.data ? res.data.date : this.getDateTime(new Date())
      this.$refs.buildList.getBuildList((res) => {
        this.dormTag = true
        this.isFirst = true
      })
      this.loading = false
    })
    // 初始化时间设置
    this.getCycleList({
      schoolCode: sessionStorage.getItem('schoolScheme')
    }).then((res) => {
      if (res.data === null || res.data === '' || JSON.stringify(res.data) === '{}') {
        this.oneUpdateSignTaskInfo({ type: 1 })
        this.oneUpdateSignTaskInfo({ type: 2 })
        this.oneUpdateWarningSet({})
        this.oneUpdateStatCycle({})
      }
    })
  }
}
</script>
<style lang="less" scoped>
.page-home {
  display: flex;
  flex-flow: column;
  .home-banner {
    height: 220px;
    background: url(../assets/img/left.png) no-repeat left top, url(../assets/img/Rightside.png) no-repeat right top,
      url(../assets/img/Middle.png) repeat center center;
    background-size: auto 100%;
    display: flex;
    position: relative;
    margin-bottom: 10px;
    .home-total-info {
      color: #ffffff;
      letter-spacing: 2px;
      position: absolute;
      left: 95px;
      top: 30px;
      .info-title {
        font-size: 20px;
        margin-left: 300px;
        clear: both;
      }
      .home-number {
        .home-number-button {
          font-size: 16px;
          float: left;
          border: 1px #bfd6f8 solid;
          border-radius: 3px;
          padding: 0 18px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          margin: 35px 15px 25px 0;
          box-shadow: 0px 0px 1px #bfd6f8;
          cursor: pointer;
          transition: all 0.2s ease;
          -webkit-transition: all 0.2s ease;
          &:hover {
            background: #4285f4;
            transform: scale(1.02);
            border: 1px #bfd6f8 solid;
            -webkit-transform: scale(1.02);
            box-shadow: 0px 0px 1px #fff;
          }
        }
      }
    }
  }
  .home-build {
    flex: 1;
    background-color: #fff;
    padding: 10px;
    .home-state-flag {
      float: right;
      margin: 15px 10px 0 0;
      .ant-tag {
        height: 15px !important;
        vertical-align: sub;
      }
      span {
        margin: 5px 10px 0 -5px;
      }
    }
  }
}
.warn-image {
  width: 13px;
  position: absolute;
  right: 15px;
  top: 8px;
}
.person-box {
  background: url('../assets/img/info-bg.png') no-repeat;
  height: 500px;
  .user-left {
    float: left;
    width: 47%;
    height: 500px;
    margin-right: 22px;
    border-right: 3px solid #6882da;
    padding: 15px 0 0 10px;
    .user-date {
      font-size: 20px;
      color: #6882da;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    .user-info-box {
      margin-bottom: 10px;
      img {
        width: 20px;
        margin-right: 5px;
        vertical-align: bottom;
      }
      > span {
        font-size: 16px;
        color: #6882da;
      }
      p {
        font-size: 14px;
        margin: 8px 0 8px 24px;
        color: #222;
      }
    }
  }
  .user-right {
    float: left;
    width: 49%;
    padding-top: 15px;
    .user-info-box {
      span {
        color: #ff3d3d;
      }
      img {
        width: 20px;
        margin-right: 5px;
        vertical-align: bottom;
      }
    }
    .user-img {
      p {
        margin-left: 25px;
        margin: 8px;
        font-size: 12px;
      }
      img {
        width: 46%;
        height: 200px;
        margin-right: 10px;
      }
    }
    .violation-info {
      div {
        margin: 15px 0;
        font-size: 14px;
        color: #222;
        img {
          width: 18px;
          margin-right: 10px;
          vertical-align: bottom;
        }
      }
    }
  }
}
.user-item {
  height: 14px;
  width: 14px;
  color: #26334d;
  border-radius: 2px;
  line-height: 14px;
  font-size: 1.1em;
  cursor: pointer;
  margin: 0 5px 0 15px;
  display: inline-block;
}
.wangui {
  color: #fff;
  background-color: #ffba00;
}
.zaiqin {
  background-color: #efefef;
}
.weigui {
  color: #fff;
  background-color: #cc0000;
}
.qingjia {
  color: #fff;
  background-color: #999;
}
.pagination-com {
  padding: 35px 0 26px 0;
  .page-total {
    font-size: 14px;
    margin-right: 10px;
  }
}
</style>
