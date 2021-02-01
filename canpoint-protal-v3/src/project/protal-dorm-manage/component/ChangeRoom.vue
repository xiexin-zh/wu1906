<template>
  <a-modal
    width="1400px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <dorm-card :maxHeight="maxHeight" ref="dormCard" isRadio ></dorm-card>
  </a-modal>
</template>

<script>
import DormCard from './DormCard.vue'
export default {
  name: 'ChangeRoom',
  components: {
    DormCard
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
      default: '个人调宿'
    },
    // 学生信息
    studentInfo: {
      type: Object,
      default: () => {
        return {}
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
      maxHeight: document.body.clientHeight - 290,
      confirmLoading: false
    }
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
      if (!this.$refs.dormCard.checkRoomInfo) {
        this.$message.warning(`请选择宿舍`)
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.$refs.dormCard.checkRoomInfo)
    }
  }
}
</script>

<style lang="less" scoped>
  .photo{
    width: 120px;
    height: 160px;
  }
  /deep/ .ant-modal-body{
    padding: 0 14px 10px 14px;
  }
</style>
