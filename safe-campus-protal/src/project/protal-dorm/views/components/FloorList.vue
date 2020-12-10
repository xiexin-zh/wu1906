<template>
  <div class="floor-list">
    <div :class="['floor-act', { 'floor-act': floorList.length !== 0 }]" :style="{ top: positon.y + 'px' }"></div>
    <div
      @click="getRoom(floor.categoryCode, index)"
      :class="['floor-btn', { 'floor-btn-act': currentIndex === index }]"
      v-for="(floor, index) in floorList"
      :key="floor.categoryCode"
    >
      {{ floor.categoryName }}
      <div v-if="isAbnormal && getAccessCategoryCode(floor.categoryCode)">
        <img class="warn-image" :src="warnImage" />
      </div>
    </div>
  </div>
</template>
<script>
import warnImage from '../../assets/img/icon_unusual_nor.png'
import schoolApi from '../../api/school'
export default {
  name: 'FloorList',
  props: {
    isAbnormal: {
      type: Boolean,
      default: true
    },
    currentDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      warnImage,
      schoolApi,
      floorList: [],
      abnormalList: [],
      currentIndex: 0,
      floorCode: '',
      positon: {
        y: 0
      }
    }
  },
  methods: {
    getAccessCategoryCode: function(categoryCode) {
      var floorIds = this.abnormalList.map(function(item) {
        if (item.flag > 0) {
          return item.floorId
        }
      })
      return floorIds.indexOf(categoryCode) > -1
    },
    getFloorList(code) {
      if (code === '') {
        this.floorList = []
        this.showFloor(code)
        return false
      } else {
        if (this.isAbnormal && this.currentDate !== '') {
          this.$ajax
            .post({
              url:
                this.schoolApi.getAccessFloor +
                '?schoolScheme=' +
                sessionStorage.getItem('schoolScheme') +
                '&buildingId=' +
                code +
                '&date=' +
                this.currentDate,
              params: {}
            })
            .then(res => {
              this.abnormalList = res.data
              this.showFloor(code)
            })
        } else {
          this.showFloor(code)
        }
      }
    },
    showFloor(code) {
      const _this = this
      if (code === '') {
        this.$emit('get-room', code)
        return false
      } else {
        this.$ajax
          .postJsonQuery({
            url: _this.schoolApi.floorList,
            params: {
              schoolCode: window.sessionStorage.getItem('schoolScheme'),
              pCode: code,
              categoryType: '3'
            }
          })
          .then(res => {
            this.currentIndex = 0
            this.floorList = res.data
            if (res.data.length > 0) {
              this.floorCode = res.data[0].categoryCode
              this.positon.y = 0
              this.$emit('get-room', res.data[0].categoryCode)
            }
          })
      }
    },
    getRoom(code, index) {
      this.positon.y = 40 * index + 15 * index
      this.currentIndex = index
      this.floorCode = code
      this.$emit('get-room', code)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.floor-list {
  position: relative;
  max-height: 750px;
  overflow: scroll;
  .floor-not-act {
    height: 40px;
    width: 100px;
    top: 0;
    left: 0;
    position: absolute;
    transition: all 0.3s ease;
    border-radius: 3px;
  }
  .floor-act {
    background: @main-color;
  }
  .floor-btn {
    height: 40px;
    width: 100px;
    text-align: center;
    color: @main-color;
    font-size: 14px;
    line-height: 40px;
    border-radius: 3px;
    cursor: pointer;
    margin: 15px 0;
    position: relative;
  }
  .floor-btn-act {
    color: #fff;
    font-size: 18px;
    background: @main-color;
  }
  .warn-image {
    width: 13px;
    position: absolute;
    right: 15px;
    top: 8px;
  }
}
</style>
