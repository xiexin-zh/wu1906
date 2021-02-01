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
    <template v-if="hasAddTag" slot="footer">
      <div class="u-fx-jsb u-fx-ac">
        <div class="add-student">
          <span>
            <a @click="addStudent">未找到学生?点击新建学生></a>
          </span>
        </div>
        <div>
          <a-button key="back" @click="handleCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" :loading="confirmLoading" @click="submitOk">
            确定
          </a-button>
        </div>
      </div>
    </template>
    <u-search-form class="u-mar-b10" :search-label="columnList.studentSearchLabel" @search="searchForm"></u-search-form>
    <div class="choose-student u-fx">
      <u-class-tree :isOnlyNewSchoolYear="isOnlyNewSchoolYear" :school="schoolCode" @select="selectTree"></u-class-tree>
      <div class="u-fx-ver u-fx-f1">
        <u-table
          :scroll-h="500"
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          :page-list="pageList"
          v-model="chooseList"
          :columns="columnList.studentColumns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="studentList"
        >
          <template v-slot:slotOne="slotOne">
            <a-tag ghost :color="slotOne.record.hasDorm ? 'green' : 'pink'">{{
              slotOne.record.hasDorm ? '住读' : '走读'
            }}</a-tag>
          </template>
        </u-table>
        <div class="u-fx-je">
          <u-pagination :total="total" v-model="pageList" @change="getstudentList"></u-pagination>
        </div>
      </div>
      <div class="student-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.userCode" class="u-fx-jsb u-fx-ac">
              <span>{{ item.userName }}</span>
              <a-tag @click="delUser(item.userCode, index)" color="#f50">删除</a-tag>
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
  name: 'Choosestudent',
  components: {},
  props: {
    // 学校编码
    schoolCode: {
      type: String,
      default: ''
    },
    // 是否只看当前学年
    isOnlyNewSchoolYear: {
      type: Boolean,
      default: false
    },
    // 更新方式 false：更新所有，true：新增和删除分开更新
    updateType: {
      type: Boolean,
      default: false
    },
    // 允许选择空数据
    allowEmpty: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '选择学生'
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
    // 是否可以新建学生
    hasAddTag: {
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
      total: 0,
      columnList,
      selectObj: {},
      studentList: [],
      totalList: [],
      oldTotalList: []
    }
  },
  async mounted() {
    console.log(this.bindList)
    this.chooseList = this.bindList.map((el) => el.userCode)
    this.totalList = this.bindList.map((el) => {
      return {
        ...el,
        id: el.userCode
      }
    })
    if (this.updateType) {
      this.oldTotalList = JSON.parse(JSON.stringify(this.totalList))
    }
  },
  methods: {
    async getstudentList() {
      const params = {
        schoolCode: this.schoolCode,
        ...this.selectObj,
        ...this.searchObj,
        ...this.pageList
      }
      const res = await $ajax.post({
        url: `/protal_v3_11101/canpointUserInfo/student/queryStudentList`,
        params
      })
      this.studentList = res.data.records.map((item) => {
        return {
          ...item,
          userId: item.id,
          id: item.userCode
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchObj = values
      this.getstudentList()
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
    selectTree(item) {
      console.log(item)
      this.pageList.page = 1
      this.selectObj = item
      this.getstudentList()
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.userCode === item.userCode
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      console.log(item)
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
          console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.userCode === item.userCode)
        this.totalList.splice(index, 1)
      }
    },
    handleCancel() {
      this.$emit('input', false)
    },
    submitOk() {
      if (this.totalList.length === 0 && !this.allowEmpty) {
        this.$message.warning(`请${this.title}`)
        return
      }
      this.confirmLoading = true
      if (this.updateType) {
        const delList = this.oldTotalList.filter((item) => {
          return JSON.stringify(this.totalList).indexOf(item.id) === -1
        })
        const addList = this.totalList.filter((item) => {
          return JSON.stringify(this.oldTotalList).indexOf(item.id) === -1
        })
        this.$emit('submit', { delList, addList })
      } else {
        this.$emit('submit', this.totalList)
      }
    },
    addStudent() {
      this.$emit('toAddStudent', true)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-student {
  height: 600px;
  .student-box {
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
