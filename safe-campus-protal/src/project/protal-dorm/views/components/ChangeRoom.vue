<template>
  <a-modal
    title="个人调宿"
    v-model="changeDormitoryVisible"
    width="960px"
    @ok="changeDormitoryHandle"
  >
    <div style="overflow: hidden; background: rgb(229, 243, 255); border-radius: 4px;padding: 15px;">
      <div style="overflow: hidden; margin-bottom: 10px;">
        <build-list :max-width="700" ref="personBuild" @get-floor="getPersonFloor">
        </build-list>
      </div>
      <div style="width: 110px;float: left">
        <floor-list ref="floorPersonCom" @get-room="getPersonRoom"></floor-list>
      </div>
      <div style="flex: 1; height: 500px; overflow-y: scroll; overflow-x: hidden; margin: 10px 0 0  10px">
        <room-list
          min-h="280"
          ref="personRoom"
          v-model="personRoomId"
          isChoose
          isChange
          :line-num="3"></room-list>
      </div>
    </div>
  </a-modal>
</template>

<script>
import BuildList from '../components/BuildList'
import FloorList from '../components/FloorList'
import RoomList from '../components/RoomList'
import { mapActions } from 'vuex'
export default {
  name: 'ChangeRoom',
  components: {
    BuildList,
    FloorList,
    RoomList
  },
  props: {
    personInfo: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    floorCode: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  data () {
    return {
      changeDormitoryVisible: false,
      personRoomId: [],
      isPersonShow: false
    }
  },
  methods: {
    ...mapActions('roomManage',
      ['changeRoomSubmit'
      ]),
    changeDormitoryDialog () {
      if (this.isPersonShow) {
        this.$refs.personBuild.getBuildList()
      }
      this.isPersonShow = true
      this.changeDormitoryVisible = true
    },
    getPersonRoom: function (fId, bId) {
      this.$refs.personRoom.showRoom(fId, bId)
    },
    // 获取个人楼层
    getPersonFloor: function (id) {
      this.$refs.floorPersonCom.showFloor(id)
    },
    changeDormitoryHandle () {
      if (this.personRoomId.length === 0) {
        this.$message.warning('请选择宿舍')
        return
      }
      const params = {
        roomCode: this.personRoomId,
        schoolCode: sessionStorage.getItem('schoolScheme'),
        userCode: this.userId
      }
      this.changeRoomSubmit(params).then(res => {
        this.$message.success('调宿成功')
        this.changeDormitoryVisible = false
        this.$tools.goNext(() => {
          this.$emit('get-room', this.floorCode)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
