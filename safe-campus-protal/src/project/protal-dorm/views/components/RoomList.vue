/* eslint-disable no-unreachable */
<template>
  <div class="room-list">
    <a-row :gutter="12">
      <a-col
        style="{overflow: 'auto'}"
        v-for="(room, index) in isChange ? changeRoomList : newRoomList"
        :key="room.id"
        :sm="24"
        :md="12"
        :xl="24 / lineNum"
      >
        <div
          :style="{ height: minH + 'px' }"
          :class="['room-card', { 'change-height': isChange }]"
          @mousemove.stop="currentRoom = index"
          @mouseleave.stop="currentRoom = -1"
        >
          <a-row type="flex" :class="isChange ? '' : 'card-title'" justify="space-between" align="middle">
            <a-col :class="isChange ? 'room-change' : ''">
              <div v-if="!isChoose" class="ss_icon"></div>
              <div
                @click.stop="checkRoom(index, isChange, room)"
                v-if="isChoose"
                :class="[
                  'check-icon',
                  isChange
                    ? { 'check-yes': currentIndex === index, 'check-no': currentIndex !== index }
                    : { 'check-yes': room.check, 'check-no': !room.check }
                ]"
              ></div>
              <div class="room-title">{{ room.roomName }}</div>
              <div class="room-spce" v-if="isEdit">{{ room.personList.length }} / {{ room.specifications }}</div>
              <div
                style="float: right; font-size: 18px; color: #999; font-weight: bold; margin-right: 10px;"
                v-if="isChange"
              >
                {{ room.specifications }}
              </div>
            </a-col>
            <a-col v-if="isEdit && currentRoom === index">
              <div
                class="edit-icon"
                @click.stop="editRoom(room.roomName, room.roomId, room.specifications, room.id)"
              ></div>
              <div class="del-icon" @click.stop="delRoom(room.roomId, room.id)"></div>
            </a-col>
          </a-row>
          <a-row :gutter="10" style="padding: 0 15px">
            <div v-for="(person, _index) in isChange ? changeRoomList : room.personList" :key="_index">
              <a-col v-if="!isChange" :sm="24" :md="12" :xl="24 / lineNum">
                <div
                  :class="['person-card', setClass(person.type)]"
                  @click.stop="showPersonInfo($event, person.personId, person.type)"
                >
                  {{ person.personName }}
                </div>
              </a-col>
            </div>
            <a-col
              v-for="(item, _index1) in isChange
                ? parseInt(room.specifications)
                : new Array(parseInt(room.specifications)).slice(room.personList.length, parseInt(room.specifications))"
              :class="isChange ? 'change-card' : ''"
              :key="_index1 + 10000"
              :sm="24"
              :md="12"
              :xl="24 / lineNum"
            >
              <div v-if="!isChange" class="person-card"></div>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col v-if="isAdd" :sm="24" :md="12" :xl="24 / lineNum">
        <div
          class="room-card"
          style="min-height: 190px; line-height:180px;text-align:center;font-size:100px;color:rgb(61, 164, 255);cursor:pointer;"
          @click="addRoom"
        >
          +
        </div>
      </a-col>
    </a-row>
    <div v-if="isChange && show && changeRoomList.length === 0" class="no-data">
      暂无可调宿宿舍
    </div>
    <!-- <add-room ref="addRoom" :floorCode="floorCode" ></add-room> -->
  </div>
