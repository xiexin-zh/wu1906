<template>
  <a-modal
    :title="title"
    v-model="status"
    :destroyOnClose="true"
    :maskClosable="false"
    width="760px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
  >
    <a-form :form="form">
      <a-form-item label="区域名称：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-input
          :maxLength="20"
          v-decorator="[
            'areaName',
            {
              initialValue: appForm.areaName,
              rules: [{ required: true, message: '请填写区域名称' }]
            }
          ]"
          placeholder="请填写区域名称"
        />
      </a-form-item>
      <a-form-item label="终端号/IP：" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" required>
        <div>
          <a-button icon="plus" class="add-btn" @click="add">添加</a-button>
          <span>注：至少添加一个</span>
        </div>
        <div class="project-box">
          <div v-for="list in project" :key="list.key">
            <div class="qui-fx">
              <a-input style="width:90%" v-model="list.ip" placeholder="请输入"></a-input>
              <div class="del-index mar-l10" @click="delJcx(list)"><a-icon type="delete" /></div>
            </div>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  areaName: 'AddArea',
  components: {
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      zbCount: 0,
      areaName: '',
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {},
      scoreId: '',
      project: [],
      disabled: false,
      regex: false,
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  methods: {
    ...mapActions('home', ['addRadioArea', 'radioAreaDetail', 'updateRadioArea']),
    async _radioAreaDetail(areaCode) {
      this.detailId = areaCode
      const res = await this.radioAreaDetail(areaCode)
      this.appForm.areaName = res.data.areaName
      this.project = res.data.ipList.map((el, index) => {
        return {
          key: index,
          ip: el
        }
      })
      this.zbCount = res.data.ipList.length
    },
    // 添加指标和内容
    add() {
      const { zbCount, project } = this
      const newData = {
        key: zbCount,
        ip: ''
      }
      this.project = [...project, newData]
      this.zbCount = zbCount + 1
    },
    // 删除检查项
    delJcx(list) {
      this.project = this.project.filter(i => i !== list)
    },
    regexForm() {
      console.log(123, this.project)
      this.project.map(el => {
        console.log('el', el)
        if (el.length === 0 || !el.ip) {
          this.regex = true
        } else {
          this.regex = false
        }
      })
    },
    // 提交
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.regexForm()
        this.isLoad = false
        if (!error) {
          if (this.project.length === 0) {
            this.$message.warning('请添加终端号/IP')
            return
          }
          values.schoolCode = this.userInfo.schoolCode
          this.isLoad = true
          if (this.regex) {
            this.$message.warning('请添加完整的终端号/IP')
            this.isLoad = false
            return false
          } else {
            values.ipList = this.project.map(el => el.ip)
          }
          if (this.detailId) {
            values.areaCode = this.detailId
            this.updateRadioArea(values)
              .then(res => {
                this.status = false
                this.isLoad = false
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$emit('update')
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            this.addRadioArea(values)
              .then(res => {
                this.status = false
                this.isLoad = false
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$emit('update')
                })
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.project-box {
  max-height: 500px;
  overflow-y: scroll;
  .del-index {
    color: @tip-color;
    cursor: pointer;
  }
}
</style>
