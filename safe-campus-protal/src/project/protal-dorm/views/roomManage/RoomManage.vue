<template>
  <div class="dorm-manage main-container">
    <!-- <guide-dialog top="534" title="此楼栋还未绑定设备，可以在系统设置 > 设备关联模块进行绑定~" :show-tag="DeviceTag">
      <div @click="goDevice">知道了</div>
    </guide-dialog> -->
    <person-info :person="personInfo" v-model="personDilog" v-if="personDilog" :show="true" :position="position">
      <a-row type="flex" justify="space-around">
        <a-col class="room-button" @click="dialogShow(1)">调宿</a-col>
        <a-col class="room-button" @click="dialogShow(2)">退宿</a-col>
      </a-row>
    </person-info>
    <build-list ref="buildList" @get-floor="getFloorList">
      <div slot="edit" class="build_action_button">
        <span class="delete_build" @click="del(0)"></span>
        <span class="add_build" @click="addBuildClick"></span>
        <span class="modify_build" @click="modifyBuildClick"></span>
      </div>
      <div slot="right" class="home-state-flag">
        <div class="type-button float-l" @click="changeRoom">宿舍对调</div>
        <div class="type-button float-l" @click="chooseRoom(true)">全选</div>
        <div class="type-button float-l" @click="chooseRoom(false)">反选</div>
        <div class="type-button float-l" @click="allAssignRoom">批量分配</div>
        <div class="type-button float-l" @click="allRetireRoom">批量退宿</div>
        <div class="type-button float-l" @click="templateClick">模板下载</div>
        <div class="type-button float-l" @click="importClick">导入</div>
      </div>
    </build-list>
    <div style="clear: both"></div>
    <a-row type="flex">
      <a-col style="overflow-y:scroll">
        <floor-list :is-abnormal="false" ref="floorList" @get-room="showRoom"></floor-list>
      </a-col>
      <a-col class="room-container" :style="{ overflowY: 'auto', padding: '5px', overflowX: 'hidden', height: '75vh' }">
        <room-list
          v-model="chooseId"
          ref="roomList"
          isEdit
          isChoose
          isAdd
          @get-person="getPerson"
          :room-list="roomList"
          @edit-room="editRoom"
          @del-room="del"
          :floorCode="floorCode"
          @add-room="addRoom"
        ></room-list>
      </a-col>
    </a-row>
    <edit-room ref="editRoom" @get-room="showRoom" :floorCode="floorCode"></edit-room>
    <add-build ref="addBuild" :refBuildList="refBuildList"></add-build>
    <edit-build ref="editBuild" :refBuildList="refBuildList"></edit-build>
    <change-room
      ref="changeRoom"
      :personInfo="personInfo"
      :userId="userId"
      :floorCode="floorCode"
      @get-room="showRoom"
    ></change-room>
    <room-change ref="roomChange" @change-room="changeRoomOk"></room-change>
    <assign-room ref="assignRoom" @assign-ok="assignOk" :choose-id="chooseId" :choose-num="chooseNum"></assign-room>
    <add-room ref="addRoom" :floorCode="floorCode" @get-room="showRoom"></add-room>
    <batch-import
      ref="batchImport"
      :title="title"
      :url="importUrl"
      :params="importParams"
      @upload-success="handleUploadSuccess"
    >
    </batch-import>
  </div>
</template>
<script>
import mixins from '@u/mixins'
import AssignRoom from '../components/AssignRoom'
import BatchImport from '../components/BatchImport'
import BuildList from '../components/BuildList'
import FloorList from '../components/FloorList'
import RoomList from '../components/RoomList'
import GuideDialog from '../components/GuideDialog'
import schoolApi from '../../api/school'
import OrgTree from '../components/orgTree/OrgTree'
import PersonInfo from '../components/PersonInfo'
import AddBuild from '../components/AddBuild'

