<template>
  <a-modal
    title="播放区域"
    v-model="status"
    :destroyOnClose="true"
    :maskClosable="false"
    width="760px"
    :footer="null"
  >
    <div class="select">
      <a-select
        mode="multiple"
        style="width: 100%"
        placeholder="请选择播放区域"
        @change="handleChange"
      >
        <a-select-option v-for="i in areaList" :key="i.code">
          {{ i.name }}
        </a-select-option>
      </a-select>
      <div class="u-tx-c u-mar-t20">
        <a-button type="primary" @click="onPlay">播放</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  areaName: 'PlayAudio',
  components: {
  },
  props: {
    value: {
      type: Boolean,
      required: false
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      areaList: [],
      show: false,
      chooseList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  mounted() {
    this._getRadioArea()
  },
  methods: {
    ...mapActions('home', ['getRadioArea', 'playRadioSource']),
    // 区域选择
    handleChange(value) {
      this.chooseList = value
      this.show = this.chooseList.length !== 0
    },
    // 区域列表
    async _getRadioArea() {
      const res = await this.getRadioArea(this.userInfo.schoolCode)
      this.areaList = res.data
    },
    // 播放
    async onPlay() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择区域')
        return
      }
      let tms = []
      for (let i = 0; i < this.areaList.length; i++) {
        for (let y = 0; y < this.chooseList.length; y++) {
          if (this.areaList[i].code === this.chooseList[y]) {
            tms = tms.concat(this.areaList[i].ipList)
          }
        }
      }
      const data = {
        level: this.type,
        messageContents: [this.url],
        msgType: '1',
        tms: tms.filter((item, index) => {
          return tms.indexOf(item, 0) === index
        })
      }
      const req = {
        query: this.userInfo.schoolCode,
        data: data
      }
      await this.playRadioSource(req)
      this.$message.success('播放成功')
    }
  }
}
</script>

<style lang="less" scoped>
.select {
  height: 130px;
}
</style>
