<template>
  <a-modal
    title="宿舍对调"
    v-model="changeTag"
    @ok="changeSubmit"
    width="1250px"
  >
    <a-row type="flex" justify="space-around">
      <a-col :span="11" style="background:rgb(229, 243, 255); padding: 15px">
        <a-row type="flex" justify="space-between">
          <a-col>
            <build-list :max-width="450" ref="leftBuild" @get-floor="getLeftFloor"></build-list>
          </a-col>
          <a-col style="padding-top: 4px">
            <div class="type-button float-l" @click="checkAll('leftRoom', true)">全选</div>
            <div class="type-button float-l" @click="checkAll('leftRoom', false)">反选</div>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col style="overflow-y:scroll">
            <floor-list :is-abnormal="false" ref="leftFloor" @get-room="getLeftRoom"></floor-list>
          </a-col>
          <a-col style="flex: 1; height: 500px; overflow-y: scroll; overflow-x: hidden; margin: 10px 0 0  10px">
            <room-list
              min-h="280"
              ref="leftRoom"
              v-model="leftRoomId"
              :is-choose="true"
              :room-list="leftRoomList"
              :line-num="2"></room-list>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="1">
        <div class="change-img"></div>
      </a-col>
      <a-col :span="11" style="background:rgb(229, 243, 255); padding: 15px">
        <a-row type="flex" justify="space-between">
          <a-col>
            <build-list :max-width="450" ref="rightBuild" @get-floor="getRightFloor"></build-list>
          </a-col>
          <a-col style="padding-top: 4px">
            <div class="type-button float-l" @click="checkAll('rightRoom', true)">全选</div>
            <div class="type-button float-l" @click="checkAll('rightRoom', false)">反选</div>
          </a-col>
        </a-row>
        <a-row type="flex">
          <a-col style="overflow-y:scroll">
            <floor-list :is-abnormal="false" ref="rightFloor" @get-room="getRightRoom"></floor-list>
          </a-col>
          <a-col style="flex: 1; height: 500px; overflow-y: scroll; overflow-x: hidden; margin: 10px 0 0  10px">
            <room-list
              min-h="280"
              ref="rightRoom"
              v-model="rightRoomId"
              :is-choose="true"
              :room-list="rightRoomList"
              :line-num="2"></room-list>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import schoolApi from '../../api/school'
import BuildList from './BuildList'
import FloorList from './FloorList'
import RoomList from './RoomList'
import { mapActions } from 'vuex'
import { setTimeout } from 'timers'
export default {
  name: 'ChangeDialog',
  components: {
    BuildList,
    FloorList,
    RoomList
  },
  props: {
  },
  computed: {
  },
  data () {
    return {
      schoolApi,
      leftRoomId: [],
      rightRoomId: [],
      leftRoomList: [],
      rightRoomList: [],
      changeTag: false,
      leftCheckRoom: [],
      rightCheckRoom: []
    }
  },
  methods: {
    ...mapActions('roomManage', [
      'changeRoom'
    ]),
    changeSubmit () {
      this.leftCheckRoom = this.$refs.leftRoom.newRoomList.filter(function (item) {
        return item.check
      })
      this.rightCheckRoom = this.$refs.rightRoom.newRoomList.filter(function (item) {
        return item.check
      })
      const leftList = []
      const rightList = []
      this.leftCheckRoom.forEach(function (item) {
        if (item.personList.length > 0) {
          return leftList.push(item.personList)
        }
      })
      this.rightCheckRoom.forEach(function (item) {
        if (item.personList.length > 0) {
          return rightList.push(item.personList)
        }
      })
      if (this.leftRoomId.length === 0 || this.rightRoomId.length === 0) {
        this.$message.warning('请选择对调宿舍')
        return
      } else if (this.leftRoomId.sort().toString() === this.rightRoomId.sort().toString()) {
        this.$message.error('请选择不同的宿舍')
        return
      } else if (leftList.length === 0 && rightList.length === 0) {
        this.$message.error('请选择已经入住人员的宿舍')
        return
      }
      this.changeRoom({
        newRoomList: this.leftRoomId,
        oldRoomList: this.rightRoomId,
        schoolCode: window.sessionStorage.getItem('schoolScheme')
      }).then(res => {
        this.$message.success('调宿成功')
        this.changeTag = false
        this.$tools.goNext(() => {
          this.$emit('change-room')
        })
      })
    },
    checkAll (name, type) {
      this.$refs[name].checkAll(type)
    },
    showRoom () {
      this.changeTag = true
      if (this.$refs.leftBuild !== undefined) {
        this.$refs.leftBuild.getBuildList()
        this.$refs.rightBuild.getBuildList()
      }
    },
    getLeftFloor (code) {
      this.$refs.leftFloor.getFloorList(code)
    },
    getRightFloor (code) {
      this.$refs.rightFloor.getFloorList(code)
    },
    getLeftRoom (code) {
      this.getRoom(code, 1)
    },
    getRightRoom (code) {
      this.getRoom(code, 2)
    },
    getRoom (code, type) {
      const _this = this
      this.$ajax.postJsonQuery({
        url: _this.schoolApi.roomList,
        params: {
          schoolScheme: window.sessionStorage.getItem('schoolScheme'),
          floorId: code
        }
      }).then(res => {
        if (type === 1) {
          this.leftRoomList = res.data
        } else {
          this.rightRoomList = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .change-img {
    width: 42px;
    height: 42px;
    margin: 250px 0 0 4px;
    background: url('../../assets/img/change_img.png') no-repeat;
    background-size: 42px 42px;
  }
</style>
