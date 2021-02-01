<template>
  <div class="u-fx-f1" id="tableList" style="width: 100%">
    <a-table
      style="background-color: #fff;"
      :scroll="{y: setScroll('tableList')}"
      :rowKey="(record) => record.id"
      :pagination="false"
      :columns="columns"
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
    this.getMenuList()
  },
  methods: {
    /**
     * @description 菜单列表展示
     * @params { menuType: '类型' }, { parentId: '父级id' }
     */
    ...mapActions('home', ['getLevelList', 'getLevelMenuList']),
    async getMenuList() {
      console.log(0)
      const res = await this.getLevelList({
        menuCategory: this.category,
        plateFormType: this.plateformType
      })
      this.menuList = res.data.map(item => {
        return {
          ...item,
          children: item.childList
        }
      })
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
    },
    // 设置table滚动高度
    setScroll(id) {
      if (document.getElementById(id)) {
        return document.getElementById(id).offsetHeight - 40
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-checkbox-inner {
  background-color: #6882da;
}
</style>
