<template>
  <div class="edit-build">
    <a-modal
      title="修改楼栋"
      :visible="editBuildVisible"
      @cancel="editBuildCancel"
      :footer="null"
    >
      <a-form :form="editBuildForm" >
        <a-form-item
          label="修改名称"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'categoryName',
              {rules: [{ required: true, message: '请输入楼栋名称' }]}
            ]"
          />
        </a-form-item>
        <a-form-item style="margin-top:24px">
          <div :style="{ textAlign: 'right' }">
            <a-button @click="editBuildCancel" style="margin-right:10px">取消</a-button>
            <a-button
              type="primary"
              html-type="submit"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
              @click="editBuildHandle"
            >
              确定
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      editBuildForm: this.$form.createForm(this),
      editBuildVisible: false,
      state: {
        time: 60,
        loginBtn: false,
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  props: {
    refBuildList: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    ...mapActions('roomManage', [ 'editBuild' ]),
    // 编辑楼栋
    editBuildCancel () {
      this.editBuildVisible = false
    },
    modifyBuild (categoryName) {
      this.editBuildVisible = true
      this.$nextTick(() => {
        this.editBuildForm.setFieldsValue({
          categoryName: categoryName
        })
      })
    },
    editBuildHandle () {
      this.state.loginBtn = true
      this.editBuildForm.validateFields((err, value) => {
        value.schoolCode = sessionStorage.getItem('schoolScheme')
        value.categoryType = '2'
        value.id = this.refBuildList.currentId
        if (!err) {
          this.editBuild(value).then(res => {
            this.state.loginBtn = false
            this.$message.success('修改成功')
            this.editBuildVisible = false
            this.$tools.goNext(() => {
              this.refBuildList.getBuildList()
            })
          }).catch(() => {
            this.$tools.goNext(() => {
              this.state.loginBtn = false
            })
          })
        } else {
          this.$tools.goNext(() => {
            this.state.loginBtn = false
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
