<template>
  <div class="page-layout qui-fx-ver">
    <div class="content pos-box">
      <preview-klg></preview-klg>
    </div>
  </div>
</template>
<script>
import PreviewKlg from '../pubicPage/PreviewKlg'
export default {
  name: 'Preview',
  components: {
    PreviewKlg
  },
  data() {
    return {
      detailInfo: {}
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 10px);
  overflow-y: scroll;
}
</style>
