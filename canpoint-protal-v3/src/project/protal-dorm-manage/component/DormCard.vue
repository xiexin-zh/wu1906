<template>
  <div class="dorm-card u-fx-ver u-fx-f1 u-padd-l10 u-padd-r10">
    <div class="layout-padd u-fx-ac-jc" v-if="buildingList.length === 0">
      <u-empty description="暂无宿舍~">
        <u-button type="light" icon="plus" @click="dormAction(0)">添加楼栋</u-button>
      </u-empty>
    </div>
    <a-tabs v-else class="tabs" @change="change" v-model="buildingCode">
      <a-tab-pane v-for="building in buildingList" :key="building.key">
        <span slot="tab">
          <span>{{ building.title }}</span>
          <a-icon v-if="canEdit && building.key === buildingCode" @click="dormAction(1, building)" type="edit" />
          <a-icon v-if="canEdit && building.key === buildingCode" @click="dormAction(2, building)" type="delete" />
        </span>
        <div class="u-fx u-fx-f1 u-pos-box">
          <floor-list
            :key="floorindex"
            :currentFloorIndex="currentFloorIndex"
            :canEdit="canEdit"
            :floorList="floorList"
            :maxHeight="maxHeight - 5"
            @chooseFloor="chooseFloor"
            @floorAction="floorAction"
          ></floor-list>
          <div class="u-fx-f1 u-fx-ac-jc" v-if="roomList.length === 0">
            <u-empty description="暂无房间~">
              <u-button v-if="canEdit" type="light" icon="plus" @click="roomAction(0)">新增房间</u-button>
            </u-empty>
          </div>
          <room-list
            v-else
            :maxHeight="maxHeight"
            :key="index"
            :canEdit="canEdit"
            :isCheck="isCheck"
            :isRadio="isRadio"
            :floorInfo="floorInfo"
            :roomList="roomList"
            @chooseRoom="chooseRoom"
            @batchAction="batchAction"
            @roomAction="roomAction"
            @studentAction="studentAction"
          ></room-list>
        </div>
      </a-tab-pane>
      <u-space slot="tabBarExtraContent" v-if="canEdit">
        <u-button type="light" icon="upload" @click="importTag = true">导入</u-button>
        <u-download
          :reqObj="exportReqObj"
          hasIcon
          title="导出"
          type="light"
          fileName="学生宿舍信息采集表"
          fileType="xls"></u-download>
        <u-download
          :reqObj="templateReqObj"
          hasIcon
          title="下载模板"
          type="light"
          fileName="学生宿舍信息采集表"
          fileType="xlsx"></u-download>
        <u-button type="primary" icon="plus" @click="dormAction(0)">添加</u-button>
      </u-space>
    </a-tabs>
    <u-submit-form
      ref="form"
      :title="formTitle"
      :formData="formData"
      v-model="formStatus"
      v-if="formStatus"
      @submit="submit"
    />
    <choose-un-dorm-student
      is-check
      ref="chooseStudent"
      v-if="showFormTag"
      v-model="showFormTag"
      @submit="chooseStudentSubmit"
      :chooseRoomList="chooseList"
    >
    </choose-un-dorm-student>
    <batch-import ref="batchImport" v-if="importTag" v-model="importTag" @submit="importSubmit"> </batch-import>
  </div>
</template>

