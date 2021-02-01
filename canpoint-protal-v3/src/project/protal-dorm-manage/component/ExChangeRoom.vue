<template>
  <a-modal
    width="1300px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="u-fx-jsb u-fx-ac">
      <div
        class="left u-fx-ver u-bd-1px u-border-radius u-padd-t20 u-scrool-y"
        :style="{ height: height + 'px' }"
      >
        <div class="room-name u-mar-b10 u-padd-l20 u-te">已选择：{{ buildName }}{{ roomName }}</div>
        <room-list :maxHeight="maxHeight + 10" ref="roomList" :roomList="chooseRoomList"></room-list>
      </div>
      <img class="change-img" :src="changeImg" alt="" />
      <div class="right u-bd-1px u-border-radius u-scrool-y" :style="{ height: height + 'px' }">
        <dorm-card :maxHeight="maxHeight" ref="dormCard" isCheck></dorm-card>
      </div>
    </div>
  </a-modal>
</template>

<script>
import changeImg from '../assets/img/change.png'
import DormCard from './DormCard.vue'
import RoomList from './RoomList.vue'
export default {
  name: 'ExChangeRoom',
  components: {
    DormCard,
    RoomList
  },
  props: {
    // 打开弹窗
    value: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '宿舍对调'
    },
    // 选中宿舍楼栋楼层
    buildName: {
      type: String,
      default: ''
    },
    // 宿舍信息
    chooseRoomList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      changeImg,
      roomName: '',
      height: document.body.clientHeight - 210,
      maxHeight: document.body.clientHeight - 290,
      confirmLoading: false
    }
  },
  created() {
    this.roomName = this.chooseRoomList.map((list) => list.roomName).join(',')
  },
  methods: {
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    submitOk() {
      if (this.$refs.dormCard.chooseRoomCodeList.length === 0) {
        this.$message.warning(`请选择宿舍!`)
        return
      }
      if (this.$refs.dormCard.chooseRoomCodeList.length !== this.chooseRoomList.length) {
        this.$message.warning(`对调房间数量需一致!`)
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.chooseRoomList, this.$refs.dormCard.chooseRoomCodeList)
    }
  }
}
</script>

<style lang="less" scoped>
.photo {
  width: 120px;
  height: 160px;
}
/deep/ .ant-modal-body {
  padding: 14px;
}
.left {
  width: 480px;
  overflow: hidden;
  .room-name {
    width: 450px;
    word-break: break-all;
  }
}
.right {
  width: 620px;
  overflow: hidden;
}
.change-img {
  width: 50px;
  height: 50px;
}
/**滚动条样式**/
/deep/ ::-webkit-scrollbar {
  width: 1px;
}

/*定义滑块 内阴影+圆角*/
/deep/ ::-webkit-scrollbar-thumb {
  background-color: #f5f5f5;
}
</style>
