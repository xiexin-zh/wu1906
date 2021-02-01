<template>
  <div class="teacher-record page-layout u-fx u-type-white-bg">
    <div class="left-tree">
      <u-org-post :school="schoolCode" @select="select" :key="index"></u-org-post>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form ref="searchForm" :search-label="searchLabel.record" @search="search" @reset="reset">
          <div slot="left">
            <u-space>
              <u-download hasIcon :reqObj="reqObj" title="导出" fileName="教职工考勤记录导出" type="light"></u-download>
            </u-space>
          </div>
        </u-search-form>
      </u-space>
      <div class="u-fx u-fx-f1">
        <div
          class="u-fx-f1"
          id="tableList"
          :style="{
            overflow:'auto',
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            height: '100%'
          }">
          <a-table
            :scroll="{ x: 100, y: setScroll('tableList') }"
            :columns="columns.record"
            :data-source="teacherList"
            :pagination="false"
          >
            <template slot="index" slot-scope="text, record, index">{{ index | getPageIndex(pageList) }}</template>
            <template v-slot:other1="other1">
              <a-popconfirm
                placement="left"
                okText="确定"
                cancelText="取消"
                @confirm="change('morningOnState', other1.id, other1.morningOnState)"
              >
                <template slot="title">
                  确定要将该状态修改为正常吗?
                </template>
                <a-tooltip placement="topLeft" title="修改">
                  <u-type v-if="other1.morningOnState">{{ getDataState('onState', other1.morningOnState) }}</u-type>
                </a-tooltip>
              </a-popconfirm>
            </template>
            <template v-slot:other2="other2">
              <a-popconfirm
                placement="left"
                okText="确定"
                cancelText="取消"
                @confirm="change('morningOffState', other2.id, other2.morningOffState)"
              >
                <template slot="title">
                  确定要将该状态修改为正常吗?
                </template>
                <a-tooltip placement="topLeft" title="修改">
                  <u-type v-if="other2.morningOffState">{{ getDataState('onState', other2.morningOffState) }}</u-type>
                </a-tooltip>
              </a-popconfirm>
            </template>
            <template v-slot:other3="other3">
              <a-popconfirm
                placement="left"
                okText="确定"
                cancelText="取消"
                @confirm="change('noonOnState', other3.id, other3.noonOnState)"
              >
                <template slot="title">
                  确定要将该状态修改为正常吗?
                </template>
                <a-tooltip placement="topLeft" title="修改">
                  <u-type v-if="other3.noonOnState">{{ getDataState('onState', other3.noonOnState) }}</u-type>
                </a-tooltip>
              </a-popconfirm>
            </template>
            <template v-slot:other4="other4">
              <a-popconfirm
                placement="left"
                okText="确定"
                cancelText="取消"
                @confirm="change('noonOffState', other4.id, other4.noonOffState)"
              >
                <template slot="title">
                  确定要将该状态修改为正常吗?
                </template>
                <a-tooltip placement="topLeft" title="修改">
                  <u-type v-if="other4.noonOffState">{{ getDataState('onState', other4.noonOffState) }}</u-type>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
      <u-pagination justify="end" v-model="pageList" :total="total" @change="_getTeaRecord"></u-pagination>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/teacher'
import searchLabel from '../../search-columns/teacher'
export default {
  name: 'TeacherRecord',
  components: {
  },
  data() {
    return {
      getDataState,
      columns,
      searchLabel,
      teacherList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      visible: false,
      title: '',
      roleId: '1',
      roleTag: false,
      index: 0,
      reqObj: {
        url: '/protal_v3_11004/teacher/static/record/list/download',
        method: 'post'
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo', 'userInfo'])
  },
   filters: {
    // 获取表格索引
    getPageIndex: (val, obj) => {
      if (JSON.stringify(obj) === '{}') {
        return val + 1
      } else {
        return (obj.page - 1) * obj.size + val + 1
      }
    }
  },
  methods: {
    ...mapActions('home', ['getTeaRecord', 'delTeacher', 'delTeachers', 'updateTeaState']),
    // 设置table滚动高度
    setScroll(id) {
      if (document.getElementById(id)) {
        return document.getElementById(id).offsetHeight - 40
      }
    },
    select(value) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchObj.orgCode = value.type === '1' ? value.code : ''
      this.searchObj.jobCode = value.type === '2' ? value.code : ''
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getTeaRecord()
    },
    // 获取数据列表
    async _getTeaRecord() {
      this.searchObj.schoolCode = this.schoolCode
      this.searchObj.schoolCode = 'AITEST'
      this.searchObj = Object.assign(this.searchObj, this.pageList)
      const res = await this.getTeaRecord(this.searchObj)
      this.teacherList = res.data.list
      this.total = res.data.total
    },
    // 列表搜索
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      values.startDay = values.rangeTime[0]
      values.endDay = values.rangeTime[1]
      this.searchObj = Object.assign(this.searchObj, values)
      this.reqObj.params = Object.assign(this.searchObj, this.pageList)
      this._getTeaRecord()
    },
    change(string, id, state) {
      if (state === '' || state === '5') {
        this.$message.warning('不能修改')
        return
      }
      const req = {
        optName: this.userInfo.userName,
        recordId: id,
        remark: '',
        userType: '1'
      }
      req[string] = '5'
      this.updateTeaState(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
        })
      })
    },
    reset() {
      this.index++
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ ::-webkit-scrollbar {
  width: 1px !important;
  height: 6px !important;
}
</style>
