<template>
  <div class="org-tree">
    <div class="left-top" v-show="isTab">
      <a-radio-group v-model="currentIndex" style="margin-left: 6px">
        <a-radio-button
          style="width: 120px; height: 40px; line-height: 40px; text-align: center"
          :value="item.name"
          :key="index"
          v-for="(item, index) in tabList"
          >{{ item.title }}</a-radio-button
        >
      </a-radio-group>
    </div>
    <div class="left-tree" :style="{ paddingTop: isTab ? '0' : '10' + 'px' }">
      <div class="tree-parent" v-for="item in topTreeList" :key="item.id">
        <div class="tree-parent--header">
          <div class="tree-icon"></div>
          <span :class="['tree-title', { isActive: item.isActive }]" @click.stop="handleTitleClick(1, [item])">{{
            currentIndex == 0 ? item.value : item.stageName
          }}</span>
          <div :class="['tree-ops', { isExpand: item.expand }]" @click.stop="handleParentOps(item)"></div>
        </div>
        <div :class="['tree-sonWrap', { isExpand: item.expand }]">
          <div class="tree-son" v-for="elem in item.sonNodeList" :key="elem.id">
            <div class="tree-son--header">
              <div class="son-icon"></div>
              <span
                :class="['son-title', { isActive: elem.isActive }]"
                @click.stop="handleTitleClick(2, [elem, item])"
                >{{ currentIndex == 0 ? elem.value : elem.gradeName }}</span
              >
              <div :class="['son-ops', { isExpand: elem.expand }]" @click.stop="handleSonOps(elem)"></div>
            </div>
            <div :class="['tree-subsonWrap', { isExpand: elem.expand }]">
              <div class="tree-subson" v-for="el in elem.subSonList" :key="el.id">
                <div class="subson-icon"></div>
                <span
                  :class="['subson-title', { isActive: el.isActive }]"
                  @click.stop="handleTitleClick(3, [el, elem, item])"
                  >{{ currentIndex == 0 ? el.value : el.className }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  watch: {
    currentIndex: function(o, n) {
      // console.log('on', o, n)
      if (o !== n) {
        this.handleTabClick()
      }
    }
  },
  data() {
    return {
      currentIndex: this.currentTab,
      tabMenu: ['午休查寝', '晚间查寝'],
      tabList: [
        {
          name: 1,
          title: '学生'
        },
        {
          name: 0,
          title: '老师'
        }
      ],
      topTreeList: [],
      lastActive: {},
      currentSelectNodeTitle: '',
      treeForm: {
        levelCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: ''
      }
    }
  },
  props: {
    isTab: {
      type: Boolean,
      default: true
    },
    currentTab: {
      type: Number,
      default: 0
    },
    treeType: {
      type: Number,
      default: 0
    },
    isSelect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions('orgTree', [
      'getBuildNode',
      'getBuildChildNode',
      'getSchoolStage',
      'getStageGrade',
      'getGradeClass',
      'getSchoolRoot',
      'getTreeList',
      'getJobUser'
    ]),
    // 获取组织机构根节点
    getDormTreeList() {
      this.getSchoolRoot(sessionStorage.getItem('schoolScheme')).then(res => {
        const treeList = []
        treeList.push(res.data)
        this.topTreeList = treeList
        if (this.topTreeList.length > 0) {
          this.topTreeList.forEach(item => {
            this.$set(item, 'expand', false)
            this.$set(item, 'isActive', false)
            this.$set(item, 'sonNodeList', [])
          })
          if (this.isSelect) {
            this.handleTitleClick(1, [this.topTreeList[0]], 0)
          }
        }
      })
    },
    // 获取组织机构子节点
    getTreeNode(data, type) {
      const req = {
        isValid: true,
        pCode: data.code,
        schoolCode: sessionStorage.getItem('schoolScheme'),
        node: data.id
      }
      this.getTreeList(req).then(res => {
        if (type) {
          data.sonNodeList = res.data
          data.sonNodeList.forEach(item => {
            this.$set(item, 'expand', false)
            this.$set(item, 'isActive', false)
            this.$set(item, 'subSonList', [])
          })
        } else {
          data.subSonList = res.data
          data.subSonList.forEach(item => {
            this.$set(item, 'isActive', false)
          })
        }
      })
    },
    // 点击展开 获取二级节点
    handleParentOps(item) {
      item.expand = !item.expand
      if (this.currentIndex === 0) {
        this.getTreeNode(item, 1)
      } else if (this.currentIndex === 1 && item.sonNodeList.length === 0) {
        this.getSonNode(item)
      }
    },
    // 点击展开 获取三级节点
    handleSonOps(item) {
      item.expand = !item.expand
      if (this.currentIndex === 0 && item.subSonList.length === 0) {
        this.getTreeNode(item, 0)
      } else if (this.currentIndex === 1 && item.subSonList.length === 0) {
        this.getSubsonNode(item)
      }
    },
    resetForm: function() {
      this.treeForm.levelCode = ''
      this.treeForm.classCode = ''
      this.treeForm.gradeCode = ''
      this.treeForm.stageCode = ''
    },
    handleTitleClick(type, nodeList, treeType) {
      this.resetForm()
      var tag = ''
      if (type === 1) {
        // parent node
        if (this.currentIndex === 0) {
          tag = 0
          this.treeForm.levelCode = nodeList[0].levelCode
          this.currentSelectNodeTitle = nodeList[0].value
        } else {
          tag = 3
          this.treeForm.stageCode = nodeList[0].stageCode
          this.currentSelectNodeTitle = nodeList[0].stageName
        }
      } else if (type === 2) {
        // son node
        if (this.currentIndex === 0) {
          tag = 1
          this.treeForm.levelCode = nodeList[0].levelCode
          this.currentSelectNodeTitle = `${nodeList[1].value}${nodeList[0].value}`
        } else {
          tag = 4
          this.treeForm.gradeCode = nodeList[0].gradeId
          this.currentSelectNodeTitle = `${nodeList[0].gradeName}`
        }
      } else if (type === 3) {
        // subson node
        if (this.currentIndex === 0) {
          tag = 2
          this.treeForm.levelCode = nodeList[0].levelCode
          this.currentSelectNodeTitle = `${nodeList[2].value}${nodeList[1].value} ${nodeList[0].value}`
        } else {
          tag = 5
          this.treeForm.classCode = nodeList[0].id
          this.currentSelectNodeTitle = `${nodeList[0].className}`
        }
      }
      if (this.treeType === 0) {
        // 重置上一次的active状态
        if (Object.keys(this.lastActive).length !== 0) {
          this.lastActive.isActive = false
        }
        // update lastAcitve item
        this.lastActive = nodeList[0]
        nodeList[0].isActive = !nodeList[0].isActive
        this.$emit('tree-click', this.treeForm, this.currentSelectNodeTitle, tag)
      } else if (this.treeType === 3 && type === 3) {
        // 处理只响应孙子节点的点击
        if (Object.keys(this.lastActive).length !== 0) {
          this.lastActive.isActive = false
        }
        this.lastActive = nodeList[0]
        nodeList[0].isActive = !nodeList[0].isActive
        this.$emit('tree-click', nodeList[0].id)
      }
    },
    getSubsonNode(data) {
      const req = {
        gradeId: data.gradeId
      }
      this.getGradeClass(req)
        .then(res => {
          data.subSonList = res.data
          data.subSonList.forEach(item => {
            this.$set(item, 'isActive', false)
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getSonNode(data) {
      const req = {
        schoolScheme: sessionStorage.getItem('schoolScheme'),
        stageCode: data.stageCode
      }
      this.getStageGrade(req)
        .then(res => {
          data.sonNodeList = res.data
          data.sonNodeList.forEach(item => {
            this.$set(item, 'expand', false)
            this.$set(item, 'isActive', false)
            this.$set(item, 'subSonList', [])
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    handleTabClick() {
      if (this.currentIndex === 0) {
        this.getDormTreeList()
      } else {
        this.getGradeTreeList()
      }
    },
    getGradeTreeList() {
      this.getSchoolStage({ schoolScheme: window.sessionStorage.getItem('schoolScheme') })
        .then(res => {
          this.topTreeList = res.data
          if (this.topTreeList.length > 0) {
            this.topTreeList.forEach(item => {
              this.$set(item, 'expand', false)
              this.$set(item, 'isActive', false)
              this.$set(item, 'sonNodeList', [])
            })
            if (this.isSelect) {
              this.handleTitleClick(1, [this.topTreeList[0]], 0)
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    }
  },
  created() {},
  mounted() {
    if (this.currentIndex === 0) {
      this.getDormTreeList()
    } else {
      this.getGradeTreeList()
    }
  }
}
</script>

<style lang="less" scoped>
.ant-radio-button-wrapper-checked {
  background-color: @main-color !important;
  color: #fff;
}
.org-tree {
  padding-top: 10px;
  width: 265px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.left-top {
  width: 100%;
  height: 62px;
  display: flex;
  padding: 4px 7px 0px 7px;
}

.abnormal_tab_btn {
  margin-top: 6px;
  margin-left: 8px;
  width: 110px;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: @main-color;
  font-family: PingFang-SC-Bold;
  font-weight: 600;
  text-align: center;
  line-height: 40px;
  border: solid 1px @main-color;
  cursor: pointer;
}

.abnormal_tab_btn.active {
  background-color: #6882da;
  color: #fff;
}

.abnormal_tab_btn:first-child {
  margin-right: 9px;
}

.left-tree {
  width: 100%;
  flex: 1;
  padding: 0 7px 0 7px;
  height: calc(100% - 10px);
  overflow: auto;
}

.tree-parent {
  /* display: flex; */
  /* min-height: 60px; */
  /* align-items: center; */
  padding-left: 20px;
}

.tree-parent .tree-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
}

.tree-parent .tree-icon {
  background: url('../../../assets/img/Dormitory_icon.png') no-repeat;
  background-size: 20px 20px;
}

.tree-parent .tree-ops {
  display: inline-block;
  width: 18px;
  height: 11px;
  cursor: pointer;
  background: url('../../../assets/img/fangxia__icon1.png') no-repeat;
}

.tree-parent .tree-ops.isExpand {
  background: url('../../../assets/img/shouqi_icon.png') no-repeat;
}

.tree-parent .tree-title {
  display: inline-block;
  margin-left: 8px;
  margin-right: 8px;
  height: 28px;
  line-height: 25px;
  overflow: hidden;
  word-wrap: break-word;
  width: 160px;
  font-size: 15px;
  color: #6882da;
  cursor: pointer;
}

.tree-parent .tree-son,
.tree-parent .tree-subson {
  /* display: flex; */
  padding-left: 24px;
}

.tree-parent .tree-sonWrap {
  width: 100%;
  display: none;
  /* min-height: 60px; */
}

.tree-parent .tree-sonWrap.isExpand {
  display: block;
}

.tree-parent .son-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url('../../../assets/img/storey_icon.png') no-repeat;
  background-size: 18px 18px;
}

.tree-parent .son-title {
  margin-left: 15px;
  color: #6882da;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  width: 110px;
}

.tree-parent .son-ops {
  display: inline-block;
  margin-left: 10px;
  width: 18px;
  height: 11px;
  background: url('../../../assets/img/fangxia_icon2.png') no-repeat;
  cursor: pointer;
}

.tree-parent .son-ops.isExpand {
  background: url('../../../assets/img/shouqi_icon2.png') no-repeat;
}

.tree-parent .tree-subsonWrap {
  width: 100%;
  display: none;
}

.tree-parent .tree-subsonWrap.isExpand {
  display: block;
}

.tree-parent .subson-icon {
  display: inline-block;
  width: 17px;
  height: 15px;
  background: url('../../../assets/img/personnel_icon.png') no-repeat;
}

.tree-parent .subson-title {
  margin-left: 10px;
  color: #6882da;
  cursor: pointer;
  line-height: 22px;
  height: 22px;
  min-width: 90px;
}

.tree-parent .tree-subson {
  display: flex;
  align-items: center;
  height: 40px;
}

.tree-parent .tree-parent--header,
.tree-parent .tree-son--header {
  height: 40px;
  display: flex;
  align-items: center;
}

.tree-parent .subson-title.isActive,
.tree-parent .tree-title.isActive,
.tree-parent .son-title.isActive {
  color: #6882da;
  padding-left: 4px;
  border-radius: 6px;
  border: 1px solid @main-color;
  background-color: #e6f7ff;
}
</style>
