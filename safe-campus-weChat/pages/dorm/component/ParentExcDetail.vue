<template>
  <view>
    <toggle-list :data-list="exceptionList">
      <template v-slot:title="row">
        <view class="u-fx-jsb">
          <text>{{ row.list.userName }}</text>
          <text class="rit-col">{{ row.list.wdate | gmtToDate('time') }}</text>
        </view>
      </template>
      <template v-slot:list="row">
          <view>
            <text>班级：{{row.list.className}}</text>
            <text>宿舍：{{row.list.buildingName}}{{row.list.roomName}}</text>
            <text>时间：{{ row.list.wdate | gmtToDate('time') }}</text>
          </view>
      </template>
    </toggle-list>
  </view>
</template>

<script>
import ToggleList from './ToggleList'
import { store, actions } from '../store/index.js';
export default {
  name: 'ParenteExcDetail',
  components: {
    ToggleList
  },
  props: {
    query: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      exceptionList: []
    }
  },
  mounted () {
    let { checkStatus, checkType, wdate, listUser }= this.query
    actions.childExceptionDetail({
      listUser: [listUser],
      checkStatus,
			checkType,
      wdate: wdate + '-10',
      schoolCode: store.userInfo.schoolCode
    }).then(res => {
      if (!res.data.list) return
      this.exceptionList = res.data.list.map(item => {
        return {
          ...item,
          toggle: false
        }
      })
    })
  },
  methods: {
  }
}
</script>

<style>

</style>
