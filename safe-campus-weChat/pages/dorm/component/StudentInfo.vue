<template>
  <view class="student">
    <view class="u-fx">
      <view class="student-pic">
        <image :src="info.photoSrc" alt="">
      </view>
      <view class="student-info u-fx-f1 u-fx-ver u-fx-jsb">
        <p>姓名：{{info.userName}}</p>
        <p>性别：{{info.gender | setSex}}</p>
        <p>班级：{{ info.gradeName}}{{ info.className}}</p>
        <p >班主任：{{ info.teacherName || '--'}}</p>
        <!-- <p v-if="store.roleInfo.deptType !== 1">班主任：{{ info.teacherName || '--'}}</p> -->
      </view>
    </view>
    <view class="u-fx mar-top10">
      <!-- <p v-if="store.roleInfo.deptType !== 1">班主任电话：{{ info.teacherPhone || '--' }}</p> -->
      <p >班主任电话：{{ info.teacherPhone || '--' }}</p>
    </view>
    <slot></slot>
  </view>
</template>

<script>
import { store, actions } from '../store'
export default {
  name: 'StudentInfo',
  props: {
  },
  data () {
    return {
      info: {}
    }
  },
  methods: {
    loadInfo (id) {
      actions.getStudentInfo({userCode: id}).then(res => {
        this.info = res.data
        console.log('1',this.info)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .student {
    border-radius: 8rpx;
    padding: 30rpx;
    color:#fff;
    background-color: #3d7eff;
    p {
      line-height: 52rpx;
    }
  }
  .student-pic {
    width: 160rpx;
    height: 200rpx;
    background-color:#fff;
    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .student-info {
    font-size: 28rpx;
    color:#fff;
    margin-left: 20rpx;
  }
  .mar-top10 {
    margin-top: 10rpx;
  }
</style>