</template>
<script>
import mixins from '@u/mixins'
import { mapActions } from 'vuex'
export default {
  name: 'RoomList',
  mixins: [mixins],
  props: {
    // 选择的房间id
    value: {
      type: [String, Array],
      default: () => {
        return []
      }
    },
    minH: {
      type: String,
      default: '190'
    },
    // 显示列数
    lineNum: {
      type: Number,
      default: 4
    },
    // 是否显示复选框
    isChoose: {
      type: Boolean,
      default: false
    },
    // 是否显示人员姓名，个人调宿
    isChange: {
      type: Boolean,
      default: false
    },
    // 是否显示编辑删除
    isEdit: {
      type: Boolean,
      default: false
    },
    // 是否显示添加房间
    isAdd: {
      type: Boolean,
      default: false
    },
    // 首页和实时查寝背景显示区分
    roomType: {
      type: String,
      default: 'home'
    },
    roomList: {
      type: Array,
      default: () => {
        return []
      }
    },
    floorCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      positionXY: {
        x: 0,
        y: 0
      },
      chooseRoomNum: 0,
      currentRoom: -1,
      changeRoomList: [],
      currentIndex: -1,
      show: false
    }
  },
  computed: {
    newRoomList() {
      const newData = this.roomList.map(item => {
        return {
          ...item,
          check: false
        }
      })
      return newData
    }
  },
  methods: {
    ...mapActions('roomManage', ['remainRoomSubmit']),
    addRoom() {
      this.$emit('add-room')
    },
    getRoomId() {
      const roomId = []
      let chooseNum = 0
      this.newRoomList.forEach(item => {
        if (item.check) {
          chooseNum += parseInt(item.specifications) - parseInt(item.personList.length)
          roomId.push(item.roomId)
        }
      })
      this.chooseRoomNum = chooseNum
      this.$emit('input', roomId)
    },
    checkAll(type) {
      if (type) {
        this.newRoomList.forEach(item => {
          item.check = true
        })
      } else {
        this.newRoomList.forEach(item => {
          item.check = !item.check
        })
      }
      this.$forceUpdate()
      this.getRoomId()
    },
    checkRoom(index, isChange, room) {
      if (isChange) {
        this.currentIndex = index
        this.$emit('input', this.changeRoomList[index].roomCode)
      } else {
        this.newRoomList[index].check = !this.newRoomList[index].check
        this.$forceUpdate()
        this.getRoomId()
      }
    },
    editRoom(name, code, specifications, id) {
      this.$emit('edit-room', name, code, specifications, id)
    },
    delRoom(code, id) {
      this.$emit('del-room', 1, id)
    },
    showPersonInfo(event, pId, type) {
      this.showInfo()
      if (event.pageY + 323 > document.documentElement.clientHeight) {
        this.positionXY.y = event.pageY - 323 - event.offsetY - 10
      }
      this.$emit('get-person', pId, type, this.positionXY)
    },
    showRoom: function(fId, bId) {
      this.currentIndex = -1
      var _this = this
      const params = {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        buildingCode: bId,
        floorCode: fId
      }
      _this
        .remainRoomSubmit(params)
        .then(res => {
          _this.changeRoomList = res.data
          // console.log(this.changeRoomList)
          if (_this.changeRoomList.length === 0) {
            _this.show = true
          }
        })
        .catch(err => {
          _this.$message.error(err.message)
        })
    },
    setClass(type) {
      if (this.roomType === 'home') {
        switch (type) {
          case 2:
            return 'wangui'
            break
          case 3:
            return 'weigui'
            break
          case 1:
            return 'qingjia'
            break
          default:
            return ''
            break
        }
      } else if (this.roomType === 'check') {
        switch (type) {
          case 1:
            return 'sl_sjx_icon'
            break
          case 2:
            return 'bk_sjx_icon'
            break
          case 3:
            return 'dk_sjx_icon'
            break
          case 4:
            return 'dksl_sjx_icon'
            break
          case 5:
            return 'bzq_sjx_icon'
            break
          default:
            return ''
            break
        }
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.room-list {
  .no-data {
    padding: 20px;
  }
  .room-card {
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 0px 10px #eee;
    margin-bottom: 25px;
  }
  .card-title {
    height: 45px;
    padding: 0 15px;
    border-bottom: 1px #f5f5f5 solid;
  }
  .person-card {
    overflow: hidden;
    background-color: #eee;
    border-radius: 3px;
    height: 28px;
    color: #26334d;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    margin-top: 10px;
    cursor: pointer;
  }
  .room-title {
    font-size: 24px;
    color: @main-color;
    float: left;
    margin-left: 5px;
  }
  .room-spce {
    position: relative;
    float: left;
    color: @main-color;
    font-size: 12px;
    margin-left: 25px;
    top: 12px;
  }
  .ss_icon {
    float: left;
    width: 30px;
    height: 36px;
    background: url('../../assets/img/sushe.png') no-repeat;
    background-size: 30px 36px;
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
  .dk_sjx_icon {
    background: #eee url('../../assets/img/daka_sjx.png') no-repeat top right;
  }

  .sl_sjx_icon {
    background: #eee url('../../assets/img/sl_sjx.png') no-repeat top right;
  }

  .dksl_sjx_icon {
    background: #eee url('../../assets/img/dksl_sjx.png') no-repeat top right;
  }

  .bk_sjx_icon {
    background: #eee url('../../assets/img/buka_sjx.png') no-repeat top right;
  }

  .bzq_sjx_icon {
    background-color: #ce3830 !important;
    color: #fff !important;
  }
  .edit-icon {
    float: left;
    margin-top: 2px;
    width: 20px;
    height: 20px;
    background: url('../../assets/img/edit_icon2.png') no-repeat;
    background-size: 20px;
    cursor: pointer;
  }
  .del-icon {
    cursor: pointer;
    margin-top: 2px;
    margin-left: 15px;
    float: left;
    width: 20px;
    height: 20px;
    background: url('../../assets/img/delete_icon2.png') no-repeat;
    background-size: 20px;
  }
  .check-icon {
    cursor: pointer;
    margin-top: 9px;
    float: left;
    width: 20px;
    height: 20px;
    display: block;
    margin-right: 6px;
  }
  .check-no {
    background: url('../../assets/img/room_nocheck.png') no-repeat;
    background-size: 20px;
  }
  .check-yes {
    background: url('../../assets/img/room_check.png') no-repeat;
    background-size: 20px;
  }
}
.room-change {
  width: 100%;
  color: #6882da;
  padding-left: 10px;
  border-bottom: 1px #e8e8e8 solid;
  height: 35px;
  line-height: 35px;
  .room-title {
    font-size: 18px;
    color: @main-color;
    float: left;
    font-weight: bold;
  }
}
.change-card {
  margin-left: 12px;
  cursor: pointer;
  color: #595959;
  font-size: 14px;
  width: 90px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  float: left;
  background-color: #efefef;
  margin-top: 10px;
  border-radius: 3px;
}
.change-height {
  min-height: 234px !important;
}
</style>
