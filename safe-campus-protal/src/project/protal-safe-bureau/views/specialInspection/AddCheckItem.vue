<template>
  <Modal title="添加检查项" ref="modal" @close="reset" @ok="submitOk">
    <a-form :form="form">
      <a-form-item label="检查项目：" v-bind="formItemLayout">
        <a-input
          :disabled="type==1"
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入检查项目' }]
            }
          ]"
          placeholder="请输入检查项目"
        />
      </a-form-item>
      <a-form-item label="检查指标：" v-bind="formItemLayout" required>
        <div class="qui-fx">
          <div class="qui-fx-f1">
            <div class="project-box">
              <div class="qui-fx-ac" v-if="!(type==1)">
                <a-button icon="plus" class="add-btn mar-b10" size="small" @click="add">添加检查指标</a-button>
              </div>
              <div v-for="(item,index) in normalList" :key="index">
                <div class="qui-fx checkIndex-box u-mar-b10">
                  <a-textarea
                    :disabled="type==1"
                    v-model="normalList[index].standardList"
                    placeholder="请输入检查指标内容"
                  />
                  <div v-if="!(type==1)" style="width:50px;margin-right:10px;" class="del-index mar-l10" @click="del(item)">删除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </Modal>
</template>
<script>
import Modal from '../../component/Modal'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'AddCheckItem',
  components: {
    Modal
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      appForm: {
        name: ''
      },
      form: this.$form.createForm(this),
      normalList: [],
      count: 0,
      type: '',
      detailId: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['addItem', 'itemDetail', 'eidtModity']),
    moment,
    async showDetail() {
      if (!this.detailId) return
      const res = await this.itemDetail(this.detailId)
      this.form.setFieldsValue({ name: res.data.name })
      this.normalList = res.data.children.map((v, index) => {
        return {
          key: index,
          standardList: v.name
        }
      })
    },
    // 添加
    add() {
      const { count, normalList } = this
      const newData = {
        key: count,
        standardList: ''
      }
      this.normalList = [...normalList, newData]
      this.count = count + 1
    },
    // 删除
    del(list) {
      this.normalList = this.normalList.filter(i => i !== list)
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      if (this.type === 1) {
        this.$refs.modal.visible = false
        return
      }
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.normalList.length === 0) return this.$message.warning('检查指标内容不能为空')
          const isEmpty = this.normalList.every(v => v.standardList)
          if (!isEmpty) return this.$message.warning('请完善检查指标内容')
          values.standardList = this.normalList.map(v => v.standardList)
          values.schoolCode = this.userInfo.schoolCode
          if (this.type === 0) {
            this.addItem(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$refs.modal.close()
                this.$parent.showList()
              })
              .catch(res => {
                this.isLoad = false
              })
          } else {
            values.id = this.detailId
            this.eidtModity(values)
              .then(res => {
                this.$message.success('操作成功')
                this.$parent.showList()
                this.$refs.modal.close()
              })
              .catch(res => {
                this.isLoad = false
              })
          }
        }
      })
    },
    // 置空
    reset() {
      this.form.setFieldsValue({ name: '' })
      this.normalList = []
    }
  },
  watch: {
    appForm: {
      handler(val) {
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.school-add {
  padding: 20px;
  .project-box {
    max-height: 400px;
    overflow-y: scroll;
    padding-top: 10px;
    .checkIndex-box{
      position: relative;
      .del-index {
        position: absolute !important;
        right: 0;
        top: 0;
        transform: translateX(100%);
        color: @tip-color;
        cursor: pointer;
      }
    }

  }
  .ant-calendar-picker {
    width: 100% !important;
  }
  .ant-checkbox-group {
    width: 100%;
  }
}
</style>
