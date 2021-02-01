<template>
  <div class="drawer-content u-fx-ver">
    <u-tabs
      :tabList="appList"
      :value="value"
      @change="changeMenu"
    ></u-tabs>
    <div class="menu-top u-fx mar-b10">
      <a-input-search
        v-model="searchValue"
        placeholder="请输入权限名称"
        style="width: 260px"
        @search="onSearch"
      />
    </div>
    <div class="menu-content">
      <a-tree
        checkable
        v-if="showTag"
        v-model="checkedKeys"
        :treeData="treeData"
        :selectedKeys="selectedKeys"
        :expandedKeys="expandedKeys"
        @expand="onExpand"
        :autoExpandParent="autoExpandParent"
        @select="onSelect"
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
              <span style="color: #e81515">{{ searchValue }}</span>
              {{
                item.title.substr(
                  item.title.indexOf(searchValue) + searchValue.length
                )
              }}
            </span>
            <span v-else>{{ item.title }}</span>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleTree',
  props: {
    plateformType: {
      type: String,
      default: '',
      required: true
    },
    appList: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      showTag: false,
      checkedKeys: [],
      menuList: [],
      treeData: [],
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent: false,
      searchValue: '',
      menuData: {}
    }
  },
  methods: {
    // 切换tab
    changeMenu() {},
    // 搜索
    onSearch() {},
    onExpand() {},
    onSelect() {},
    onCheck() {}
  }
}
</script>

<style lang="less" scoped>
/deep/ .drawer-content {
  height: 100%;
  overflow: hidden;
}
/deep/ .menu-content {
  flex: 1;
  overflow-y: auto;
}
</style>
