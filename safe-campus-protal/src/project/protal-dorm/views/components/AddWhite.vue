<template>
  <div class="add-white">
    <a-modal
      :title="title"
      :visible="addVisible"
      @cancel="addWhiteCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="addWhiteHandle"
    >
      <a-form :form="form" >
        <a-form-item
          label="姓名"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            @click="teacherSelect"
            placeholder="请点击选择姓名"
            v-decorator="[
              'userName',
              {initialValue: userName,rules: [{ required: true, message: '请点击选择姓名' }]}
            ]"
            readOnly
          />
        </a-form-item>
        <a-form-item
          label="有效期至"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-date-picker
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            v-decorator="[
              'expirationTime',
              {
                initialValue: appForm.expirationTime, rules: [{ required: true, message: '请选择有效期' }]}
            ]"
            placeholder="请选择有效期"
          />
        </a-form-item>
        <a-form-item
          label="请选择楼栋楼层"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-cascader
            :options="buildList"
            @change="onChange"
            :loadData="loadData"
            v-decorator="[
              'value',
              {initialValue: [], rules: [{ required: placeholder === '请选择楼栋楼层' ? true : false, message: '请选择楼栋楼层' }]}
            ]"
            :placeholder="placeholder"
            changeOnSelect/>
        </a-form-item>
        <a-form-item
          label="原因"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-input
            v-decorator="[
              'reason',
              {initialValue: appForm.reason,rules: [{ required: true, message: '请输入原因' }]}
            ]"
            placeholder="请输入原因"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <choose-user
      ref="chooseUser"
      is-radio
      :bind-obj="bindObj"
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="选择教职工">
    </choose-user>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import BindTeacher from './BindTeacher'
import ChooseUser from '@c/ChooseUser'
export default {
  components: {
    BindTeacher,
    ChooseUser
  },
  props: {
    refBuildList: {
      type: Object,
      default: function () {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      userTag: false,
      confirmLoading: false,
      moment,
      expirationTime: '',
      userName: '',
      buildList: [],
      bindObj: {},
      placeholder: '请选择楼栋楼层',
      form: this.$form.createForm(this),
      addVisible: false,
      searchForm: {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName'),
        page: 1,
        start: 0,
        size: 20,
        categoryCode: ''
      },
      teacherInfo: [],
      appForm: {
        buildingName: '',
        buildingCode: '',
        floorName: '',
        floorCode: ''
      },
      whiteId: '',
      userCode: ''
    }
  },
  mounted () {
    this.buildGet()
  },
  methods: {
    ...mapActions('orgTree',
      ['getBuildNode', 'getBuildChildNode']),
    ...mapActions('invadeRecord', [ 'addList', 'updateList' ]),
    // 绑定教室下拉框
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      this.searchForm.pCode = selectedOptions[0].categoryCode
      targetOption.loading = true
      this.getBuildChildNode(this.searchForm).then(res => {
        targetOption.loading = false
        const data = res.data
        targetOption.children = this.filterSearch(0, data)
        this.buildList = [...this.buildList]
      })
    },
    buildGet () {
      this.getBuildNode(sessionStorage.getItem('schoolScheme')).then(res => {
        this.buildList = this.filterSearch(1, res.data)
      })
    },
    filterSearch (type, data) {
      if (type) {
        data.forEach(el => {
          this.$set(el, 'value', el.categoryCode)
          this.$set(el, 'label', el.categoryName)
          this.$set(el, 'isLeaf', false)
        })
      } else {
        data.forEach(el => {
          this.$set(el, 'value', el.categoryCode)
          this.$set(el, 'label', el.categoryName)
        })
      }
      return data
    },
    onChange (value, obj) {
      this.length = obj.length
      this.appForm.buildingName = obj[0].label
      this.appForm.buildingCode = obj[0].value
      if (obj.length === 2) {
        this.appForm.floorName = obj[1].label
        this.appForm.floorCode = obj[1].value
      } else {
        this.appForm.floorName = ''
        this.appForm.floorCode = ''
      }
    },
    teacherSelect () {
      this.userTag = true
    },
    async chooseUser(values) {
      console.log(values)
      this.teacherInfo = values[0]
      this.userName = values[0].userName
      this.userCode = values[0].userCode
      this.$refs.chooseUser.reset()
    },
    addWhiteCancel () {
      this.addVisible = false
    },
    addWhiteHandle (e) {
      this.confirmLoading = true
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          value.expirationTime = moment(value.expirationTime).format('YYYY-MM-DD HH:mm:ss')
          value.schoolCode = sessionStorage.getItem('schoolScheme')
          value.createUserName = JSON.parse(sessionStorage.getItem('loginInfo')).userName
          value.createUserCode = JSON.parse(sessionStorage.getItem('loginInfo')).userCode
          value.listType = '0'
          value.gender = this.teacherInfo.sex
          /*           value.sysSourceCode = localStorage.getItem('appCode')
          value.sysSourceName = localStorage.getItem('appName') */
          value.userCode = this.userCode
          value.photoList = this.teacherInfo.length === 0 ? this.appForm.photoList : [this.teacherInfo.photoUrl]
          if (this.title === '编辑') {
            value.id = this.appForm.id
            this.updateList({
              ...this.appForm,
              ...value
            }).then(res => {
              this.$message.success('编辑成功')
              this.confirmLoading = false
              this.addVisible = false
              this.$tools.goNext(() => {
                this.$emit('updata')
              })
            }).catch(() => {
              this.confirmLoading = false
            })
          } else {
            console.log(value)
            this.addList({
              ...value,
              ...this.appForm
            }).then(res => {
              this.$message.success('添加成功')
              this.confirmLoading = false
              this.addVisible = false
              this.$tools.goNext(() => {
                this.$emit('updata')
              })
            }).catch(() => {
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ant-input-number{
  width: 100%;
}
.ant-calendar-picker{
  width:100%!important;
}
</style>
