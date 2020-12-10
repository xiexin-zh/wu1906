<template>
  <a-modal
    title="试听音频"
    v-model="status"
    :destroyOnClose="true"
    :maskClosable="false"
    width="760px"
    :footer="null"
  >
    <div class="audio-box">
      <audio class="u-mar-t10" :src="url" v-if="url" controls></audio>
    </div>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  areaName: 'PreviewAudio',
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
    }
  },
  data() {
    return {
      areaName: '',
      appForm: {},
      scoreId: '',
      regex: false,
      detailId: ''
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
  methods: {
  }
}
</script>

<style lang="less" scoped>
.audio-box {
  height: 150px;
  padding-top: 30px;
  padding-left: 200px;
}
</style>
