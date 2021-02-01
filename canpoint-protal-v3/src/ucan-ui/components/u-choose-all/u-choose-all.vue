<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <div class="u-fx-ver u-fx-f1">
      <u-tabs
        v-if="showTab"
        @change="tabChange"
        :defaultActiveKey="currentkey"
        v-model="currentkey"
        :tab-list="tabList"
      >
      </u-tabs>
      <!-- 班级 -->
      <div v-if="currentkey === '0'" class="choose-all u-fx">
        <u-class-tree
          isChoose
          isOnlyNewSchoolYear
          :school="schoolCode"
          @select="selectTree($event, currentkey)"
        ></u-class-tree>
        <div class="u-fx-ver u-fx-f1">
          <u-table
            :scroll-h="500"
            :is-check="isCheck"
            :is-radio="isRadio"
            is-zoom
            :page-list="pageList"
            v-model="chooseObj.calssChooseList"
            :columns="isHigh ? columnList.highClassColumns : columnList.classColumns"
            @clickRow="clickRow(arguments, currentkey)"
            @selectAll="selectAll(arguments, currentkey)"
            :table-list="classList"
          ></u-table>
          <div class="u-fx-je">
            <u-pagination :total="total" v-model="pageList" @change="getDataList(currentkey)"></u-pagination>
          </div>
        </div>
        <div class="all-box u-fx-ver">
          <div class="title u-fx-jsb">
            <span>已选择</span>
            <span>{{ totalObj.classTotalList.length }}个</span>
          </div>
          <div class="u-fx-f1 u-auto">
            <ul>
              <li v-for="(item, index) in totalObj.classTotalList" :key="item.id" class="u-fx-jsb u-fx-ac">
                <span>{{ item.gradeName }}{{ item.className }}</span>
                <a-tag @click="delUser(item.id, index, currentkey)" color="#f50">删除</a-tag>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 教职工 -->
      <div v-if="currentkey === '1'">
        <u-search-form
          class="u-mar-b10"
          :search-label="columnList.teacherSearchLabel"
          @search="searchForm($event, currentkey)"
        ></u-search-form>
        <div class="choose-all u-fx">
          <u-org-post v-if="chooseByDutyTag" :school="schoolCode" @select="selectTree($event, currentkey)"></u-org-post>
          <u-org-tree v-else :school="schoolCode" @select="selectTree($event, currentkey)"></u-org-tree>
          <!-- <u-org-tree @select="selectTree($event, currentkey)" :school="schoolCode"></u-org-tree> -->
          <div class="u-fx-ver u-fx-f1">
            <u-table
              :scroll-h="500"
              :is-check="isCheck"
              :is-radio="isRadio"
              is-zoom
              :page-list="pageList"
              v-model="chooseObj.teacherChooseList"
              :columns="columnList.teacherColumns"
              @clickRow="clickRow(arguments, currentkey)"
              @selectAll="selectAll(arguments, currentkey)"
              :table-list="teacherList"
            ></u-table>
            <div class="u-fx-je">
              <u-pagination :total="total" v-model="pageList" @change="getDataList(currentkey)"></u-pagination>
            </div>
          </div>
          <div class="all-box u-fx-ver">
            <div class="title u-fx-jsb">
              <span>已选择</span>
              <span>{{ totalObj.teacherTotalList.length }}个</span>
            </div>
            <div class="u-fx-f1 u-auto">
              <ul>
                <li v-for="(item, index) in totalObj.teacherTotalList" :key="item.id" class="u-fx-jsb u-fx-ac">
                  <span>{{ item.userName }}</span>
                  <a-tag @click="delUser(item.id, index, currentkey)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 设备 -->
      <div v-if="currentkey === '2'">
        <u-search-form
          class="u-mar-b10"
          :search-label="columnList.deviceSearchLabel"
          @search="searchForm($event, currentkey)"
        ></u-search-form>
        <div class="choose-all u-fx">
          <div class="u-fx-ver u-fx-f1">
            <u-table
              :scroll-h="500"
              :is-check="isCheck"
              :is-radio="isRadio"
              is-zoom
              :page-list="pageList"
              v-model="chooseObj.deviceChooseList"
              :columns="columnList.deviceColumns"
              @clickRow="clickRow(arguments, currentkey)"
              @selectAll="selectAll(arguments, currentkey)"
              :table-list="deviceList"
            ></u-table>
            <div class="u-fx-je">
              <u-pagination :total="total" v-model="pageList" @change="getDataList(currentkey)"></u-pagination>
            </div>
          </div>
          <div class="all-box u-fx-ver">
            <div class="title u-fx-jsb">
              <span>已选择</span>
              <span>{{ totalObj.deviceTotalList.length }}个</span>
            </div>
            <div class="u-fx-f1 u-auto">
              <ul>
                <li v-for="(item, index) in totalObj.deviceTotalList" :key="item.id" class="u-fx-jsb u-fx-ac">
                  <span>{{ item.deviceName }}</span>
                  <a-tag @click="delUser(item.id, index, currentkey)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 宿舍班牌 -->
      <div v-if="currentkey === '3'">
        <div class="choose-all u-fx">
          <u-dorm-tree isChoose :school="schoolCode" @select="selectTree($event, currentkey)"></u-dorm-tree>
          <div class="u-fx-ver u-fx-f1">
            <u-table
              :scroll-h="500"
              :is-check="isCheck"
              :is-radio="isRadio"
              is-zoom
              :page-list="pageList"
              v-model="chooseObj.dormChooseList"
              :columns="columnList.dormColumns"
              @clickRow="clickRow(arguments, currentkey)"
              @selectAll="selectAll(arguments, currentkey)"
              :table-list="dormList"
            ></u-table>
            <div class="u-fx-je">
              <u-pagination :total="total" v-model="pageList" @change="getDataList(currentkey)"></u-pagination>
            </div>
          </div>
          <div class="all-box u-fx-ver">
            <div class="title u-fx-jsb">
              <span>已选择</span>
              <span>{{ totalObj.dormTotalList.length }}个</span>
            </div>
            <div class="u-fx-f1 u-auto">
              <ul>
                <li v-for="(item, index) in totalObj.dormTotalList" :key="item.id" class="u-fx-jsb u-fx-ac">
                  <span>{{ item.buildingName }}</span>
                  <a-tag @click="delUser(item.id, index, currentkey)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 学生 -->
      <div v-if="currentkey === '4'">
        <u-search-form
          class="u-mar-b10"
          :search-label="columnList.studentSearchLabel"
          @search="searchForm($event, currentkey)"
        ></u-search-form>
        <div class="choose-all u-fx">
          <u-class-tree
            isOnlyNewSchoolYear
            :school="schoolCode"
            @select="selectTree($event, currentkey)"
          ></u-class-tree>
          <div class="u-fx-ver u-fx-f1">
            <u-table
              :scroll-h="500"
              :is-check="isCheck"
              :is-radio="isRadio"
              is-zoom
              :page-list="pageList"
              v-model="chooseObj.studentChooseList"
              :columns="columnList.studentColumns"
              @clickRow="clickRow(arguments, currentkey)"
              @selectAll="selectAll(arguments, currentkey)"
              :table-list="studentList"
            >
              <template v-slot:slotOne="slotOne">
                <a-tag ghost :color="slotOne.record.hasDorm ? 'green' : 'pink'">{{
                  slotOne.record.hasDorm ? '住读' : '走读'
                }}</a-tag>
              </template>
            </u-table>
            <div class="u-fx-je">
              <u-pagination :total="total" v-model="pageList" @change="getDataList(currentkey)"></u-pagination>
            </div>
          </div>
          <div class="all-box u-fx-ver">
            <div class="title u-fx-jsb">
              <span>已选择</span>
              <span>{{ totalObj.studentTotalList.length }}个</span>
            </div>
            <div class="u-fx-f1 u-auto">
              <ul>
                <li v-for="(item, index) in totalObj.studentTotalList" :key="item.id" class="u-fx-jsb u-fx-ac">
                  <span>{{ item.userName }}</span>
                  <a-tag @click="delUser(item.id, index, currentkey)" color="#f50">删除</a-tag>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
