<template>
  <Modal :title="title" ref="modal" @ok="submitOk">
    <div class="select-user-content">
      <div>
        <span>选择</span>
        <div class="dc-left">
          <a-input-search placeholder="请输入" @search="search" />
          <div class="dc-left-bd">
            <a-checkbox
              v-if="userList.length>0"
              @change="onCheckAllChange"
              style="display:block; padding-bottom: 3px;"
              :checked="checkAll">所有检查项</a-checkbox>
            <a-checkbox-group v-model="selectedList" @change="groupChange">
              <a-checkbox class="userList" v-for="item in userList" :value="item.index" :key="item.id">{{ item.name }}
              </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
      <div>
        <span>我的选择</span>
        <div class="dc-right">
          <ul v-for="(item, index) in userListRight" :key="item.id">
            <li class="dc-right-li">
              <span>{{ item.name }}</span>
              <a-icon type="delete" @click="deleteLi(index)" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import Modal from './Modal'
export default {
  name: 'ChooseUser',
  components: {
    Modal
  },
  props: {
    userData: {
      default: () => {
        return [
          // {
          //   id: '1',
          //   index: 0,
          //   name: 'sdhjfb'
          // }
        ]
      },
      type: Array
    },
    selectedLeft: {
      default: () => {
        return []
      },
      type: Array
    },
    ranname: {
      type: String,
      default: 'name'
    },
    title: {
      type: String,
      default: ''
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
      data: [],
      userList: [],
      checkAll: false,
      oldSelected: [], // 老的选中列表
      userListRight: [], // 右侧列表
      confirmLoading: false
    }
  },
  created() {
    this.userList = this.addIndex(this.userData)
    this.data = JSON.parse(JSON.stringify(this.userList))
    this.selectedList = this.selectedLeft
    if (this.selectedList.length !== 0) this.groupChange(JSON.parse(JSON.stringify(this.selectedList)))
  },
  async mounted() {
  },
  methods: {
    addIndex(data) {
      return data.map((res, index) => {
        return {
          ...res,
          index: index
        }
      })
    },
    submitOk() {
      if (this.userListRight.length === 0) {
        this.$message.warning('请选择人员')
        return
      }
      this.$refs.modal.visible = false
      this.$emit('submit', this.userListRight)
      // this.userListRight = []
      // this.selectedList = []
    },
    // 全选
    onCheckAllChange(e) {
      this.checkAll = e.target.checked
      if (this.checkAll) {
        this.userList.forEach(item => {
          // 查找当前选中的是否已经包含
          const n = this.selectedList.findIndex(t => t == item.index)
          // 未包含则添加进去
          if (n === -1) {
            this.selectedList.push(item.index)
            this.userListRight.unshift(this.data[item.index])
          }
        })
      } else {
        this.userList.forEach(item => {
          // 循环遍历-找到元素位置，进行删除
          const index = this.userListRight.findIndex(i => i.index === item.index)
          this.userListRight.splice(index, 1)
          const index2 = this.selectedList.findIndex(i => i.index === item)
          this.selectedList.splice(index2, 1)
        })
      }
      this.oldSelected = this.selectedList
    },
    // 复选框选择
    groupChange(selected) {
      // 每次选中传递的都是当前选中项的已经添加的索引值
      const length = selected.length
      const oldLength = this.oldSelected.length
      const minus = length - oldLength
      if (minus > 0) {
        // 说明增加
        for (let i = 1; i <= minus; i++) {
          this.userListRight.unshift(this.data[selected[length - i]])
        }
        this.oldSelected = selected
        // 判断左侧列表是否全部包含以选中
        this.checkAll = this.userList.every(item => this.selectedList.indexOf(item.index) !== -1)
      } else {
        // 说明减少-先取消全选状态
        this.checkAll = false
        // 遍历删除元素
        this.oldSelected.forEach(item => {
          // 循环遍历，依次找到减少的项，在进行删除
          if (selected.indexOf(item) === -1) {
            // 找到对应的索引值
            const index = this.userListRight.findIndex(i => i.index === item)
            this.userListRight.splice(index, 1)
          }
        })
        this.oldSelected = selected
      }
    },
    // 输入框搜索
    search(value) {
      if (!value || !value.trim()) {
        this.userList = JSON.parse(JSON.stringify(this.data))
        // 判断是否全部选中
        this.checkAll = this.selectedList.length === this.userList.length
      }
      const v = value.trim()
      this.userList = this.data.filter(item => item.name.indexOf(v) !== -1)
      // 判断左侧列表是否全部包含以选中
      this.checkAll = this.userList.length ? this.userList.every(item => this.selectedList.indexOf(item.index) !== -1) : false
    },
    // 已选列表删除 当前项在总列表的索引，当前项的索引
    deleteLi(index) {
      // 由于已选列表的排序刚好与选中列表的排序相反，所以可以直接删除
      const length = this.selectedList.length
      this.selectedList.splice(length - index - 1, 1)
      this.userListRight.splice(index, 1)
      // 判断左侧列表是否全部包含以选中
      this.checkAll = this.userList.length ? this.userList.every(item => this.selectedList.indexOf(item.index) !== -1) : false
    },
    // 获取最终选择的用户ID
    getid() {
      if (this.userListRight.length === 0) {
        return ['', this.selectedList]
      } else {
        const arr = []
        this.userListRight.forEach(item => arr.push(item.id))
        return [arr.join(','), this.selectedList]
      }
    }
  },
  watch: {
    userData(val) {
      this.userList = this.addIndex(val)
      this.data = this.addIndex(val)
    }
  }
}
</script>

<style lang="less" scoped>
.select-user-content {
  display: flex;
  justify-content: space-between;
  // height: calc(~"100% - 52px");

  > div {
    width: 47%;
  }
  .dc-left,
  .dc-right {
    margin-top: 10px;
    overflow: auto;
    border: 1px solid #efeef0;
    border-radius: 5px;
    padding: 15px;
    box-sizing: content-box;
    height: calc(~"100% - 60px");
  }
  .dc-left-bd {
    margin-top: 10px;
    height: calc(~"100% - 42px");
    overflow-y: auto;
    .userList {
      display: block;
      margin-left: 16px;
      margin-bottom: 3px;

      /deep/ span {
        word-break: break-all;
      }
    }
  }
  .dc-right {
    overflow-y: auto;

    .dc-right-li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;

      .anticon-delete {
        cursor: pointer;
      }
    }
  }
}
</style>
