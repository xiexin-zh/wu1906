<template>
  <div class="place-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      v-if="treeData.length > 0"
      :style="{ maxHeight: maxHeight + 'px' }"
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
    ></a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'PlaceTree',
  props: {
    isChoose: {
      type: Boolean,
      default: true
    },
    school: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noData: false,
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: [],
      defaultSelectedKeys: [],
      maxHeight: 0
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['userInfo', 'schoolCode'])
  },
  mounted() {
    this.maxHeight = window.screen.height - 280
    this.initMenu()
  },
  methods: {
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      if (tree.selectedNodes.length === 0) return
      this.$emit('select', tree)
    },
    async initMenu() {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_10050}/place/manage/getFirstStagePlaceList`,
        params: req
      })
      if (res.data === null || res.data.length === 0) {
        this.noData = true
        return
      } else {
        this.noData = false
      }
      this.treeData = res.data.map(item => {
        return {
          parentId: item.parentId || '',
          title: item.name,
          code: item.id,
          key: item.id
        }
      })
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode,
          parentId: treeNode.dataRef.code
        }
        $ajax
          .post({
            url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.list.map(item => {
              return {
                parentId: item.parentId,
                title: item.name + '楼',
                code: item.id,
                key: item.id,
                isLeaf: item.type === '2'
              }
            })
            this.treeData = [...this.treeData]
            resolve()
          })
      })
    }
  }
}
</script>

<style lang="less" scoed>
.place-tree {
  min-height: 400px;
  overflow-y: auto;
}
</style>
