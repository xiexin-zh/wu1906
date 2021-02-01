<template>
  <div class="sub-school u-fx-f1 u-fx-ver">
    <u-search-form class="u-padd-r10 u-padd-l20" :search-label="type === '3' ? searchColumns.school : searchColumns.subEdu" @search="search">
      <div slot="left">
        <u-button icon="plus" @click="change" type="primary">{{ type === '3' ? '绑定学校' : '绑定机构' }}</u-button>
      </div>
    </u-search-form>
    <div class="u-fx u-fx-f1">
      <u-table
        :page-list="pageList"
        :columns="type === '3' ? tableColumns.subSchool : tableColumns.subEdu"
        :table-list="schoolList">
      </u-table>
    </div>
    <u-pagination
      justify="end"
      v-model="pageList"
      :total="total"
      @change="_getBindEdu(tag = false)"
    ></u-pagination>
    <u-drawer
      @confirm="sortOk"
      title="绑定学校"
      v-model="isSort"
      :width="500"
    >
      <div class="u-fx-ver page-layout">
        <a-input-search v-model="schoolName" placeholder="请输入学校名称" style="width: 100%" @search="_getUnBindEdu" />
        <div class="u-fx u-fx-f1 u-mar-t">
          <u-table
            is-check
            v-model="chooseList"
            :page-list="pageList"
            :columns="tableColumns.bindSchool"
            :table-list="list">
          </u-table>
        </div>
      </div>
    </u-drawer>
  </div>
</template>

<script>
import searchColumns from '../search-columns/searchColumns.js'
import tableColumns from '../table-columns/tableColumns.js'
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'
// import $tools from '@u/tools'
export default {
  name: 'SubSchool',
  components: {
    draggable
  },
  props: {
    // 机构级别
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchColumns,
      tableColumns,
      isSort: false,
      schoolList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      schoolCode: '',
      list: [],
      chooseList: [],
      schoolName: ''
    }
  },
  mounted() {
    console.log('tyoe', this.type)
    this.searchList.schoolCode = this.$route.query.id
    this._getBindEdu()
  },
  methods: {
    ...mapActions('home', ['getUnBindEdu', 'getBindEdu', 'bindEdu', 'getEduSch', 'getProvinces']),
    // 下属机构列表
    async _getBindEdu() {
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = this.type === '3' ? await this.getEduSch(this.searchList) : await this.getBindEdu(this.searchList)
      this.schoolList = res.data.records
    },
    search(values) {
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.provinceCode = values.areaList[0]
      this.searchList.cityCode = values.areaList[1]
      this.searchList.areaCode = values.areaList[2]
      this.searchList = Object.assign(this.searchList, values)
      this._getBindEdu()
    },
    // 绑定弹框
    async change() {
      this.isSort = true
      this._getUnBindEdu()
    },
    // 可绑定下属机构列表
    async _getUnBindEdu() {
      const req = {
        page: 1,
        size: 999,
        schoolCode: this.$route.query.id,
        schoolName: this.schoolName
      }
      const res = await this.getUnBindEdu(req)
      this.list = res.data.records.map(el => {
        return {
          ...el,
          id: el.schoolCode
        }
      })
    },
    // 绑定学校提交
    async sortOk() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择学校')
        return
      }
      try {
        const req = {
          schoolCode: this.searchList.schoolCode,
          schoolCodeList: this.chooseList
        }
        await this.bindEdu(req)
        this.isSort = false
        this.$message.success('绑定成功')
        this.$tools.goNext(() => {
          this._getBindEdu()
        })
      } catch (err) {
        this.isSort = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
