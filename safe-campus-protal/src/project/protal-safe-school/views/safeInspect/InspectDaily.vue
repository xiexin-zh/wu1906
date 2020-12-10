<template>
  <inspect :url="url" :type="type"></inspect>
</template>

<script>
import Inspect from '../../component/Inspect'
export default {
  name: 'InspectDaily',
  components: {
    Inspect
  },
  data() {
    return {
      type: '1',
      url: 'daily'
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped></style>
