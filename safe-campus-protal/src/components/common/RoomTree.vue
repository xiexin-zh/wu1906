<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{ rows: 10 }" />
    <no-data v-if="noData" msg="暂无数据~"></no-data>
    <a-tree
      showLine
      :style="{ maxHeight: maxHeight + 'px' }"
      v-if="treeData.length > 0"
      @select="select"
      :loadData="onLoadData"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
      :defaultExpandedKeys="defaultExpandedKeys"
    >
    </a-tree>
  </div>
</template>

<script>
import NoData from './NoData'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
export default {
  name: 'GradeTree',
  props: {
    isChoose: {
      type: Boolean,
      default: false
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
      bulidingList: [],
      floorList: [],
      roomList: [],
      defaultSelectedKeys: [],
      defaultExpandedKeys: [],
      maxHeight: 0
    }
  },
  components: {
    NoData
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.maxHeight = window.screen.height - 340
    this.initMenu()
  },
  methods: {
    onExpand() {},
    // 点击节点
    select(obj, tree) {
      // console.log(tree.selectedNodes)
      if (tree.selectedNodes.length === 0) return
      const selectObj = {
        title: tree.selectedNodes[0].data.props.title,
        key: tree.selectedNodes[0].data.key,
        type: tree.selectedNodes[0].data.props.type
      }
      this.$emit('select', selectObj)
    },
    async initMenu() {
      const req = {
        schoolCode: this.schoolCode,
        category: '100'
      }
      $ajax
        .get({
          url: `${hostEnv.protal_api_10050}/place/manage/getFirstStagePlaceList`,
          params: req
        })
        .then(res => {
          if (res.data === null || res.data.length === 0) {
            this.noData = true
            return
          } else {
            this.noData = false
          }
          this.bulidingList = res.data
          $ajax
            .post({
              url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
              params: {
                schoolCode: this.schoolCode,
                parentId: this.bulidingList[0].id
              }
            })
            .then(res => {
              if (res.data.list.length === 0 || res.data === null) {
                this.treeData = this.bulidingList.map(item => {
                  return {
                    title: item.name,
                    key: item.id
                  }
                })
                return
              }
              this.floorList = res.data.list
              $ajax
                .post({
                  url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
                  params: {
                    schoolCode: this.schoolCode,
                    parentId: this.floorList[0].id
                  }
                })
                .then(res => {
                  if (res.data.list.length === 0 || res.data === null) {
                    this.treeData = this.bulidingList.map(item => {
                      return {
                        title: item.name,
                        key: item.id
                      }
                    })
                    return
                  }
                  this.roomList = res.data.list
                  const selectObj = {
                    title: this.bulidingList[0].name + '-' + this.floorList[0].name + '-' + this.roomList[0].name,
                    key: this.roomList[0].id,
                    type: this.roomList[0].type
                  }
                  this.defaultExpandedKeys = [this.bulidingList[0].id, this.floorList[0].id]
                  this.defaultSelectedKeys = [this.roomList[0].id]
                  this.treeData = this.bulidingList.map(item => {
                    return {
                      title: item.name,
                      key: item.id,
                      type: item.type
                    }
                  })
                  this.treeData[0].children = this.floorList.map(elem => {
                    return {
                      title: elem.type === '2' ? elem.name + '楼' : elem.name,
                      key: elem.id,
                      type: elem.type,
                      pId: elem.parentId
                    }
                  })
                  this.$emit('select', selectObj)
                })
            })
        })
    },
    async onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        const req = {
          schoolCode: this.schoolCode,
          parentId: treeNode.dataRef.key
        }
        $ajax
          .post({
            url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
            params: req
          })
          .then(res => {
            treeNode.dataRef.children = res.data.list.map(item => {
              return {
                key: item.id,
                title: item.type === '2' ? item.name + '楼' : item.name,
                isLeaf: item.type === '3',
                type: item.type,
                pId: item.parentId
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
.grade-tree {
  min-height: 600px;
  overflow-y: auto;
}
</style>
