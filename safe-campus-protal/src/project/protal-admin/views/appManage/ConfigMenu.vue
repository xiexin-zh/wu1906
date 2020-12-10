<template>
  <div class="qui-fx-f1" id="tableList" style="width: 100%">
    <a-table
      style="background-color: #fff;"
      :scroll="{y: this.$tools.setScroll('tableList')}"
      :rowKey="(record) => record.id"
      :pagination="false"
      :columns="columns"
      @expand="expandTree"
      :dataSource="menuList"
    >
      <template slot="actions" slot-scope="record">
        <a-checkbox
          :checked="chooseValue.some(item => record.id === item.id)"
          v-if="!record.children"
          @change="onChange($event, record)"
        ></a-checkbox>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '30%'
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: { customRender: 'actions' }
  }
]
export default {
  name: 'ConfigMenu',
  props: {
    plateformType: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    chooseValue: {
      get() {
        return this.value
      },
      set(nVal) {
        this.$emit('input', nVal)
      }
    }
  },
  components: {},
  data() {
    return {
      menuList: [],
      columns
    }
  },
  mounted() {
    this.getMenuList(1, '')
  },
  methods: {
    /**
     * @description 菜单列表展示
     * @params { menuType: '类型' }, { parentId: '父级id' }
     */
    ...mapActions('home', ['getLevelList', 'getLevelMenuList']),
    async getMenuList(menuType, parentId) {
      const res = await this.getLevelList({
        category: this.category,
        plateFormType: this.plateformType
      })
      if (menuType === 1) {
        this.menuList = res.data.map(item => {
          return {
            ...item,
            children: []
          }
        })
      } else {
        this.menuList.find(item => {
          return item.id === parentId
        }).children = res.data
      }
    },
    /**
     * @description 点击展开图标
     */
    async expandTree(expanded, record) {
      if (expanded) {
        const res = await this.getLevelMenuList({
          page: 1,
          size: 50,
          parentId: record.id
        })
        this.menuList.find(item => {
          return item.id === record.id
        }).children = res.data.list
      }
    },
    onChange(event, record) {
      const isChoose = event.target.checked
      if (isChoose) {
        this.chooseValue.push({
          id: record.id,
          name: record.menuName
        })
      } else {
        this.chooseValue = this.chooseValue.filter(item => {
          return item.id !== record.id
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-checkbox-inner {
  background-color: @main-color;
}
</style>
