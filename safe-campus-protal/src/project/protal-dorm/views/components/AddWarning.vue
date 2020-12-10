<template>
  <div class="add-build">
    <a-modal
      title="添加入侵场地"
      :visible="addVisible"
      @cancel="addBuildCancel"
      :maskClosable="false"
      :destroyOnClose="true"
      :confirmLoading="confirmLoading"
      width="650px"
      @ok="addBuildHandle"
    >
      <a-form :form="form" >
        <a-form-item
          label="请选择场地"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-cascader
            :options="buildList"
            @change="onChange"
            :loadData="loadData"
            v-decorator="[
              'value',
              {initialValue: [], rules: [{ required: placeholder === '请选择场地' ? true : false, message: '请选择场地' }]}
            ]"
            :placeholder="placeholder"
            changeOnSelect/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
  },
  data () {
    return {
      confirmLoading: false,
      expirationTime: '',
      userName: '',
      buildList: [],
      placeholder: '请选择场地',
      form: this.$form.createForm(this),
      addVisible: false,
      searchForm: {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        schoolName: sessionStorage.getItem('schoolName'),
        categoryCode: ''
      },
      appForm: {
        buildingName: '',
        buildingCode: '',
        floorName: '',
        floorCode: ''
      },
      whiteId: ''
    }
  },
  mounted () {
    this.buildGet()
  },
  methods: {
    ...mapActions('orgTree',
      ['getBuildNode', 'getBuildChildNode']),
    ...mapActions('invadeRecord', [ 'addAlarmList', 'updateList' ]),
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
      this.appForm.buildingName = obj[0].label
      this.appForm.buildingCode = obj[0].value
      if (obj.length === 2) {
        this.appForm.floorName = obj[1].label
        this.appForm.floorCode = obj[1].value
      }
    },
    teacherSelect () {
      this.$refs.bindTeacher.bindVisible = true
    },
    addBuildCancel () {
      this.addVisible = false
    },
    addBuildHandle (e) {
      this.confirmLoading = true
      e.preventDefault()
      this.form.validateFields((err, value) => {
        if (!err) {
          value.schoolCode = sessionStorage.getItem('schoolScheme')
          this.addAlarmList({
            ...this.appForm,
            ...value
          }).then(res => {
            this.$message.success('操作成功')
            this.confirmLoading = false
            this.addVisible = false
            this.$tools.goNext(() => {
              this.$emit('updata')
            })
          }).catch(() => {
            this.confirmLoading = false
          })
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
