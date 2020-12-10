<template>
  <a-modal
    title="播放记录"
    v-model="status"
    :destroyOnClose="true"
    :maskClosable="false"
    width="760px"
    :footer="null"
  >
    <div class="title u-tx-c u-font-2 u-bold u-padd-b10">地震应急疏散演练预案</div>
    <div class="content u-padd-l40 u-padd-r40 u-mar-t20">
      <div>演练开始时间：{{ obj.startTime | gmtToDate }}</div>
      <div>演练进行时长：{{ obj.duration }}</div>
      <div>演练启动人：{{ obj.starterName }}</div>
      <div class="u-mar-t10 u-mar-b10">演练过程：</div>
      <a-timeline>
        <a-timeline-item v-for="list in obj.desList" :key="list.id">
          <div class="qui-fx-jsb">
            <div>
              <div>{{ list.title }}</div>
              <div>{{ list.description }}</div>
            </div>
            <div>{{ list.optTime | gmtToDate }}</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </a-modal>
</template>

<script>
export default {
  areaName: 'DrillDetail',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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
  methods: {
  }
}
</script>

<style lang="less" scoped>
.content {
  min-height: 400px;
  overflow-y: scroll;
}
.title {
  border-bottom: 1px solid #40b2d8;
}
</style>
