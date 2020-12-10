<template>
  <div class="grade-tree">
    <a-skeleton v-if="treeData.length == 0 && !noData" active :paragraph="{rows: 10}" />
    <a-tree
      v-if="treeData.length > 0"
      @select="select"
      :treeData="treeData"
      :defaultSelectedKeys="defaultSelectedKeys"
      :default-expanded-keys="autoExpandParent"
    >
    </a-tree>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
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
  data () {
    return {
      noData: false,
      treeData: [],
      gradeId: '',
      classId: '',
      gradeList: [],
      defaultSelectedKeys: [],
      isNewYear: true,
      autoExpandParent: ['aq']
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted () {
    this.initMenu()
  },
  methods: {
    ...mapActions('home',
      [
        'getFireArchive', 'getSafeArchive', 'getOtherArchive', 'getSchoolArchive'
      ]),
    onExpand () {},
    // 点击节点
    select (obj, tree) {
      this.$emit('select', obj[0])
    },
    async initMenu () {
      this.gradeList = [{
        title: '安全档案',
        code: 'aq',
        id: 'aq',
        children: [{
          title: '消防档案',
          code: 'xf',
          id: 'xf',
          children: [{
            title: '灭火器',
            code: 'mhq',
            id: 'mhq'
          }, {
            title: '灭火毯',
            code: 'mht',
            id: 'mht'
          }, {
            title: '消火栓',
            code: 'xhs',
            id: 'xhs'
          }, {
            title: '安全通道',
            code: 'aqtd',
            id: 'aqtd'
          }, {
            title: '其他消防设施',
            code: 'qt',
            id: 'qt'
          }]
        }, {
          title: '校车档案',
          code: 'xc',
          id: 'xc'
        }, {
          title: '器械档案',
          code: 'qx',
          id: 'qx'
        }]
      }]
      this.defaultSelectedKeys = [this.gradeList[0].code]
      this.treeData = this.newOrgData(this.gradeList)
    },
    // 深层递归
    newOrgData (data) {
      data.forEach(item => {
        item.children = item.children || null
        item.key = item.code
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        }
      })
      return data
    }
  }
}
</script>

<style lang="less" scoed>
  .grade-tree {
    min-height: 400px;
    max-height: 800px;
    overflow-y: auto
  }
</style>