<script>
import axios from 'axios'
import { Modal } from 'ant-design-vue'
import { buildFormData, roomFormData, editRoomFormData } from '../submit-columns/dormManage.js'
import ChooseUnDormStudent from './ChooseUnDormStudent.vue'
import BatchImport from './BatchImport.vue'
import RoomList from './RoomList.vue'
import FloorList from './FloorList.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DormCard',
  components: { ChooseUnDormStudent, RoomList, FloorList, BatchImport },
  props: {
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: false
    },
    gradeCode: {
      type: String || Number,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择班级'
    },
    // 默认选择
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否为单选
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否为多选
    isCheck: {
      type: Boolean,
      default: false
    },
    // 最大高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 190
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      buildingCode: '',
      buildingList: [],
      floorList: [],
      roomList: [],
      floorInfo: {},
      formTitle: '',
      formData: [],
      formStatus: false,
      showFormTag: false,
      importTag: false,
      currentFloorIndex: 0,
      index: 0,
      floorindex: 100000,
      chooseList: [],
      exportReqObj: {
        url: '',
        method: 'get'
      },
      templateReqObj: {
        url: '/protal_v3_11102/canpointDormManage/download/template',
        method: 'get'
      },
      fileList: []
    }
  },
  async created() {
    this.exportReqObj.url = '/protal_v3_11102/canpointDormManage/exportAllStu?schoolCode=' + this.schoolCode
    await this.getBuildingList(true)
  },
  methods: {
    ...mapActions('home', [
      'getDormTree',
      'getBuildingOrFloor',
      'addBuilding',
      'addFloor',
      'addRoom',
      'updateBuilding',
      'updateRoom',
      'removeDorm',
      'removeRoom',
      'getRoomUsers',
      'batchImport',
      'archivesStudent',
      'batchLeaveDorm',
      'changeDorm',
      'batchChangeDorm',
      'leaveDorm'
    ]),
    /**
     * 查询楼栋或楼层或房间
     * @param { type } Number 宿舍类型(1-楼栋 2-楼层 3-房间)
     * @param { parentCode } String 父编码
     */
    async getDormList(type, parentCode) {
      const res = await this.getBuildingOrFloor({
        schoolCode: this.schoolCode,
        type,
        parentCode
      })
      if (type === 1) {
        this.buildingList = res.data.map((ele) => {
          return {
            ...ele,
            key: ele.code,
            title: ele.name
          }
        })
      } else if (type === 2) {
        this.floorList = res.data
      } else if (type === 3) {
        this.roomList = res.data
      }
    },
    /**
     * 查询房间及其人员
     * @param { parentCode } String 父编码
     */
    async _getRoomUsers(parentCode) {
      const res = await this.getRoomUsers({
        schoolCode: this.schoolCode,
        parentCode
      })
      this.roomList = res.data
    },
    // 初始化查询楼栋楼层房间
    async getBuildingList(tag = false) {
      await this.getDormList(1)
      if (this.buildingList.length > 0) {
        if (tag) {
          this.buildingCode = this.buildingList[0].code
          this.buildingName = this.buildingList[0].name
        }
        await this.getDormList(2, this.buildingList[0].code)
      }
      if (this.floorList.length > 0) {
        this.floorInfo = this.floorList[0]
        await this._getRoomUsers(this.floorList[0].code)
      }
    },
    /**
     * 楼栋操作
     * @param { type } Number 操作类型： 0.新增 1.编辑 2.删除
     * @param { item } Object 操作对象
     */
    dormAction(type, item) {
      console.log(item)
      this.actionType = type
      this.actionMode = 'building'
      this.record = item
      if (type === 0) {
        this.formTitle = '添加楼栋'
        this.actions = 'addBuilding'
        this.formData = this.$tools.fillForm(buildFormData, {})
        this.formStatus = true
      } else if (type === 1) {
        this.formTitle = '编辑楼栋'
        this.actions = 'updateBuilding'
        this.formData = this.$tools.fillForm(
          buildFormData.filter((ele) => ele.value === 'name'),
          item
        )
        this.formStatus = true
      } else {
        this.$confirm({
          title: '温馨提示',
          content: '确定删除该楼栋吗？',
          okType: 'danger',
          onOk: () => {
            this.removeDorm(item.id).then(() => {
              this.$tools.message('success', '删除成功')
              this.$tools.goNext(() => {
                this.getBuildingList(true)
              })
            })
          }
        })
      }
    },
    /**
     * 切换楼栋
     * @param { value } Boolean 选中的楼栋编码
     * @param { tag } Boolean 选中的楼层编码
     */
    async change(value, floorCode) {
      this.floorindex++
      this.buildingCode = value
      this.buildingName = this.buildingList.filter((item) => item.code === value)[0].name
      await this.getDormList(2, value)
      if (this.floorList.length > 0) {
        if (floorCode) {
          this.currentFloorIndex = this.floorList.findIndex((list) => list.code === floorCode)
          this.floorInfo = this.floorList[this.currentFloorIndex]
          await this._getRoomUsers(floorCode)
        } else {
          this.currentFloorIndex = 0
          this.floorInfo = this.floorList[0]
          await this._getRoomUsers(this.floorList[0].code)
        }
      } else {
        this.roomList = []
      }
    },
    // 切换楼层
    async chooseFloor(item) {
      this.floorInfo = item
      this.index++
      await this._getRoomUsers(item.code)
    },
    /**
     * 楼层操作
     * @param { type } Number 操作类型： 0.新增 2.删除
     * @param { item } Object 操作对象
     */
    async floorAction(type, item) {
      if (type === 0) {
        await this.addFloor({
          parentCode: this.buildingCode
        })
        this.$tools.message('success', `添加成功`)
        this.$tools.goNext(async () => {
          await this.getDormList(2, this.buildingCode)
          this.currentFloorIndex = this.floorList.length - 1
          this.chooseFloor(this.floorList[this.floorList.length - 1])
        })
      } else {
        this.removeDorm(item.id).then(() => {
          this.$tools.message('success', '删除成功')
          this.$tools.goNext(async () => {
            await this.getDormList(2, this.buildingCode)
            console.log(this.floorList)
            if (this.floorList.length > 0) {
              this.currentFloorIndex = this.floorList.length - 1
              this.chooseFloor(this.floorList[this.floorList.length - 1])
            } else {
              this.roomList = []
            }
          })
        })
      }
    },
    /**
     * 选中房间
     * @param { list } Array 选中房间数组
     */
    chooseRoom(value) {
      if (this.isRadio) {
        this.checkRoomInfo = value
      } else {
        console.log(value)
        this.chooseRoomCodeList = []
        value.forEach((ele) => {
          const index = this.roomList.findIndex((list) => list.id === ele)
          this.chooseRoomCodeList.push(this.roomList[index].roomCode)
        })
        console.log(this.chooseRoomCodeList)
      }
    },
    /**
     * 房间批量操作
     * @param { type } Number 操作类型： 1.批量删除 2.批量分配 3.批量退宿 4.宿舍对调
     * @param { chooseList } Array 批量操作对象
     */
    async batchAction(type, chooseList) {
      console.log(chooseList)
      this.chooseList = []
      chooseList.forEach((id) => {
        const index = this.roomList.findIndex((list) => list.id === id)
        if (index !== -1) {
          this.chooseList.push(this.roomList[index])
        }
      })
      console.log(this.chooseList)
      if (type === 1) {
        await this.removeRoom(chooseList)
        this.$tools.message('success', '批量删除成功')
        this.$tools.goNext(() => {
          this.index++
          this._getRoomUsers(this.floorInfo.code)
        })
      } else if (type === 2) {
        this.showFormTag = true
      } else if (type === 3) {
        await this.batchLeaveDorm({
          schoolCode: this.schoolCode,
          roomCodeList: this.chooseList.map((ele) => ele.roomCode)
        })
        this.$tools.message('success', '批量退宿成功')
        this.$tools.goNext(() => {
          this.index++
          this._getRoomUsers(this.floorInfo.code)
        })
      } else if (type === 4) {
        const buildName = this.buildingName + '-' + this.floorInfo.name + '-'
        this.$emit('exChangeRoom', this.chooseList, buildName)
      }
    },
    /**
     * 房间操作
     * @param { type } Number 操作类型： 0.新增 1.编辑 2.删除
     * @param { item } Object 操作对象
     */
    async roomAction(type, item) {
      console.log(item)
      this.actionType = type
      this.record = item
      this.actionMode = 'room'
      if (type === 0) {
        if (this.floorList.length === 0) {
          this.$message.warning('请先添加楼层')
          return
        }
        this.formTitle = '添加房间'
        this.actions = 'addRoom'
        this.formData = this.$tools.fillForm(roomFormData, {})
        this.formStatus = true
      } else if (type === 1) {
        this.formTitle = '编辑房间'
        this.actions = 'updateRoom'
        item.bedNum = item.specs
        item.name = item.roomName
        this.formData = this.$tools.fillForm(editRoomFormData, item)
        this.formStatus = true
      } else {
        this.$confirm({
          title: '温馨提示',
          content: '确定删除该房间吗？',
          okType: 'danger',
          onOk: () => {
            this.removeDorm(item.id).then(() => {
              this.$tools.message('success', '删除成功')
              this.$tools.goNext(() => {
                this.index++
                this._getRoomUsers(this.floorInfo.code)
              })
            })
          }
        })
      }
    },
    /**
     * 学生操作
     * @param { type } Number 操作类型： 0.退宿 1.调宿 2.补卡
     * @param { item } Object 操作对象
     */
    async studentAction(type, item) {
      console.log(type)
      if (type === 0) {
        await this.leaveDorm({
          schoolCode: this.schoolCode,
          userCode: item.userCode
        })
        this.$tools.message('success', '退宿成功')
        this.$tools.goNext(() => this._getRoomUsers(this.floorInfo.code))
      } else if (type === 1) {
        this.$emit('changeRoom', item)
      }
    },
    // 楼栋信息提交操作
    async submit(value) {
      const req = {
        ...value,
        schoolCode: this.schoolCode
      }
      if (this.record) req.id = this.record.id
      if (this.actionMode === 'room') req.parentCode = this.floorInfo.code
      try {
        await this[this.actions](req)
        this.$tools.message('success', `${this.actionType === 1 ? '编辑' : '添加'}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          if (this.actionMode === 'building') {
            this.getDormList(1)
            if (this.record) {
              this.change(this.record.code, this.floorInfo.code)
            } else {
              this.getBuildingList(true)
            }
          } else if (this.actionMode === 'room') {
            this._getRoomUsers(this.floorInfo.code)
          }
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    // 批量分配宿舍
    async chooseStudentSubmit(value) {
      try {
        await this.archivesStudent({
          schoolCode: this.schoolCode,
          roomCodeList: this.chooseList.map((ele) => ele.roomCode),
          userList: value
        })
        this.$tools.message('success', `批量分配成功`)
        this.$refs.chooseStudent.reset()
        this.$tools.goNext(() => {
          this.index++
          this._getRoomUsers(this.floorInfo.code)
        })
      } catch (err) {
        this.$refs.chooseStudent.error()
      }
    },
    // 批量导入学生入住
    async importSubmit(value) {
      console.log(value)
      const formData = new FormData()
      formData.append('file', value[0])
      console.log(formData)
      try {
        axios({
        method: 'post',
        url: '/protal_v3_11102/canpointDormManage/batchImport',
        data: formData,
        params: {
          schoolCode: this.schoolCode
        }
      })
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data.data.failMsgList)
            const h = this.$createElement
            const _this = this
            Modal.info({
              title: `导入成功${res.data.data.successCount}条,导入失败${res.data.data.failCount}条`,
              content: h('div', {}, res.data.data.failMsgList.map(item => { return h('div', item) })),
              onOk() {
                _this.$refs.batchImport.reset()
                _this.index++
                _this._getRoomUsers(_this.floorInfo.code)
              }
            })
          } else {
            this.$refs.batchImport.fileList = []
            this.$message.error(res.data.message)
            this.$refs.batchImport.error()
          }
        })
      } catch (err) {
          console.log(456)
          this.$refs.batchImport.fileList = []
          this.$message.error(err)
          this.$refs.batchImport.error()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dorm-card {
  padding-top: 5px;
}
/deep/ .ant-tabs-bar {
  border-bottom: 1px solid #f5f5f5;
  margin: 0 0 10px 0;
}
/deep/ .ant-tabs-nav .ant-tabs-tab {
  margin: 0;
  padding: 15px 10px;
}
.ant-tabs-nav .ant-tabs-tab .anticon {
  margin: 0 0 0 6px;
}
</style>