import columnList from '../../asstes/js/choose-data-colums'

export default {
  name: 'Chooseclass',
  components: {},
  props: {
    // 学校编码
    schoolCode: {
      type: String,
      default: ''
    },
    // 判断是高职还是基教
    isHigh: {
      type: Boolean,
      default: false
    },
    // 更新方式 false：更新所有，true：新增和删除分开更新
    updateType: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '选择'
    },
    // 打开弹窗
    value: {
      type: Boolean,
      default: false
    },
    // 是否为单选
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否为多选
    isCheck: {
      type: Boolean,
      default: false
    },
    // 按职务选择教职工
    chooseByDutyTag: {
      type: Boolean,
      default: false
    },
    // 已选择数据回显
    bindObj: {
      type: Object,
      default: () => {
        return {
          classList: [],
          teacherList: [],
          deviceList: [],
          dormList: [],
          studentList: []
        }
      }
    },
    // 标签类型： 0.班级  1教职工  2设备  3宿舍班牌  4学生
    tabKey: {
      type: Array,
      default: () => {
        return ['0']
      }
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
    },
    tabList: {
      get() {
        const map = new Map()
        map.set('0', '班级')
        map.set('1', '教职工')
        map.set('2', '设备')
        map.set('3', '宿舍班牌')
        map.set('4', '学生')
        return this.tabKey.map((el) => {
          return {
            key: el,
            title: map.get(el)
          }
        })
      }
    }
  },
  data() {
    return {
      showTab: true,
      confirmLoading: false,
      currentkey: '0',
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columnList,
      classList: [],
      teacherList: [],
      deviceList: [],
      dormList: [],
      studentList: [],
      totalObj: {
        classTotalList: [],
        teacherTotalList: [],
        deviceTotalList: [],
        dormTotalList: [],
        studentTotalList: []
      },
      chooseObj: {
        calssChooseList: [],
        teacherChooseList: [],
        deviceChooseList: [],
        dormChooseList: [],
        studentChooseList: []
      },
      oldTotalList: {}
    }
  },
  async mounted() {
    console.log(this.schoolCode)
    if (this.tabKey.length === 1) {
      this.showTab = false
    }
    this.currentkey = this.tabKey[0]
    if (this.tabKey[0] === '2') this.getDataList(this.tabKey[0])
    this.allaction = ['classTotalList', 'teacherTotalList', 'deviceTotalList', 'dormTotalList', 'studentTotalList']
    this.allChooseaction = [
      'calssChooseList',
      'teacherChooseList',
      'deviceChooseList',
      'dormChooseList',
      'studentChooseList'
    ]
    if (!this.bindObj) return
    if (this.tabKey.indexOf('0') !== -1) {
      if (!this.bindObj.classList || this.bindObj.classList.length === 0) return
      this.chooseObj.calssChooseList = this.bindObj.classList.map((el) => el.classCode)
      this.totalObj.classTotalList = this.bindObj.classList.map((el) => {
        return {
          ...el,
          id: el.classCode
        }
      })
      if (this.updateType) {
        this.oldTotalList.oldClassTotalList = JSON.parse(JSON.stringify(this.totalObj.classTotalList))
      }
    }
    if (this.tabKey.indexOf('1') !== -1) {
      if (!this.bindObj.teacherList || this.bindObj.teacherList.length === 0) return
      this.chooseObj.teacherChooseList = this.bindObj.teacherList.map((el) => el.userCode)
      this.totalObj.teacherTotalList = this.bindObj.teacherList.map((el) => {
        return {
          ...el,
          id: el.userCode
        }
      })
      if (this.updateType) {
        this.oldTotalList.oldTeacherTotalList = JSON.parse(JSON.stringify(this.totalObj.teacherTotalList))
      }
    }
    if (this.tabKey.indexOf('2') !== -1) {
      if (!this.bindObj.deviceList || this.bindObj.deviceList.length === 0) return
      this.chooseObj.deviceChooseList = this.bindObj.deviceList.map((el) => el.deviceSn)
      this.totalObj.deviceTotalList = this.bindObj.deviceList.map((el) => {
        return {
          ...el,
          id: el.deviceSn
        }
      })
      if (this.updateType) {
        this.oldTotalList.oldDeviceTotalList = JSON.parse(JSON.stringify(this.totalObj.deviceTotalList))
      }
    }
    if (this.tabKey.indexOf('3') !== -1) {
      if (!this.bindObj.dormList || this.bindObj.dormList.length === 0) return
      this.chooseObj.dormChooseList = this.bindObj.dormList.map((el) => el.deviceSn)
      this.totalObj.dormTotalList = this.bindObj.dormList.map((el) => {
        return {
          ...el,
          id: el.deviceSn
        }
      })
      if (this.updateType) this.oldTotalList.oldDormTotalList = JSON.parse(JSON.stringify(this.totalObj.dormTotalList))
    }
    if (this.tabKey.indexOf('4') !== -1) {
      if (!this.bindObj.studentList || this.bindObj.studentList.length === 0) return
      this.chooseObj.studentChooseList = this.bindObj.studentList.map((el) => el.userCode)
      this.totalObj.studentTotalList = this.bindObj.studentList.map((el) => {
        return {
          ...el,
          id: el.userCode
        }
      })
      if (this.updateType) {
        this.oldTotalList.oldStudentTotalList = JSON.parse(JSON.stringify(this.totalObj.studentTotalList))
      }
    }
  },
  methods: {
    // 切换数据类型
    tabChange(value) {
      if (value === '2') this.getDataList(value)
    },
    /**
     * @description 获取列表数据
     * @param { key } string 数据类型： 0.班级  1教职工  2设备  3宿舍班牌  4学生
     */
    async getDataList(key) {
      console.log(key)
      switch (key) {
        case '0':
          if (!this.selectObj.schoolYearCode) return
          const classRes = await $ajax.post({
            url: `/protal_v3_11101/canpointClass/page`,
            params: {
              schoolCode: this.schoolCode,
              ...this.selectObj,
              ...this.pageList
            }
          })
          this.classList = classRes.data.records.map((item) => {
            return {
              ...item,
              classId: item.id,
              id: item.classCode
            }
          })
          this.total = classRes.data.total
          break
        case '1':
          const teacherRes = await $ajax.post({
            url: `/protal_v3_11101/canpointUserInfo/teacher/queryTeacherList`,
            params: {
              schoolCode: this.schoolCode,
              orgCode: this.selectObj.code,
              stationCode: this.chooseByDutyTag ? this.selectObj.stationCode : undefined,
              ...this.searchObj,
              ...this.pageList
            }
          })
          this.teacherList = teacherRes.data.records.map((item) => {
            return {
              ...item,
              userId: item.id,
              id: item.userCode
            }
          })
          this.total = teacherRes.data.total
          break
        case '2':
          const deviceRes = await $ajax.post({
            url: `/protal_api_10090/device/info/queryDeviceInfos`,
            params: {
              schoolCode: this.schoolCode,
              ...this.pageList,
              ...this.searchObj
            }
          })
          this.deviceList = deviceRes.data.records.map((item) => {
            return {
              ...item,
              deviceId: item.id,
              id: item.deviceSn
            }
          })
          this.total = deviceRes.data.total
          break
        case '3':
          const dormRes = await $ajax.post({
            url: `/ljj_dorm/dorm/controller/list`,
            params: {
              ...this.pageList,
              schoolCode: this.schoolCode,
              deviceType: '3',
              buildingCode: this.selectObj.categoryType === '3' ? this.selectObj.pCode : this.selectObj.code,
              floorCode: this.selectObj.categoryType === '3' ? this.selectObj.code : undefined
            }
          })
          this.dormList = dormRes.data.records.map((item) => {
            return {
              ...item,
              deviceId: item.id,
              id: item.deviceSn
            }
          })
          this.total = dormRes.data.total
          break
        case '4':
          if (!this.selectObj.schoolYearCode) return
          const studentRes = await $ajax.post({
            url: `/protal_v3_11101/canpointUserInfo/student/queryStudentList`,
            params: {
              schoolCode: this.schoolCode,
              ...this.selectObj,
              ...this.searchObj,
              ...this.pageList
            }
          })
          this.studentList = studentRes.data.records.map((item) => {
            return {
              ...item,
              userId: item.id,
              id: item.userCode
            }
          })
          this.total = studentRes.data.total
          break
      }
    },
    // 重置选择
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    // 重置选择
    error() {
      this.confirmLoading = false
    },
    // 删除选择
    delUser(id, index, key) {
      this.totalObj[this.allaction[key]].splice(index, 1)
      this.chooseObj[this.allChooseaction[key]].splice(this.chooseObj[this.allChooseaction[key]].indexOf(id), 1)
    },
    // 搜索
    searchForm(value, key) {
      this.searchObj = value
      this.getDataList(key)
    },
    // 树形结构筛选
    selectTree(item, key) {
      console.log(item)
      this.pageList.page = 1
      if (key === '1' && this.chooseByDutyTag) {
        this.selectObj = {
          ...item,
          code: item.type === '1' ? item.code : '',
          stationCode: item.type === '2' ? item.code : ''
        }
      } else {
        this.selectObj = item
      }
      this.getDataList(key)
    },
    // 全选
    selectAll(argument, key) {
      if (argument[1]) {
        this.totalObj[this.allaction[key]] = this.totalObj[this.allaction[key]].concat(argument[0])
      } else {
        argument[0].forEach((item) => {
          const index = this.totalObj[this.allaction[key]].findIndex((list) => {
            return list.id === item.id
          })
          this.totalObj[this.allaction[key]].splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(argument, key) {
      if (argument[1]) {
        if (this.isCheck) {
          this.totalObj[this.allaction[key]].push(argument[0])
          console.log(this.totalObj[this.allaction[key]])
        } else {
          this.totalObj[this.allaction[key]] = [argument[0]]
        }
      } else {
        const index = this.totalObj[this.allaction[key]].findIndex((list) => list.id === argument[0].id)
        this.totalObj[this.allaction[key]].splice(index, 1)
      }
    },
    // 过滤重复数据
    filterData(oldArr, newArr) {
      return oldArr.filter((item) => {
        return JSON.stringify(newArr).indexOf(item.id) === -1
      })
    },
    // 确认选择
    submitOk() {
      this.confirmLoading = true
      const submitObj = {}
      if (this.tabKey.indexOf('0') !== -1) {
        if (this.updateType) {
          submitObj.classList = {
            delList: this.filterData(this.oldTotalList.oldClassTotalList, this.totalObj.classTotalList),
            addList: this.filterData(this.totalObj.classTotalList, this.oldTotalList.oldClassTotalList)
          }
        } else {
          submitObj.classList = this.totalObj[this.allaction[0]]
        }
      }
      if (this.tabKey.indexOf('1') !== -1) {
        if (this.updateType) {
          submitObj.teacherList = {
            delList: this.filterData(this.oldTotalList.oldTeacherTotalList, this.totalObj.teacherTotalList),
            addList: this.filterData(this.totalObj.teacherTotalList, this.oldTotalList.oldTeacherTotalList)
          }
        } else {
          submitObj.teacherList = this.totalObj[this.allaction[1]]
        }
      }
      if (this.tabKey.indexOf('2') !== -1) {
        if (this.updateType) {
          submitObj.deviceList = {
            delList: this.filterData(this.oldTotalList.oldDeviceTotalList, this.totalObj.deviceTotalList),
            addList: this.filterData(this.totalObj.deviceTotalList, this.oldTotalList.oldDeviceTotalList)
          }
        } else {
          submitObj.deviceList = this.totalObj[this.allaction[2]]
        }
      }
      if (this.tabKey.indexOf('3') !== -1) {
        if (this.updateType) {
          submitObj.dormList = {
            delList: this.filterData(this.oldTotalList.oldDormTotalList, this.totalObj.dormTotalList),
            addList: this.filterData(this.totalObj.dormTotalList, this.oldTotalList.oldDormTotalList)
          }
        } else {
          submitObj.dormList = this.totalObj[this.allaction[3]]
        }
      }
      if (this.tabKey.indexOf('4') !== -1) {
        if (this.updateType) {
          submitObj.studentList = {
            delList: this.filterData(this.oldTotalList.oldStudentTotalList, this.totalObj.studentTotalList),
            addList: this.filterData(this.totalObj.studentTotalList, this.oldTotalList.oldStudentTotalList)
          }
        } else {
          submitObj.studentList = this.totalObj[this.allaction[4]]
        }
      }
      this.$emit('submit', submitObj)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-all {
  height: 600px;
  .all-box {
    border: 1px #f5f5f5 solid;
    margin-left: 15px;
    width: 200px;
    .title {
      padding: 0 10px;
      background-color: #f5f5f5;
      height: 41px;
      line-height: 41px;
      border-bottom: 1px #f5f5f5 solid;
    }
    li {
      border-bottom: 1px #f5f5f5 solid;
      padding: 6px 0px 6px 8px;
    }
  }
}
</style>
