<template>
  <div class="realBed-page main-container">
    <sign-dialog v-model="personStatus" ref="signDialog" @bk-submit="bkSubmit"></sign-dialog>
    <leave-dialog ref="leaveDialog" @leave-submit="leaveSubmit"></leave-dialog>
    <person-info :person="personInfo" v-model="personDilog" v-if="personDilog" :show="false" :position="position">
      <a-row type="flex" justify="space-around">
        <a-col class="room-button" @click="dialogShow(1)">补卡</a-col>
        <!-- <a-col class="room-button" @click="dialogShow(2)">请假</a-col> -->
      </a-row>
    </person-info>
    <build-list ref="buildList" @get-floor="getFloorList">
      <div class="home-state-flag" slot="right">
        <div class="dk_icon dorm_type_icon"></div>
        <div>打卡</div>
        <div class="sl_icon dorm_type_icon"></div>
        <div>刷脸</div>
        <div class="dksl_icon dorm_type_icon"></div>
        <div>既刷脸又打卡</div>
        <div class="bk_icon dorm_type_icon"></div>
        <div>补卡</div>
        <div class="bzq_icon dorm_type_icon"></div>
        <div>不在寝</div>
      </div>
    </build-list>
    <div style="clear: both"></div>
    <a-row type="flex">
      <a-col>
        <floor-list :is-abnormal="false" ref="floorList" @get-room="getRoomList">
        </floor-list>
      </a-col>
      <a-col class="room-container" :style="{overflowY: 'auto', padding: '5px', overflowX: 'hidden', height: '75vh'}">
        <room-list @get-person="getPerson" :room-list="roomList" room-type="check"></room-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import BuildList from '../components/BuildList'
import PersonInfo from '../components/PersonInfo'
import FloorList from '../components/FloorList'
import RoomList from '../components/RoomList'
import SignDialog from '../components/SignDialog'
import LeaveDialog from '../components/LeaveDialog'
import schoolApi from '../../api/school'
import { mapActions, mapGetters } from 'vuex'
import mixins from '@u/mixins'
export default {
  name: 'RealBedding',
  components: {
    LeaveDialog,
    SignDialog,
    BuildList,
    FloorList,
    RoomList,
    PersonInfo
  },
  mixins: [mixins],
  data () {
    return {
      personStatus: 5,
      bkTag: false,
      personInfo: {},
      personDilog: false,
      position: {},
      roomList: [],
      schoolApi,
      realTimeData: [],
      rawRoomList: [],
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['cycleInfo', 'warningInfo', 'signTaskInfo'])
  },
  created () {
  },
  methods: {
    ...mapActions('realBed', ['getDormRealTime', 'getPersonInfo', 'addSign', 'addLeave']),
    dialogShow (type) {
      if (type === 1) {
        // console.log(this.personInfo)
        this.$refs.signDialog.dkTag = true
      } else {
        this.$refs.leaveDialog.leaveTag = true
      }
    },
    leaveSubmit (values) {
      this.addLeave({
        type: values.leaveType,
        startTime: values.startTime,
        endTime: values.endTime,
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        userCode: this.userId,
        operator: window.sessionStorage.getItem('loginName'),
        class_teacher: this.personInfo.teacherName,
        teacher_phone: this.personInfo.teacherPhone
      }).then(() => {
        this.$refs.leaveDialog.leaveTag = false
        this.$message.success('请假成功')
      })
    },
    bkSubmit (values) {
      this.addSign({
        schoolCode: window.sessionStorage.getItem('schoolScheme'),
        userCode: this.userId,
        taskType: values.taskType,
        inOrOut: values.inOrOut
      }).then(() => {
        this.$refs.signDialog.dkTag = false
        this.$message.success('补卡成功')
        // 刷新房间
        this.$tools.goNext(() => {
          this.getRoomList(this.$refs.floorList.floorCode)
        })
      })
    },
    getPerson (id, type, position) {
      this.userId = id
      this.personDilog = true
      this.personStatus = type
      this.position = position
      this.getPersonInfo({
        userCode: id, schoolCode: window.sessionStorage.getItem('schoolScheme')
      }).then(res => {
        this.personInfo = res.data
      })
    },
    getFloorList (code) {
      this.$refs.floorList.getFloorList(code)
    },
    getRealTime (code) {
      const req = {
        schoolScheme: sessionStorage.getItem('schoolScheme'),
        floorId: code
      }
      this.getDormRealTime(req).then(res => {
        this.realTimeData = res.data
        this.filterRoomData()
      })
    },
    getRoomList (code) {
      if (code) {
        this.$ajax
          .postJsonQuery({
            url: this.schoolApi.roomList,
            params: {
              schoolScheme: window.sessionStorage.getItem('schoolScheme'),
              floorId: code
            }
          })
          .then(res => {
          // _this.roomList = res.data
          // console.log('raw', res.data)
            this.rawRoomList = res.data
            this.getRealTime(code)
          })
      }
    },
    // 处理每个房间的数据
    filterRoomData () {
      if (!this.realTimeData) {
        // this.roomList = this.rawRoomList
        // return
        this.rawRoomList.forEach(item => {
          item.personList.forEach(elem => {
            elem.type = 5
          })
        })
      } else {
        const filterRealTimeData = {}
        this.realTimeData.forEach(el => {
          filterRealTimeData[el.studentId] = el.recordType
        })
        this.rawRoomList.forEach(item => {
          item.personList.forEach(elem => {
            if (!filterRealTimeData[elem.personId]) {
              elem.type = 5
            } else {
              elem.type = filterRealTimeData[elem.personId]
            }
          })
        })
      }
      this.roomList = this.rawRoomList
    }
  }
}
</script>
<style lang="less" scoped>
.realBed-page {
  .home-state-flag {
    float: right;
    margin-top: 6px;
    div {
      float: left;
      line-height: 26px;
    }
    .dorm_type_icon {
      width: 28px;
      height: 28px;
      margin: 0 2px 0 12px;
      background-size: 100%;
      color: #666666;
    }

    .dk_icon {
      background: url('../../assets/img/daka.png') no-repeat;
    }
    .sl_icon {
      background: url('../../assets/img/sl.png') no-repeat;
    }
    .dksl_icon {
      background: url('../../assets/img/dksl.png') no-repeat;
    }
    .bk_icon {
      background: url('../../assets/img/buka.png') no-repeat;
    }
    .bzq_icon {
      width: 18px;
      height: 18px;
      background-color: #ce3830;
      border-radius: 3px;
      box-shadow: 2px 2px 5px #d2d3d6;
      margin-right: 4px;
      margin-top: 3px !important;
    }
  }
}
</style>
