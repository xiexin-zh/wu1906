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
    <div class="choose-dorm u-fx">
      <u-dorm-tree
        isChoose
        isAutoShowFloor
        :school="schoolCode"
        @select="selectTree"
      ></u-dorm-tree>
      <div class="u-fx-ver u-fx-f1">
        <u-table
          :scroll-h="500"
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="dormList"
        ></u-table>
      </div>
      <div class="dorm-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="u-fx-jsb u-fx-ac">
              <span>{{ item.buildingName }}{{ item.floorName }}{{ item.roomName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '楼栋',
    dataIndex: 'buildingName',
    width: '30%'
  },
  {
    title: '楼层',
    dataIndex: 'floorName',
    width: '20%'
  },
  {
    title: '房间',
    dataIndex: 'roomName',
    width: '20%'
  }
]
export default {
  name: 'ChooseDorm',
  components: {},
  props: {
    // 学校编码
    schoolCode: {
      type: String,
      default: ''
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
      default: '选择宿舍'
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
      columns,
      dormList: [],
      totalList: [],
      oldTotalList: []
    }
  },
  async mounted() {
    console.log(this.bindList)
    this.chooseList = this.bindList.map(el => el.id)
    this.totalList = this.bindList
    if (this.updateType) this.oldTotalList = JSON.parse(JSON.stringify(this.totalList))
    this.getdormList()
  },
  methods: {
    async getdormList() {
      const res = await $ajax.postForm({
        url: `/ljj_dorm/dorm/building/hierarchy/child/node`,
        params: {
          schoolCode: this.schoolCode,
          pCode: this.chooseItem.floorCode
        }
      })
      if (!res.data) {
        return
      }
      this.dormList = res.data.map(item => {
        return {
          ...item,
          ...this.chooseItem,
          roomName: item.categoryName,
          roomCode: item.categoryCode
        }
      })
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
      if (item.categoryType === '2') {
        this.$message.warning('请选择楼层进行查询')
        return
      }
      this.chooseItem = {
        buildingCode: item.pCode,
        buildingName: item.pTitle,
        floorCode: item.code,
        floorName: item.title
      }
      this.getdormList()
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
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
        const index = this.totalList.findIndex(list => list.id === item.id)
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
        const delclassList = this.oldTotalList.filter(item => {
          return JSON.stringify(this.totalList).indexOf(item.id) === -1
        })
        const addclassList = this.totalList.filter(item => {
          return JSON.stringify(this.oldTotalList).indexOf(item.id) === -1
        })
        this.$emit('submit', { delclassList, addclassList })
      } else {
        this.$emit('submit', this.totalList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-dorm {
  height: 600px;
  .dorm-box {
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