import EditBuild from '../components/EditBuild'
import EditRoom from '../components/EditRoom'
import RoomChange from '../components/RoomChange'
import ChangeRoom from '../components/ChangeRoom'
import AddRoom from '../components/AddRoom'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'RoomManage',
  components: {
    BatchImport,
    AssignRoom,
    GuideDialog,
    RoomChange,
    BuildList,
    FloorList,
    RoomList,
    OrgTree,
    AddBuild,
    EditBuild,
    EditRoom,
    PersonInfo,
    ChangeRoom,
    AddRoom
  },
  mixins: [mixins],
  computed: {
    ...mapState('roomManage', ['assignRoomList'])
  },
  data() {
    return {
      DeviceTag: false, // 是否显示设备关联提示
      personDilog: false,
      personInfo: {},
      position: {},
      formLayout: 'horizontal',
      schoolApi,
      roomList: [],
      floorCode: '',
      assignRoomVisible: false,
      hasCount: 0,
      chooseId: [],
      sexList: [
        {
          value: '1',
          label: '男'
        },
        {
          value: '2',
          label: '女'
        }
      ],
      allowClear: true,
      sexValue: '1',
      searchInfoValue: '',
      selectClass: '',
      refBuildList: {},
      changeRoomVisible: false,
      rightRoomList: [],
      leftRoomList: [],
      isShow: false,
      chooseNum: 0,
      title: '',
      importUrl: '',
      importParams: {},
      userId: ''
    }
  },
  methods: {
    ...mapActions('roomManage', ['deleteBuild', 'allRetireRoomSubmit', 'retireRoomSubmit']),
    ...mapActions('deviceRelation', ['getControlList']),
    ...mapActions('realBed', ['getPersonInfo']),
    // 模板下载
    templateClick() {
      const a = document.createElement('a')
      a.href = '/protal_api_11006/dorm/in/record/download/excel'
      a.click()
    },
    // 导入
    importClick() {
      this.$refs.batchImport.addVisible = true
      this.title = '导入'
      this.importParams = {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName')
      }
      this.importUrl = '/protal_api_11006/dorm/in/record/import/excel'
    },
    // 导入成功
    handleUploadSuccess() {
      this.$refs.batchImport.addVisible = false
      this.showRoom(this.floorCode)
    },
    goDevice() {
      // this.$router.push('/systemConfit/deviceRelation')
      this.DeviceTag = false
    },
    dialogShow(type) {
      if (type === 2) {
        this.$tools.delTip('确定要退宿吗?', () => {
          this.retireRoomSubmit(
            '?userCode=' + this.userId + '&schoolCode=' + sessionStorage.getItem('schoolScheme')
          ).then(res => {
            this.$message.success('退宿成功')
            this.$tools.goNext(() => {
              this.showRoom(this.$refs.floorList.floorCode)
            })
          })
        })
      } else {
        this.$refs.changeRoom.changeDormitoryDialog()
      }
    },
    getPerson(id, type, position) {
      this.userId = id
      this.personDilog = true
      this.position = position
      this.getPersonInfo({
        userCode: id,
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      }).then(res => {
        this.personInfo = res.data
      })
    },
    chooseRoom(type) {
      this.$refs.roomList.checkAll(type)
    },
    // 获取房间
    showRoom(code) {
      if (code === '') {
        this.roomList = []
        return false
      } else {
        this.$ajax
          .postJsonQuery({
            url: this.schoolApi.roomList,
            params: {
              schoolScheme: window.sessionStorage.getItem('schoolScheme'),
              floorId: code
            }
          })
          .then(res => {
            this.roomList = res.data
          })
        this.floorCode = code
      }
    },
    getFloorList(code) {
      this.$refs.floorList.getFloorList(code)
      if (code === '') return
      this.getControlList('?buildingCode=' + code + '&schoolCode=' + sessionStorage.getItem('schoolScheme')).then(
        res => {
          if (res.data.list.length === 0) {
            this.DeviceTag = true
          }
        }
      )
    },
    // 获取楼层
    getLeftFloor: function(code) {
      this.$refs.floorLeftCom.getFloorList(code)
    },
    // 获取房间
    getLeftRoom: function(code) {
      this.showRoom(code)
    },
    getRightFloor: function(code) {
      this.$refs.floorRightCom.getFloorList(code)
    },
    // 获取房间
    getRightRoom: function(code) {
      this.showRoom(code)
    },
    // 添加楼栋
    addBuildClick() {
      this.refBuildList = this.$refs.buildList
      this.$refs.addBuild.addBuild()
    },
    // 编辑楼栋
    modifyBuildClick() {
      this.refBuildList = this.$refs.buildList
      if (this.$refs.buildList.currentName === '') return
      this.$refs.editBuild.modifyBuild(this.$refs.buildList.currentName)
    },
    // 删除楼栋
    del(type, code) {
      this.$tools.delTip('确定要删除吗?', () => {
        this.deleteBuild(type ? code : this.$refs.buildList.currentId).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            if (type) {
              this.showRoom(this.floorCode)
            } else {
              this.$refs.buildList.getBuildList()
            }
          })
        })
      })
    },
    // 房间添加
    addRoom() {
      this.$refs.addRoom.addRoomClick(this.$refs.buildList)
    },
    // 房间编辑
    editRoom(name, code, specifications, id) {
      this.$refs.editRoom.editRoomClick(name, code, specifications, id)
    },
    // 批量分配
    assignOk() {
      this.showRoom(this.$refs.floorList.floorCode)
      this.chooseId = []
    },
    allAssignRoom() {
      this.chooseNum = this.$refs.roomList.chooseRoomNum
      if (this.chooseId.length <= 0) {
        this.$message.warning('请选择宿舍')
      } else if (this.chooseNum === 0) {
        this.$message.warning('请选择有床位的宿舍')
      } else {
        this.$refs.assignRoom.assignTag = true
        this.$refs.assignRoom.userName = ''
      }
    },
    assignRoomCancel() {
      this.assignRoomVisible = false
    },
    assignRoomHandle() {},
    // 批量退宿
    allRetireRoom() {
      if (this.chooseId.length <= 0) {
        this.$message.warning('请选择宿舍')
      } else {
        const req = {
          newRoomList: this.chooseId,
          schoolCode: sessionStorage.getItem('schoolScheme')
        }
        this.$tools.delTip('是否将选中房间的人员退宿', () => {
          this.allRetireRoomSubmit(req).then(res => {
            this.$message.success('退宿成功')
            this.$tools.goNext(() => {
              this.showRoom(this.floorCode)
            })
          })
        })
      }
    },
    // 宿舍对调
    changeRoom() {
      this.$refs.roomChange.showRoom()
    },
    changeRoomOk() {
      this.$refs.buildList.getBuildList()
    }
  }
}
</script>
<style lang="less" scoped>
.build_action_button {
  float: left;
}
.build_action_button span {
  height: 33px;
  line-height: 33px;
  cursor: pointer;
  display: inline-block;
}
.home-state-flag {
  margin-top: 3px;
  float: right;
}
.build_action_button {
  float: left;
  span {
    margin-top: 4px;
    width: 33px;
    float: left;
    margin-left: 12px;
    background-size: 33px 33px;
  }
}
.delete_build {
  background: url('../../assets/img/delete_icon.png');
}
.add_build {
  background: url('../../assets/img/Newlyadded_icon.png');
}
.modify_build {
  background: url('../../assets/img/edit_icon.png');
}
.ant-input-number {
  width: 100% !important;
}
.ant-input {
  width: 100% !important;
  // margin: 0 20px!important;
}
</style>
