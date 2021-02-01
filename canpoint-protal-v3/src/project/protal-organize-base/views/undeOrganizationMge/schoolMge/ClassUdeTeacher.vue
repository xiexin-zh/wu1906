<template>
  <div class="school-ude-teacher u-fx-f1 u-fx-ver">
    <u-empty description="什么也没有~"></u-empty>
  </div>
</template>
<script>
import { tableSchoolAdmin } from '../../../table-columns/schoolMge'
import { mapActions } from 'vuex'
export default {
  name: 'Classteacher',
  components: {
    tableSchoolAdmin
  },
  props: {

  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['getAdmin'])
  }
}
</script>
<style lang="less" scoped>
</style>
