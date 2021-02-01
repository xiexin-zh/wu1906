<template>
  <div class="home page-layout u-fx-ver u-type-white-bg">
    <dorm-card
      :key="index"
      canEdit
      isCheck
      ref="dormCard"
      @changeRoom="changeRoom"
      @exChangeRoom="exChangeRoom"></dorm-card>
    <change-room is-check ref="changeroom" v-if="changeRoomTag" v-model="changeRoomTag" @submit="changeRoomSubmit">
    </change-room>
    <ex-change-room
      ref="exChangeroom"
      :buildName="buildName"
      :chooseRoomList="chooseRoomList"
      v-if="exChangeRoomTag"
      v-model="exChangeRoomTag"
      @submit="exChangeRoomSubmit">
    </ex-change-room>
  </div>
</template>

<script>
import ChangeRoom from '../../component/ChangeRoom.vue'
import ExChangeRoom from '../../component/ExChangeRoom.vue'
import DormCard from '../../component/DormCard.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'DormManage',
  components: {
    DormCard,
    ChangeRoom,
    ExChangeRoom
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      changeRoomTag: false,
      exChangeRoomTag: false,
      index: 0,
      chooseRoomList: []
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', ['changeDorm', 'batchChangeDorm']),
    // 学生调宿
    changeRoom(item) {
      console.log(item)
      this.studentInfo = item
      this.changeRoomTag = true
    },
    // 学生调宿提交
    async changeRoomSubmit(value) {
      try {
        await this.changeDorm({
          roomCode: value.roomCode,
          schoolCode: this.schoolCode,
          userCode: this.studentInfo.userCode
        })
        this.$tools.message('success', '调宿成功')
        this.$refs.changeroom.reset()
        this.$tools.goNext(() => this.index++)
      } catch {
        this.$refs.changeroom.error()
      }
    },
    // 宿舍批量对调
    exChangeRoom(value, buildName) {
      console.log(value, buildName)
      this.chooseRoomList = value
      this.buildName = buildName
      this.exChangeRoomTag = true
    },
    // 宿舍对调提交
    async exChangeRoomSubmit(oldRoomList, newRoomList) {
      try {
        await this.batchChangeDorm({
          newRoomCodeList: newRoomList,
          oldRoomCodeList: oldRoomList.map(ele => ele.roomCode),
          schoolCode: this.schoolCode
        })
        this.$tools.message('success', '宿舍对调成功')
        this.$refs.exChangeroom.reset()
        this.$tools.goNext(() => this.index++)
      } catch {
        this.$refs.exChangeroom.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
