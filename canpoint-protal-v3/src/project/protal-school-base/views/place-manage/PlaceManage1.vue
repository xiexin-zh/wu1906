<template>
  <div class="place-manage page-layout u-fx-ver u-type-white-bg">
    <u-choose-all
      is-check
      isHigh
      ref="chooseAll"
      :tabKey="['0', '1', '4']"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      :bindObj="bindObj"
      @submit="submit"
    >
    </u-choose-all>
    <div class="u-padd-10">
      <a-button @click="showTag = true" type="primary">综合选择</a-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PlaceManage',
  components: {},
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      showTag: false,
      bindObj: {
      }
    }
  },
  mounted() {},
  methods: {
    ...mapActions('home', []),
    submit(value) {
      console.log(value)
      this.$refs.chooseAll.reset()
    },
    toAddStudent() {
      console.log('toAddStudent')
    }
  }
}
</script>
<style lang="less" scoped></style>
