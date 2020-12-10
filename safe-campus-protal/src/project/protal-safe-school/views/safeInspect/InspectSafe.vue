<template>
  <inspect :url="url" :type="type"></inspect>
</template>

<script>
import Inspect from '../../component/Inspect'
export default {
  name: 'InspectSafe',
  components: {
    Inspect
  },
  data() {
    return {
      type: '3',
      url: 'safe'
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped></style>
