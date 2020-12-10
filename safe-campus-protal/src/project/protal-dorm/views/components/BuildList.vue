<template>
  <div class="build-com">
    <slot name="right"></slot>
    <div @click="scrollRight" v-show="leftShow" class="build_left_btn"></div>
    <div v-if="!isData" style="float:left; color:#666; margin-top: 10px;">暂未添加宿舍</div>
    <div ref="build_list" class="build-list" :style="{ maxWidth: maxWidth + 'px' }">
      <div
        ref="scroll_build"
        class="scroll_build"
        style="position: relative; left: 0; transition: all .3s ease; font-size: 0px; white-space: no-wrap"
      >
        <div
          @click="getFloor(build.categoryCode, build.id, build.categoryName, index)"
          :class="['build-btn', { 'build-btn-act': currentIndex === index }]"
          v-for="(build, index) in buildList"
          :key="build.categoryCode"
        >
          {{ build.categoryName }}
        </div>
      </div>
    </div>
    <div @click="scrollLeft" v-show="rightShow" class="build_right_btn"></div>
    <slot name="edit"></slot>
  </div>
</template>
<script>
import schoolApi from '../../api/school'
export default {
  name: 'BuildList',
  props: {
    // 楼栋列表最大长度，显示滚动切换
    maxWidth: {
      type: Number,
      default: 600
    },
    isLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isData: true,
      leftShow: false,
      rightShow: false,
      schoolApi,
      buildList: [],
      currentIndex: 0,
      currentId: '',
      currentName: ''
    }
  },
  methods: {
    scrollLeft: function() {
      var boxScroll = this.$refs.scroll_build
      var canLeft = boxScroll.scrollWidth - boxScroll.clientWidth - Math.abs(boxScroll.offsetLeft)
      if (canLeft >= 100) {
        boxScroll.style.left = -(Math.abs(boxScroll.offsetLeft) + 100) + 'px'
      } else {
        boxScroll.style.left = -(Math.abs(boxScroll.offsetLeft) + canLeft) + 'px'
      }
      this.leftShow = true
    },
    scrollRight: function() {
      var boxScroll = this.$refs.scroll_build
      var canLeft = Math.abs(boxScroll.offsetLeft)
      if (canLeft >= 100) {
        boxScroll.style.left = boxScroll.offsetLeft + 100 + 'px'
      } else {
        boxScroll.style.left = '0px'
      }
    },
    getBuildList(cb) {
      this.$ajax
        .get({
          url: this.schoolApi.buildList + window.sessionStorage.getItem('schoolScheme')
        })
        .then(res => {
          if (res.data.length === 0) {
            this.isData = false
            if (cb) cb()
            this.$emit('get-floor', '')
            this.buildList = []
            return false
          }
          this.isData = true
          this.currentIndex = 0
          this.currentId = res.data[0].id
          this.currentName = res.data[0].categoryName
          this.buildList = res.data
          this.$emit('get-floor', res.data[0].categoryCode)
          this.$nextTick(function() {
            var scrollW = this.$refs.scroll_build.scrollWidth
            var buildW = this.$refs.build_list.clientWidth
            if (scrollW > buildW) {
              this.rightShow = true
            }
          })
        })
    },
    getFloor(code, id, name, index) {
      this.currentIndex = index
      this.currentId = id
      this.currentName = name
      this.$emit('get-floor', code)
    }
  },
  mounted() {
    if (this.isLoad) this.getBuildList()
  }
}
</script>

<style lang="less" scoped>
.build-list {
  overflow: hidden;
  float: left;
  white-space: nowrap;
  position: relative;
  height: 50px;
  zoom: 1;
  .build-btn {
    display: inline-block;
    height: 40px;
    margin-left: 15px;
    color: @main-color;
    font-size: 14px;
    line-height: 40px;
    border-radius: 3px;
    padding: 0 15px;
    white-space: nowrap;
    cursor: pointer;
    border: 1px @main-color solid;
    &:first-child {
      margin-left: 0;
    }
  }
  .build-btn-act {
    color: #fff;
    background-color: @main-color;
  }
}
.build_left_btn {
  width: 20px;
  height: 20px;
  background: url('../../assets/img/icon_arrowleft_nor.png') no-repeat;
  background-size: 20px;
  float: left;
  margin-top: 10px;
  margin-right: 8px;
  cursor: pointer;
}
.build_right_btn {
  width: 20px;
  height: 20px;
  background: url('../../assets/img/icon_arrowright_nor.png') no-repeat;
  background-size: 20px;
  float: left;
  margin-top: 10px;
  margin-left: 8px;
  cursor: pointer;
}
</style>
