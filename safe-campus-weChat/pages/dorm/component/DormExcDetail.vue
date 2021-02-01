<template>
  <view>
    <toggle-list person-num @get-num="getNum" :data-list="exceptionList">
      <template v-slot:title="row">
        <view class="u-fx-jsb">
          <text>{{ row.list.userName }}</text>
          <text class="rit-col" v-if="deptType == 2">{{ row.list.roomName }}</text>
        </view>
      </template>
      <template v-slot:list="row">
          <view class="detail u-fx-ver">
            <text>性别：{{row.list.gender | setSex}}</text>
            <text>班级：{{row.list.className}}</text>
            <text>宿舍：{{row.list.buildingName}}{{row.list.roomName}}</text>
          </view>
          <view class="detail u-type-primary"><text>本月签到异常次数</text></view>
          <view class="detail u-fx-ver">
            <text>晚归：{{ personNum.lateNum }}次</text>
            <text>未归：{{ personNum.noReturnNum }}次</text>
            <text>深夜外出：{{ personNum.nightOutNum }}次</text>
            <text>请假：{{ personNum.leaveNum }}次</text>
          </view>
      </template>
    </toggle-list>
  </view>
</template>

<script>
import ToggleList from './ToggleList'
import mixins from '../../../utils/mixins.js';
import { store, actions } from '../store/index.js';
export default {
  name: 'DormExcDetail',
  components: {
    ToggleList
  },
  mixins: [mixins],
  data () {
    return {
      exceptionList: [],
      personNum: {},
			deptType: ''
    }
  },
  mounted () {
    let { checkStatus, checkType, wdate, deptType, deptCode } = this.$route.query
    actions.getExceptionDetail({
      deptType,
      checkStatus,
      checkType,
      wdate,
      schoolCode: store.userInfo.schoolCode,
      deptCode
    }).then(res => {
      this.exceptionList = res.data.map(item => {
        return {
          ...item,
          toggle: false
        }
      })
    })
  },
  methods: {
    getNum (code) {
      actions.getExceptionNum({
        schoolCode: store.userInfo.schoolCode,
        userCode: code,
        wdate: this.gmtToDate(new Date().getTime()).substring(0, 10)
      }).then(res => {
        this.personNum = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
	text {
		padding-left: 20rpx;
		line-height: 60rpx;
	}
}
</style>
