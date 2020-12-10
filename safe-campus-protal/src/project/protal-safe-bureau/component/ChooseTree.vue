<template>
  <Modal :title="title" ref="modal" @ok="submitOk">
    <div class="select-user-content">
      <div>
        <span>选择</span>
        <div class="dc-left">
          <a-input-search v-model="searchStr" style="margin-bottom: 8px" placeholder="Search" @change="onSearch" />
          <a-tree
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="treeData"
            v-model="selectKey"
            :selectedKeys="selectKey"
            @expand="onExpand"
            :defaultExpandAll="true"
            @check="jiantingcheck"
          >
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </div>
      </div>
      <div>
        <span>我的选择</span>
        <div class="dc-right">
          <ul v-for="(item, index) in selectObj" :key="index">
            <li class="dc-right-li" >
              <span>{{ item.title }}</span>
              <a-icon type="delete" @click="deleteLi(item.key)" />
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
        return []
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
      backupsExpandedKeys: [],
      autoExpandParent: false,
      selectedKeys: [],
      searchValue: '',
      searchStr: '',
      expandedKeys: [], // 展开指定的树节点
      treeData: [],
      selectKey: [], // 选中的节点的key
      selectObj: [] // 选中的节点
    }
  },
  created() {
    // this.treeData = this.initData(this.userData)
  },
  async mounted() {
  },
  watch: {
    userData() {
      this.treeData = this.initData(this.userData)
    }
  },
  methods: {
    initData(arr, parentId, parentName) {
      arr.forEach(i => {
        i.scopedSlots = {
          title: 'title'
        }
        if (i.children && i.children.length > 0) {
          this.initData(i.children, i.key, i.title)
        }
      })
      return arr
    },
    // 找到选中的对象
    jiantingcheck(checkdkeys, e) {
      const arr = []
      e.checkedNodes.forEach(i => {
        arr.push(i.data.props.dataRef)
      })
      this.selectObj = arr.filter(v => v.leve == '2') // 只要选择的子
    },
    onSearch() {
      // console.log(this.treeData)
      var vm = this
      // 添加这行代码是为了只点击搜索才触发
      vm.searchValue = vm.searchStr
      // 如果搜索值为空，则不展开任何项，expandedKeys置为空
      // 如果搜索值不位空，则expandedKeys的值要为搜索值的父亲及其所有祖先
      if (vm.searchValue === '') {
        vm.expandedKeys = []
      } else {
        // 首先将展开项与展开项副本置为空
        vm.expandedKeys = []
        vm.backupsExpandedKeys = []
        // 获取所有存在searchValue的节点
        const candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, [])
        // 遍历满足条件的所有节点
        candidateKeysList.map(item => {
          // 获取每个节点的母亲节点
          var key = vm.getParentKey(item, vm.treeData)
          // 当item是最高一级，父key为undefined，将不放入到数组中
          // 如果母亲已存在于数组中，也不放入到数组中
          if (key && !vm.backupsExpandedKeys.some(item => item === key)) vm.backupsExpandedKeys.push(key)
        })
        const length = this.backupsExpandedKeys.length
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData)
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice()
      }
    },
    // 获取节点中含有value的所有key集合
    getkeyList(value, tree, keyList) {
      // 遍历所有同一级的树
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        // 如果该节点存在value值则push
        if (node.title.indexOf(value) > -1) {
          keyList.push(node.key)
        }
        // 如果拥有孩子继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList)
        }
      }
      // 因为是引用类型，所有每次递归操作的都是同一个数组
      return keyList
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey(key, tree) {
      let parentKey, temp
      // 遍历同级节点
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          // 如果该节点的孩子中存在该key值，则该节点就是我们要找的父亲节点
          // 如果不存在，继续遍历其子节点
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if ((temp = this.getParentKey(key, node.children))) {
            // parentKey = this.getParentKey(key,node.children)
            // 改进，避免二次遍历
            parentKey = temp
          }
        }
      }
      return parentKey
    },
    // 获取该节点的所有祖先节点
    getAllParentKey(key, tree) {
      var parentKey
      if (key) {
        // 获得父亲节点
        parentKey = this.getParentKey(key, tree)
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some(item => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey)
          }
          // 继续向上查找祖先节点
          this.getAllParentKey(parentKey, tree)
        }
      }
    },
    onExpand(expandedKeys) {
      // 用户点击展开时，取消自动展开效果
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 右边删除
    deleteLi(key) {
      this.selectObj = this.selectObj.filter(v => v.key !== key)
      this.selectKey = this.selectObj.map(v => v.key)
    },
    submitOk() {
      this.$refs.modal.visible = false
      this.$emit('submit', this.selectObj)
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
