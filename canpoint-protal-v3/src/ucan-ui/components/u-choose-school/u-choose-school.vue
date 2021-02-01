<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <u-search-form class="u-mar-b10" :search-label="columnList.schoolLabel" @search="searchForm">
    </u-search-form>
    <div class="choose-school u-fx">
      <div class="u-fx-ver u-fx-f1">
        <u-table
          :scroll-h="500"
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          :page-list="pageList"
          v-model="chooseList"
          :columns="columnList.schoolColumns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="schoolList"
        ></u-table>
        <div class="u-fx-je">
          <u-pagination :total="total" v-model="pageList" @change="getSchoolList"></u-pagination>
        </div>
      </div>
      <div class="school-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.schoolCode" class="u-fx-jsb u-fx-ac">
              <span>{{ item.schoolName }}</span>
              <a-tag @click="delUser(item.schoolCode, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
import columnList from '../../asstes/js/choose-data-colums'

export default {
  name: 'ChooseSchool',
  components: {},
  props: {
    // 机构编码
    schoolCode: {
      type: String,
      default: ''
    },
    // 更新方式 false：更新所有，true：新增和删除分开更新
    updateType: {
      type: Boolean,
      default: false
    },
    // 允许选择空数据,默认不允许
    allowEmpty: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '选择学校'
    },
    // 打开弹窗
    value: {
      type: Boolean,
      default: false
    },
    // 是否为单选
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否为多选
    isCheck: {
      type: Boolean,
      default: false
    },
    // 已选择数据回显
    bindList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      total: 0,
      columnList,
      schoolList: [],
      totalList: [],
      oldTotalList: []
    }
  },
  async mounted() {
    // console.log(this.bindList)
    this.chooseList = this.bindList.map(el => el.schoolCode)
    this.totalList = this.bindList.map(el => {
      return {
        ...el,
        id: el.schoolCode
      }
    })
    if (this.updateType) { this.oldTotalList = JSON.parse(JSON.stringify(this.totalList)) }
    this.getSchoolList()
  },
  methods: {
    async getSchoolList() {
      const res = await $ajax.post({
        url: `/protal_v3_11101/canpointSchool/school/page/edu`,
        params: {
          schoolCode: this.schoolCode,
          ...this.pageList,
          ...this.searchObj
        }
      })
      this.schoolList = res.data.records.map((item) => {
        return {
          ...item,
          id: item.schoolCode
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = values
      this.searchObj.provinceCode = values.areaList[0]
      this.searchObj.cityCode = values.areaList[1]
      this.searchObj.areaCode = values.areaList[2]
      this.getSchoolList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    error() {
      this.confirmLoading = false
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.schoolCode === item.schoolCode
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      // console.log(item)
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
          // console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.schoolCode === item.schoolCode)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && !this.allowEmpty) {
        this.$message.warning(`请${this.title}`)
        return
      }
      this.confirmLoading = true
      if (this.updateType) {
        const delUserList = this.oldTotalList.filter(item => {
          return JSON.stringify(this.totalList).indexOf(item.id) === -1
        })
        const addUserList = this.totalList.filter(item => {
          return JSON.stringify(this.oldTotalList).indexOf(item.id) === -1
        })
        this.$emit('submit', { delUserList, addUserList })
      } else {
        this.$emit('submit', this.totalList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-school {
  height: 600px;
  .school-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
