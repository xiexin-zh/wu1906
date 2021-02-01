<template>
  <a-modal
    width="1200px"
    :title="title + '（已选房间' + roomNames + '，最大选择人数' + sumNum + '人）'"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <u-search-form class="u-mar-b10" :search-label="studentSearchLabel" @search="searchForm"></u-search-form>
    <div class="choose-student u-fx">
      <u-class-tree isOnlyNewSchoolYear showAllTag :school="schoolCode" @select="selectTree"></u-class-tree>
      <div class="u-fx-ver u-fx-f1">
        <u-table
          :is-check="isCheck"
          pagination
          :is-radio="isRadio"
          :scrollH="500"
          is-zoom
          v-model="chooseList"
          :columns="studentColumns"
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
      </div>
      <div class="student-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="u-fx-jsb u-fx-ac">
              <span>{{ item.userName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { studentColumns } from '../table-columns/unDormStudents'
import { studentSearchLabel } from '../search-columns/searchUnDormStudents'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ChooseUnDormStudent',
  components: {},
  props: {
    // 允许选择空数据
    allowEmpty: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '批量分配'
    },
    // 已选房间列表
    chooseRoomList: {
      type: Array,
      default: () => {
        return []
      }
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
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
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
      studentColumns,
      studentSearchLabel,
      selectObj: {},
      studentList: [],
      totalList: [],
      pageList: {
        page: 1,
        size: -1
      },
      roomNames: '',
      sumNum: 0
    }
  },
  async mounted() {
    console.log(this.chooseRoomList)
    this.roomNames = this.chooseRoomList.map((ele) => ele.roomName).join('、')
    this.chooseRoomList.forEach((ele) => {
      this.sumNum += ele.emptyNum
    })
    console.log(this.roomNames)
    console.log(this.sumNum)
  },
  methods: {
    ...mapActions('home', ['getClassStudents', 'queryUserArchives']),
    async getstudentList() {
      const params = {
        ...this.pageList,
        schoolCode: this.schoolCode,
        ...this.selectObj,
        ...this.searchObj
      }
      const res = await this.getClassStudents({
        ...params,
        hasDorm: true,
        hasClass: true
      })
      const archivesRes = await this.queryUserArchives(params)
      this.studentList = this.filterData(res.data.records, archivesRes.data.records)
      console.log(this.studentList)
    },
    // 过滤重复数据
    filterData(oldArr, newArr) {
      return oldArr.filter((item) => {
        return JSON.stringify(newArr).indexOf(item.userCode) === -1
      })
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
      this.selectObj = item
      this.getstudentList()
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.id === item.id
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
        const index = this.totalList.findIndex((list) => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && !this.allowEmpty) {
        this.$message.warning(`请选择学生`)
        return
      }
      if (this.totalList.length > this.sumNum) {
        this.$message.warning(`超过最大选择人数，请重新选择`)
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
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
