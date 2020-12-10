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
            (currentIndex === 1 && (schoolType === '8' || schoolType === '9')) ? item.title : (currentIndex === 1 && (schoolType !== '8' || schoolType !== '9')) ? item.schoolYear + '学年' : item.categoryName
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
              >{{ (currentIndex === 1 && (schoolType === '8' || schoolType === '9')) ? elem.title : (currentIndex === 1 && (schoolType !== '8' || schoolType !== '9')) ? elem.name : elem.categoryName }}</span
              >
              <div :class="['son-ops', { isExpand: elem.expand }]" @click.stop="handleSonOps(elem)" v-if="isRoom"></div>
            </div>
            <div :class="['tree-subsonWrap', { isExpand: elem.expand }]" v-if="isRoom">
              <div class="tree-subson" v-for="el in elem.subSonList" :key="el.id">
                <div class="subson-icon"></div>
                <span
                  :class="['subson-title', { isActive: el.isActive }]"
                  @click.stop="handleTitleClick(3, [el, elem, item])"
                >{{ (currentIndex === 1 && (schoolType === '8' || schoolType === '9')) ? el.title : (currentIndex === 1 && (schoolType !== '8' || schoolType !== '9')) ? el.className : el.categoryName }}</span
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
          name: 0,
          title: '宿舍'
        },
        {
          name: 1,
          title: '班级'
        }
      ],
      topTreeList: [],
      lastActive: {},
      currentSelectNodeTitle: '',
      treeForm: {
        buildingCode: '',
        classCode: '',
        floorCode: '',
        gradeCode: '',
        roomCode: '',
        stageCode: ''
      },
      schoolType: JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
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
    },
    isRoom: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions('orgTree', ['getHighNode', 'getBuildNode', 'getBuildChildNode', 'getSchoolStage', 'getStageGrade', 'getGradeClass']),
    getDormTreeList() {
      this.getBuildNode(sessionStorage.getItem('schoolScheme')).then(res => {
        // console.log('res++', res)
        if (res.code === 200) {
          this.topTreeList = res.data
          if (this.topTreeList.length > 0) {
            this.topTreeList.forEach(item => {
              this.$set(item, 'expand', false)
              this.$set(item, 'isActive', false)
              this.$set(item, 'sonNodeList', [])
            })
            // console.log('list', this.topTreeList)
            if (this.isSelect) {
              this.handleTitleClick(1, [this.topTreeList[0]], 0)
            }
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    resetForm: function() {
      this.treeForm.buildingCode = ''
      this.treeForm.classCode = ''
      this.treeForm.floorCode = ''
      this.treeForm.gradeCode = ''
      this.treeForm.roomCode = ''
      this.treeForm.stageCode = ''
    },
    handleTitleClick(type, nodeList, treeType) {
      console.log('nodeList',nodeList)
      this.resetForm()
      var tag = ''
      if (type === 1) {
        // parent node
        if (this.currentIndex === 0) {
          tag = 0
          this.treeForm.buildingCode = nodeList[0].categoryCode
          this.currentSelectNodeTitle = nodeList[0].categoryName
          this.treeForm.schoolYearId = ''
        } else {
          tag = 3
          this.treeForm.stageCode = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].code : nodeList[0].stageCode
          this.treeForm.schoolYearId = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].gradeName : nodeList[0].schoolYearId
          this.treeForm.gradeCode = ''
          this.treeForm.classCode = ''
          this.currentSelectNodeTitle = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].title : nodeList[0].schoolYear + '学年'
        }
      } else if (type === 2) {
        // son node
        if (this.currentIndex === 0) {
          tag = 1
          this.treeForm.buildingCode = nodeList[0].pCode
          this.treeForm.floorCode = nodeList[0].categoryCode
          this.currentSelectNodeTitle = `${nodeList[1].categoryName}${nodeList[0].categoryName}`
          this.treeForm.schoolYearId = ''
        } else {
          tag = 4
          this.treeForm.gradeCode = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].subjectCode : nodeList[0].gradeId
          this.treeForm.schoolYearId = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].gradeName : nodeList[0].schoolYearId
          this.treeForm.classCode = ''
          // this.currentSelectNodeTitle = `${nodeList[1].stageName}${nodeList[0].gradeName}`
          this.currentSelectNodeTitle = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].title : `${nodeList[0].name}`
        }
      } else if (type === 3) {
        // subson node
        if (this.currentIndex === 0) {
          tag = 2
          this.treeForm.floorCode = nodeList[0].pCode
          this.treeForm.roomCode = nodeList[0].categoryCode
          this.currentSelectNodeTitle = `${nodeList[2].categoryName}${nodeList[1].categoryName} ${nodeList[0].categoryName}`
          this.treeForm.schoolYearId = ''
        } else {
          tag = 5
          this.treeForm.classCode = this.treeForm.classCode = nodeList[0].classCode
          this.treeForm.gradeCode = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].subjectCode : nodeList[0].gradeCode
          this.treeForm.schoolYearId = (this.schoolType === '8' || this.schoolType === '9') ? nodeList[0].gradeName : nodeList[0].schoolYearId
          // this.currentSelectNodeTitle = `${nodeList[2].stageName}${nodeList[1].gradeName} ${nodeList[0].className}`
          this.currentSelectNodeTitle = (this.schoolType === '8' || this.schoolType === '9') ? `${nodeList[2].title} ${nodeList[1].title} ${nodeList[0].title}` : `${nodeList[1].name} ${nodeList[0].className}`
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
    getDormSubsonNode(data) {
      const req = {
        schoolCode: data.schoolCode,
        pCode: data.categoryCode
      }
      this.getBuildChildNode(req)
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
    handleSonOps(item) {
      item.expand = !item.expand
      if (this.schoolType !== '8' || this.schoolType !== '9') {
        if (this.currentIndex === 0 && item.subSonList.length === 0) {
          this.getDormSubsonNode(item)
        } else if (this.currentIndex === 1 && item.subSonList.length === 0) {
          this.getSubsonNode(item)
        }
      }
    },
    getSubsonNode(data) {
      console.log(data)
      const req = {
        schoolCode: data.schoolCode,
        schoolYearId: data.schoolYearId,
        gradeCode: data.gradeId
      }
      this.getGradeClass(req)
        .then(res => {
          data.subSonList = res.data.list
          data.subSonList.forEach(item => {
            this.$set(item, 'gradeCode', data.gradeId)
            this.$set(item, 'isActive', false)
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getDormSonNode(data) {
      const req = {
        schoolCode: data.schoolCode,
        pCode: data.categoryCode
      }
      this.getBuildChildNode(req)
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
    handleParentOps(item) {
      item.expand = !item.expand
      if (this.schoolType !== '8' || this.schoolType !== '9') {
        if (this.currentIndex === 0) {
          this.getDormSonNode(item)
        } else if (this.currentIndex === 1 && item.sonNodeList.length === 0) {
          this.getSonNode(item)
        }
      }
    },
    getSonNode(data) {
      const req = {
        schoolCode: sessionStorage.getItem('schoolScheme')
      }
      this.getStageGrade(req)
        .then(res => {
          data.sonNodeList = res.data.list
          data.sonNodeList.forEach(item => {
            this.$set(item, 'schoolYearId', data.schoolYearId)
            this.$set(item, 'gradeId', item.code)
            this.$set(item, 'expand', false)
            this.$set(item, 'isActive', false)
            this.$set(item, 'subSonList', [])
          })
          console.log(data.sonNodeList)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    handleTabClick() {
      if (this.currentIndex === 0) {
        this.getDormTreeList()
      } else {
        if ((this.schoolType === '8' || this.schoolType === '9') || this.schoolType === '9') {
          this._getHighNode()
        } else {
          this.getGradeTreeList()
        }
      }
    },
    // 获取中职节点数据
    _getHighNode() {
      this.getHighNode({ schoolCode: sessionStorage.getItem('schoolScheme') })
        .then(res => {
          if (res.data.length !== 0) {
            const selectObj = {
              title: res.data[0].gradeName + '级',
              code: res.data[0].gradeCode,
              key: res.data[0].gradeCode,
              gradeName: res.data[0].gradeName,
              gradeCode: res.data[0].gradeCode,
              subjectCode: '',
              classCode: ''
            }
            this.defaultSelectedKeys = [res.data[0].gradeCode]
            this.topTreeList = res.data.map((item) => {
              return {
                gradeName: item.gradeName,
                gradeCode: item.gradeCode,
                subjectCode: '',
                classCode: '',
                title: item.gradeName + '级',
                code: item.gradeCode,
                key: item.gradeCode,
                sonNodeList: item.subjectNodeDtos ? this.filterSub(item.subjectNodeDtos) : [],
                expand: false,
                isActive: false
              }
            })
            if (this.isSelect) {
              this.handleTitleClick(1, [this.topTreeList[0]], 0)
            }
            this.$emit('select', selectObj)
          } else {
            const selectObj = {
              title: '',
              code: '',
              key: '',
              gradeName: '',
              gradeCode: '',
              subjectCode: '',
              classCode: ''
            }
            this.$emit('select', selectObj)
          }
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    // 处理专业节点
    filterSub(data) {
      const newData = data.map(el => {
        return {
          gradeName: el.gradeName,
          gradeCode: el.gradeCode,
          subjectCode: el.subjectCode,
          classCode: '',
          title: el.subjectName,
          code: el.subjectCode,
          key: el.subjectCode,
          subSonList: el.classNodeDtos ? this.filterClass(el.classNodeDtos, el.gradeCode, el.gradeName, el.subjectCode) : [],
          expand: false,
          isActive: false
        }
      })
      return newData
    },
    // 处理班级节点
    filterClass(data, gradeCode, gradeName, subjectCode) {
      const newData = data.map(el => {
        return {
          gradeName: gradeName,
          gradeCode: gradeCode,
          subjectCode: subjectCode,
          classCode: el.classCode,
          title: el.className,
          code: el.classCode,
          key: el.classCode,
          expand: false,
          isActive: false
        }
      })
      return newData
    },
    getGradeTreeList() {
      this.getSchoolStage({ schoolCode: sessionStorage.getItem('schoolScheme') })
        .then(res => {
          this.topTreeList = res.data.list.filter(item => {
            return item.semester === '下学期'
          })
          if (res.data.list[0].semester === '上学期') {
            this.topTreeList.unshift({
              id: res.data.list[0].id,
              semester: res.data.list[0].semester,
              schoolYear: res.data.list[0].schoolYear
            })
          }
          if (this.topTreeList.length > 0) {
            this.topTreeList.forEach(item => {
              console.log('getGradeTreeList',item)
              this.$set(item, 'schoolYearId', item.id)
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
