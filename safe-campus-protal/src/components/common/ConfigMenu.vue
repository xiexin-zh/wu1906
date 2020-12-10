<template>
  <div class="qui-fx-f1" id="tableList" style="width: 100%">
    <a-table
      style="background-color: #fff;"
      :scroll="{ y: this.$tools.setScroll('tableList') }"
      :rowKey="record => record.id"
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
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName'
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
    platType: {
      type: Number,
      default: 0
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
    this.plateformType = this.$route.query.plateformType
    this.getMenuList(1, '')
  },
  methods: {
    /**
     * @description 菜单列表展示
     * @params { menuType: '类型' }, { parentId: '父级id' }
     */
    async getMenuList(menuType, parentId) {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10060}/menu/manage/node/list`,
        params: {
          menuType,
          parentId,
          isPlatform: this.platType,
          plateformType: this.plateformType
        }
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
    expandTree(expanded, record) {
      if (expanded) this.getMenuList(2, record.id)
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
