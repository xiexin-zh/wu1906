<template>
  <inspect :url="url" :type="type"></inspect>
</template>

<script>
import Inspect from '../../component/Inspect'
export default {
  name: 'InspectEquip',
  components: {
    Inspect
  },
  data() {
    return {
      type: '2',
      url: 'equip'
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped></style>
