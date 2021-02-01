<template>
  <u-drawer
    @confirm="confirmRole"
    :is-confirm="true"
    :width="600"
    title="分配权限"
    v-model="status"
    ref="uDrawer"
  >
    <div class="u-fx-ver">
      <u-tabs @change="changeMenu" v-model="plateformType" :tab-list="tabList">
        <u-space>
          <div class="menu-top u-fx mar-b10">
            <a-input-search
              v-model="searchValue"
              placeholder="请输入权限名称"
              style="width: 260px"
              @search="onSearch"
            />
          </div>
        </u-space>
      </u-tabs>
      <div class="menu-content">
        <u-empty v-if="noData" description="什么也没有~"></u-empty>
        <a-tree
          checkable
          v-if="showTag"
          v-model="checkedKeys"
          :treeData="treeData"
          :selectedKeys="selectedKeys"
          :expandedKeys="expandedKeys"
          @expand="onExpand"
          :autoExpandParent="autoExpandParent"
          @check="onCheck"
        >
          <template slot="title" slot-scope="item">
            <div class="custom u-fx-ac">
              <img
                v-if="item.icon"
                :style="{ width: '18px', height: '18px', marginRight: '5px' }"
                :src="item.icon"
                alt
              />
              <span v-if="item.title.indexOf(searchValue) > -1">
                {{ item.title.substr(0, item.title.indexOf(searchValue)) }}
                <span
                  style="color: #e81515"
                >{{ searchValue }}</span>
                {{ item.title.substr(item.title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ item.title }}</span>
            </div>
          </template>
        </a-tree>
      </div>
    </div>
  </u-drawer>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'AccordPower',
  components: {},
  props: {
    // 学校编码
    schoolCode: {
      type: String,
      required: true
    },
    // 应用分类编码(1-校端 2-局端 3-运营端 4-教职工 5-家长)
    appCategoryCode: {
      type: String,
      required: true
    },
    // 角色id
    roleId: {
      type: [String, Number],
      required: true
    },
    // 是否显示抽屉
    value: {
      type: Boolean,
      default: false
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
      tabList: [
        {
          key: '1',
          title: 'pc端模块'
        },
        {
          key: '3',
          title: '移动端模块'
        }
      ],
      showTag: false,
      noData: false,
      checkedKeys: [],
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
      check: [],
      autoExpandParent: false,
      searchValue: '',
      roleMenuDtoList: [],
      plateformType: '1' //	终端类型（1-pc端，2-小程序端，3-公众号端）
    }
  },
  created() {
    this.initMenu()
  },
  methods: {
    async initMenu() {
      const req = {
        schoolCode: this.schoolCode,
        plateformType: this.plateformType,
        appCategoryCode: this.appCategoryCode
      }
      const res = await $ajax.post({
        url: `/protal_v3_11101/canpointApp/getAppBySchool`,
        params: req
      })
      const data = res.data
      if (data === null || data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.treeData = data.map(item => {
        return {
          key: `#-${item.id}`,
          id: item.id,
          title: item.appName,
          plateformType: item.plateformType,
          appCode: item.appCode,
          appCategoryCode: item.appCategoryCode,
          children: []
        }
      })
      this.treeData.forEach(ele => {
        const req = {
          appCode: ele.appCode,
          plateformType: ele.plateformType,
          menuCategory: ele.appCategoryCode
        }
        $ajax
          .post({
            url: `/protal_v3_11101/canpointMenu/getAppMenuTree`,
            params: req
          })
          .then(res => {
            ele.children = res.data
            ele.children = ele.children.map(item => {
              item.appId = ele.id
              return this.addValue(item)
            })
          })
      })
      this.treeData = [...this.treeData]
      this.showTag = true
      this.getRoleMenu()
    },
    addValue(item) {
      return {
        key: item.appId + '-' + item.id,
        plateformType: item.plateformType,
        title: item.menuName,
        children: item.childList
          ? item.childList.map(itemes => {
              itemes.appId = item.appId
              return this.addValue(itemes)
            })
          : ''
      }
    },
    // 权限树获取、操作
    changeMenu(index) {
      this.showTag = false
      this.plateformType = index
      this.checkedKeys = []
      this.finalCheck = []
      this.initMenu()
    },
    onCheck(checkedKeys, e) {
      this.check = []
      e.halfCheckedKeys.forEach(el => {
        if (el.split('-')[0] !== '#') {
          this.check.push(el)
        }
      })
      this.checkedKeys = checkedKeys
      const data1 = []
      this.checkedKeys.forEach(ele => {
        if (ele.split('-')[0] !== '#' && ele.split('-')[0] !== ele.split('-')[1]) {
          data1.push({
            appId: ele.split('-')[0],
            menuId: ele.split('-')[1],
            checkState: true
          })
        }
      })
      const data2 = []
        this.check.map(ele => {
        if (ele.split('-')[0] !== '#' && ele.split('-')[0] !== ele.split('-')[1]) {
          data2.push({
            appId: ele.split('-')[0],
            menuId: ele.split('-')[1],
            checkState: false
          })
        }
      })
      this.roleMenuDtoList = data1.concat(data2)
    },
    getkeyList(value, tree, keyList) {
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.title.indexOf(value) > -1) {
          keyList.push(node.key)
        }
        // 如果拥有孩子继续遍历
        if (node.children) {
          this.getkeyList(value, node.children, keyList)
        }
      }
      return keyList
    },
    // 该递归主要用于获取key的父亲节点的key值
    getParentKey(key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    // 获取该节点的所有父亲节点
    getAllParentKey(key, tree) {
      var parentKey
      if (key) {
        parentKey = this.getParentKey(key, tree)
        if (parentKey) {
          // 如果父亲节点存在，判断是否已经存在于展开列表里，不存在就进行push
          if (!this.backupsExpandedKeys.some(item => item === parentKey)) {
            this.backupsExpandedKeys.push(parentKey)
          }
          // 一层一层进行获取
          this.getAllParentKey(parentKey, tree)
        }
      }
    },
    onExpand(expandedKeys) {
      // 用户点击展开时，取消自动展开效果
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSearch() {
      var vm = this
      if (vm.searchValue === '') {
        vm.expandedKeys = []
      } else {
        vm.expandedKeys = []
        vm.backupsExpandedKeys = []
        const candidateKeysList = vm.getkeyList(vm.searchValue, vm.treeData, [])
        candidateKeysList.map(item => {
          var key = vm.getParentKey(item, vm.treeData)
          if (key && !vm.backupsExpandedKeys.some(item => item === key)) {
            vm.backupsExpandedKeys.push(key)
          }
        })
        const length = this.backupsExpandedKeys.length
        for (let i = 0; i < length; i++) {
          vm.getAllParentKey(vm.backupsExpandedKeys[i], vm.treeData)
        }
        vm.expandedKeys = vm.backupsExpandedKeys.slice()
      }
    },
    async getRoleMenu() {
      const req = {
        roleId: this.roleId
      }
      const res = await $ajax.postForm({
        url: `/protal_v3_11101/canpointRoleMenu/list`,
        params: req
      })
      if (res.data.length > 0) {
        this.checkedKeys = []
        const data = res.data
        this.roleMenuDtoList = data
        data.forEach(element => {
          if (!element.checkState) return
          this.checkedKeys.push(`${element.appId}-${element.menuId}`)
        })
      }
    },
    async confirmRole() {
      try {
        if (this.checkedKeys.length === 0) {
          this.$message.warning('请选择菜单')
          this.$refs.uDrawer.reset()
          return
        }
        const req = {
          roleId: this.roleId,
          roleMenuDtoList: this.roleMenuDtoList
        }
        await $ajax.post({
          url: `/protal_v3_11101/canpointRoleMenu/save/and/update`,
          params: req
        })
        this.$message.success('设置成功')
        this.$tools.goNext(() => {
          this.visible = false
          this.$emit('input', false)
        })
      } catch (err) {
        this.$refs.uDrawer.reset()
        this.$message.error('设置失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
