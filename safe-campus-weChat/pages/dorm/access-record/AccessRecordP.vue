<template>
  <view class="u-page u-fx u-fx-ver">
    <view class="banner-img banner-crjl"></view>
    <view class="u-fx-je child-list" v-if="childList.length > 1">
      <text @click="chooseChild(child.userCode, index)" :class="{'act': currentIndex === index}" v-for="(child, index) in childList" :key="index">
        {{ child.name }}
      </text>
    </view>
    <view class="mar-top20">
      <search-time v-model="dormDate" @get-time="getTime">
        <view>{{ totalNum }}条记录</view>
      </search-time>
    </view>
    <scroll-view ref="scrollList" class="mar-top10">
      <toggle-list @refresh="$refs.scrollList.refresh()" :data-list="recordList">
        <template v-slot:title = "props" >
          <view class="u-fx-jsb">
            <text>{{ props.list.userName }}</text>
            <text class="rit-col">
              {{props.list.recordTime | getTime(1)}}
            </text>
          </view>
        </template>
        <template v-slot:list = "row">
          <view>
            <text>方向：{{row.list.inOrOut === '1' ? '进' : '出'}}</text>
            <text>位置：{{row.list.controllerName}}</text>
            <text>时间：{{ row.list.recordTime | getTime }}</text>
            <text>班级：{{row.list.className}}</text>
            <text>宿舍：{{row.list.buildingName}}{{row.list.roomName}}</text>
          </view>
        </template>
      </toggle-list>
      <view v-if="isAdd" class="add-page" @click="addPage">加载下一页</view>
    </scroll-view>
  </view>
</template>

<script>
import ToggleList from '../component/ToggleList'
import SearchTime from '../component/SearchTime'
import mixins from '../../../utils/mixins.js';
import { store, actions } from '../store/index.js';
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'AccessRecordP',
  mixins: [mixins],
  components: {
    ToggleList,
    SearchTime
  },
  data () {
    return {
      childList: [],
      currentIndex: 0,
      dormDate: '',
      recordList: [],
      page: 1,
      size: 30,
      isAdd: false,
      totalNum: 0
    }
  },
  mounted () {
    this.dormDate = this.gmtToDate(new Date().getTime() - 3600 * 24 * 1000).substring(0, 10)
    this.getRelationList({
      schoolCode: store.userInfo.schoolCodee,
      typeCode: this.userInfo.typeCode,
      openid: this.userInfo.openId,
      userCode: this.userInfo.userCode
    }).then(res => {
      if (res.data.length === 0) return
      this.childList = res.data
      this.setData({
        key: 'listUser',
        data: res.data[0].userCode
      })
      this.showList(false)
    })
  },
  methods: {
    ...mapActions('parent', [
      'childRecord'
    ]),
    ...mapMutations('parent', [
      'setData'
    ]),
    ...mapActions('bind', [
      'getRelationList'
    ]),
    getTime () {
      this.showList()
    },
    chooseChild (code, index) {
      this.currentIndex = index
      this.setData({
        key: 'listUser',
        data: code
      })
      this.showList()
    },
    showList (tag = false) {
      this.childRecord({
        wdate: this.dormDate,
        listUser: [this.listUser],
        schoolCode: this.userInfo.schoolScheme,
        page: this.page,
        size: this.size
      }).then(res => {
        let dataList = res.data.list
        this.totalNum = res.data.total
        if (dataList.length < 30) {
          this.isAdd = false
        } else {
          this.isAdd = true
        }
        let data = dataList.map(item => {
          return {
            ...item,
            toggle: false
          }
        })
        if (tag) {
          this.recordList = this.recordList.concat(data)
        } else {
          this.recordList = data
        }
      })
    },
    addPage () {
      this.page++
      this.showList(true)
    }
  }
}
</script>

<style lang="less" scoped>
.child-list {
  padding: 15px;
  span {
    padding: 6px 20px;
    border-radius: 15px;
    margin: 0 20px;
  }
}
</style>
