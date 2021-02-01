<template>
  <div class="teacher page-layout u-fx u-type-white-bg">
    <u-choose-place
      is-radio
      ref="choosePlaceRef"
      v-if="placeTag"
      v-model="placeTag"
      :schoolCode="schoolCode"
      :bindList="bindPlaceList"
      @submit="submitPlace"
    ></u-choose-place>
    <u-choose-teacher
      is-check
      ref="chooseTeacherRef"
      v-if="teacherTag"
      v-model="teacherTag"
      :schoolCode="schoolCode"
      :bindList="bindList"
      @submit="submitTeacher"
      title="绑定辅导员"
    ></u-choose-teacher>
    <u-submit-form
      ref="form"
      :width="600"
      @submit="submitClass"
      :title="classTitle + '班级'"
      v-model="formStatus"
      :form-data="formData"
    ></u-submit-form>
    <div class="layout-padd-t left-tree">
      <u-class-tree v-if="show" ref="classTree" :school="schoolCode" @select="select" :isChoose="true"></u-class-tree>
    </div>
    <div class="u-fx-f1 u-fx-ver">
      <u-space direction="vertical" class="layout-padd">
        <u-search-form :search-label="searchLabel" @search="search" ref="searchForm">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="classAction(0)" type="primary">添加班级</u-button>
              <u-button @click="classAction(0, null, true)" type="light">批量添加班级</u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
        <u-space class="u-fx-ac u-choose-item">
          已选择 {{ chooseList.length }} 项数据
          <u-button
            @click="_delClass(1)"
            :disabled="chooseList.length === 0"
            type="danger"
            delete
          >批量删除班级</u-button>
          <u-button
            @click="_unbindTeacher()"
            :disabled="chooseList.length === 0"
            type="danger"
            delete
          >批量解绑辅导员</u-button>
          <u-button
            @click="_unbindPlace()"
            :disabled="chooseList.length === 0"
            type="danger"
            delete
          >批量解绑教室</u-button>
        </u-space>
      </u-space>
      <div class="u-fx u-fx-f1">
        <u-table
          is-zoom
          is-check
          :page-list="pageList"
          :columns="columns"
          :table-list="classList"
          v-model="chooseList"
        >
          <template v-slot:slotOne="slotOne">
            <u-table-action
              @action="_bindTeacher(slotOne.record.id, slotOne.record.headTeacherList)"
              @button="_bindTeacher(slotOne.record.id)"
              buttonValue="绑定"
              icon="edit"
              iconTip="绑定"
              :label="getTeacher(slotOne.record.headTeacherList)"
            ></u-table-action>
          </template>
          <template v-slot:slotTwo="slotTwo">
            <u-table-action
              @action="_bindPalce(slotTwo.record.id, slotTwo.record.placeName)"
              @button="_bindPalce(slotTwo.record.id)"
              buttonValue="绑定"
              icon="edit"
              iconTip="绑定"
              :label="slotTwo.record.placeName"
            ></u-table-action>
          </template>
          <template v-slot:slotThree="slotThree">
            <u-tag
              type="primary-bd"
              pointer
              @change="goDetail(slotThree.record)"
            >{{ slotThree.record.studentCount }}</u-tag>
          </template>
          <template v-slot:actions="actions">
            <u-button type="link" @click="goDetail(actions.record)">详情</u-button>
            <u-button type="link" @click="classAction(1, actions.record)">编辑</u-button>
            <u-button type="link" delete @click="_delClass(0, actions.record.id)">删除</u-button>
          </template>
        </u-table>
      </div>
      <div class="u-type-white-bg">
        <u-pagination v-model="pageList" :total="total" @change="_getClassList"></u-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '@u/libs/ajax-serve'
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/classH'
import searchLabel from '../../search-columns/classH'
import { singleForm, allForm } from '../../submit-columns/classH'
export default {
  name: 'ClassManageH',
  components: {},
  data() {
    return {
      classTitle: '',
      formStatus: false,
      formData: [],
      searchLabel,
      columns,
      chooseList: [],
      classList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {},
      gradeList: [],
      title: '',
      bindList: [],
      teacherTag: false,
      placeTag: false,
      bindPlaceList: [],
      show: true
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'schoolYear'])
  },
  async mounted() {
    if (this.$route.query.type === 'fastAction') this.classAction(0)
    if (this.$route.query.type === 'waitInfo' && this.$route.query.info === 'unBZR') {
      this.schoolYearCode = this.schoolYear.code
      this.searchObj.hasHeadTeacher = false
      this.$refs.searchForm.form.setFieldsValue({ 'teacher': '2' })
      this._getClassList()
    }
    this._getMajor()
  },
  methods: {
    ...mapActions('home', [
      'getClassList',
      'modifyClass',
      'addSingleClass',
      'addBatchClass',
      'delClass',
      'bindTeacher',
      'bindPlace',
      'getOldSchoolYearList',
      'getMajor'
    ]),
    /**
     * 班级树回调
     * @param { object } value 班级信息
     */
    select(value) {
      this.schoolYearCode = value.schoolYearCode
      this.majorCode = value.majorCode || ''
      this.gradeCode = value.gradeCode || ''
      this._getClassList()
    },
    /**
     * 获取班级列表
     */
    async _getClassList(value = {}) {
      this.chooseList = []
      this.total = 0
      const res = await this.getClassList({
        gradeCode: this.gradeCode,
        hasClassroom: this.hasClassroom,
        hasHeadTeacher: this.hasHeadTeacher,
        headTeacherName: value.headTeacherName,
        majorCode: this.majorCode,
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYearCode,
        ...this.pageList
      })
      this.classList = res.data.records
      this.total = res.data.total
    },
    /**
     * 班级搜索
     * @param { object } value 搜索表单
     */
    search(value) {
      this.headTeacherName = value.headTeacherName
      if (value.hasClassroom === '') {
        this.hasClassroom = ''
      } else if (value.hasClassroom === '1') {
        this.hasClassroom = true
      } else if (value.hasClassroom === '0') {
        this.hasClassroom = false
      }
      if (value.hasHeadTeacher === '') {
        this.hasHeadTeacher = ''
      } else if (value.hasHeadTeacher === '1') {
        this.hasHeadTeacher = true
      } else if (value.hasHeadTeacher === '0') {
        this.hasHeadTeacher = false
      }
      this._getClassList(value)
    },
     /**
     * 获取年级和专业列表
     */
    async _getMajor() {
      const req = {
        schoolCode: this.schoolCode,
        page: 1,
        size: 999
      }
      const res = await this.getMajor(req)
      const result = await this.getOldSchoolYearList({ schoolCode: this.schoolCode })
      this.majorList = res.data.records
      this.gradeList = result.data.list
    },
    /**
     * 添加或编辑班级逻辑操作
     * @param { number } type 0:添加 1:编辑
     * @param { object } record 班级信息
     * @param { boolean } tag true: 批量添加 false: 单个添加
     */
    classAction(type, record, tag = false) {
      this.id = type ? record.id : ''
      // 存储添加类型
      this.addType = tag
      this.classTitle = type ? '编辑' : tag ? '批量添加' : '添加'
      const autoForm = tag ? allForm : singleForm
      autoForm[0].list = this.gradeList.map(item => {
        return {
          key: item.gradeCode,
          val: item.gradeName
        }
      })
      autoForm[1].list = this.majorList.map(item => {
        return {
          key: item.majorCode,
          val: item.majorName
        }
      })
      autoForm[0].disabled = !!type
      autoForm[1].disabled = !!type
      this.formData = type ? this.$tools.fillForm(autoForm, record) : autoForm
      this.formStatus = true
    },
    /**
     * 添加或编辑班级业务操作
     * @param { object } values 班级信息
     */
    async submitClass(values) {
      const req = {
        gradeCode: values.gradeCode,
        gradeName: this.gradeList.filter(item => item.gradeCode === values.gradeCode)[0].gradeName,
        majorCode: values.majorCode,
        majorName: this.majorList.filter(item => item.majorCode === values.majorCode)[0].majorName,
        orderNum: 0,
        remark: values.remark || '',
        schoolCode: this.schoolCode,
        schoolYearCode: this.schoolYear.code
      }
      this.show = false
      try {
        if (this.id) {
          // 编辑
          const req = {
            className: values.className,
            id: this.id,
            orderNum: 0,
            remark: values.remark || '',
            schoolCode: this.schoolCode
          }
          await this.modifyClass(req)
        } else {
          // 添加-单个或多个
          if (this.addType) {
            req.startOrderNum = values.startOrderNum
            req.classNum = values.classNum
            await this.addBatchClass(req)
          } else {
            req.className = values.className
            await this.addSingleClass(req)
          }
        }
        this.show = true
        this.$refs.form.reset()
        this.$tools.message('success', `${this.classTitle}成功`)
        this.$refs.classTree.initMenu()
        this.$tools.goNext(this._getClassList)
      } catch (err) {
        this.show = true
        this.$refs.form.error()
      }
    },
    /**
     * 删除班级
     * @param { boolean } type 0:单个 1:多个
     */
    async _delClass(type, id) {
      if (type) {
        id = this.chooseList
      }
      type
        ? await $http.post({
        url: `/protal_v3_11101/canpointClass/delete/batch/${this.schoolCode}`,
        params: this.chooseList
      })
        : await this.delClass({ id, _getVal: this.schoolCode })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(this._getClassList)
    },
    /**
     * 获取班主任
     */
    getTeacher(val) {
      return val.reduce((prev, curr) => {
        return prev + curr.userName + ' '
      }, '')
    },
    /**
     * 班级绑定班主任
     * @param { type } id 班级id
     * @param { array } user 绑定的班主任列表
     */
    _bindTeacher(id, user) {
      this.id = id
      this.bindList = user || []
      this.teacherTag = true
    },
    async submitTeacher(values) {
      try {
        await this.bindTeacher({
          id: this.id,
          schoolCode: this.schoolCode,
          headTeacherList: values.map(item => {
            return {
              userName: item.userName,
              userCode: item.userCode
            }
          })
        })
        this.$refs.chooseTeacherRef.reset()
        this.$tools.message('success', '绑定成功')
        this.$tools.goNext(this._getClassList)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
      }
    },
    /**
     * 批量解绑班主任
     */
    async _unbindTeacher() {
      await $http.post({
        url: `/protal_v3_11101/canpointClass/headTeacher/unbind/batch/${this.schoolCode}`,
        params: this.chooseList
      })
      this.$tools.message('success', '解绑成功')
      this.$tools.goNext(this._getClassList)
    },
    /**
     * 绑定场地
     * @param { number } id 班级id
     * @param { object } place 班级场地信息
     */
    _bindPalce(id, place) {
      this.id = id
      this.bindPlaceList = place || []
      this.placeTag = true
    },
    async submitPlace(values) {
      const { placeName, placeCode, floorName, floorCode, roomName, roomCode } = values[0]
      try {
        await this.bindPlace({
          id: this.id,
          placeCode: `${placeCode}/${floorCode}/${roomCode}`,
          placeName: `${placeName}/${floorName}/${roomName}`,
          schoolCode: this.schoolCode
        })
        this.$tools.message('success', '绑定成功')
        this.$refs.choosePlaceRef.reset()
        this.$tools.goNext(this._getClassList)
      } catch (err) {
        this.$refs.choosePlaceRef.error()
      }
    },
    /**
     * 批量解绑班场地
     */
    async _unbindPlace() {
      await $http.post({
        url: `/protal_v3_11101/canpointClass/classroom/unbind/batch/${this.schoolCode}`,
        params: this.chooseList
      })
      this.$tools.message('success', '解绑成功')
      this.$tools.goNext(this._getClassList)
    },
    /**
     * 跳转班级详情
     * @param { object } item 班级信息
     */
    goDetail(item) {
      this.$router.push({
        path: '/classManage/classDetail',
        query: {
          classCode: item.classCode,
          gradeCode: item.gradeCode,
          schoolYearCode: item.schoolYearCode
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
