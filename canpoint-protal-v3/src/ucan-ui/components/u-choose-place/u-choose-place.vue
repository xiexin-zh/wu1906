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
    <div class="choose-place u-fx">
      <u-place-tree isChoose :isSelect="true" :school="schoolCode" @select="selectTree"></u-place-tree>
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
          :table-list="placeList"
        ></u-table>
      </div>
      <div class="class-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.roomCode" class="u-fx-jsb u-fx-ac">
              <div>{{ item.placeName }}{{ item.floorName }}{{ item.roomName }}</div>
              <a-tag @click="delUser(item.roomCode, index)" color="#f50">删除</a-tag>
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
    dataIndex: 'placeName',
    width: '25%'
  },
  {
    title: '楼层',
    dataIndex: 'floorName',
    width: '25%'
  },
  {
    title: '房间',
    dataIndex: 'roomName',
    width: '25%'
  }
]
export default {
  name: 'ChoosePlace',
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
      default: '选择场地'
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
      placeList: [],
      totalList: [],
      oldTotalList: []
    }
  },
  async mounted() {
    console.log(this.bindList)
    this.chooseList = this.bindList.map(el => el.roomCode)
    this.totalList = this.bindList.map(el => {
      return {
        ...el,
        id: el.roomCode
      }
    })
    if (this.updateType) { this.oldTotalList = JSON.parse(JSON.stringify(this.totalList)) }
  },
  methods: {
    async getplaceList() {
      const params = {
        schoolCode: this.schoolCode,
        floorCode: this.floorCode
      }
      const res = await $ajax.get({
        url: `/protal_v3_11101/canpointPlace/query/rooms`,
        params: params
      })
      this.placeList = res.data.map(item => {
        return {
          id: item.placeCode,
          ...this.chooseItem,
          roomId: item.id,
          roomName: item.placeName,
          roomCode: item.placeCode
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
      this.chooseItem = {
        placeCode: item.parentId,
        placeName: item.parentName,
        floorCode: item.key,
        floorName: item.title
      }
      if (!item.parentId) {
        this.$message.warning('请选择楼层进行查询')
        return
      }
      this.floorCode = item.code
      this.getplaceList()
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.roomCode === item.roomCode
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
        const index = this.totalList.findIndex(list => list.roomCode === item.roomCode)
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
        const delplaceList = this.oldTotalList.filter(item => {
          return JSON.stringify(this.totalList).indexOf(item.id) === -1
        })
        const addplaceList = this.totalList.filter(item => {
          return JSON.stringify(this.oldTotalList).indexOf(item.id) === -1
        })
        this.$emit('submit', { delplaceList, addplaceList })
      } else {
        this.$emit('submit', this.totalList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-place {
  height: 600px;
  .class-box {
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
