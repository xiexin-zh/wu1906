<template>
  <div class="area-add page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form :form="form">
        <a-form-item label="地点名称：" v-bind="formItemLayout">
          <a-input
            v-decorator="[
              'address',
              {
                initialValue: appForm.address,
                rules: [{ required: true, message: '请填写地点名称' }]
              }
            ]"
            placeholder="请填写地点名称"
          />
        </a-form-item>
        <a-form-item label="巡查二维码类型" v-bind="formItemLayout">
          <a-radio-group
            disabled
            v-decorator="[
              'qrType',
              {
                initialValue: appForm.qrType,
                rules: [{ required: true, message: '请选择巡查二维码类型' }]
              }
            ]"
          >
            <a-radio value="1">静态二维码（固定不变）</a-radio>
            <a-radio value="0">动态二维码（巡查二维码每小时更新一次）</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="巡查任务类型：" v-bind="formItemLayout" required>
          <a-checkbox-group v-model="appForm.taskTypeCodes">
            <a-checkbox value="1">日常巡查</a-checkbox>
            <a-checkbox value="2">设备巡检</a-checkbox>
            <a-checkbox value="3">安全护导</a-checkbox>
          </a-checkbox-group>
          <div class="qui-fx">
            <div class="qui-fx-f1">
              <div class="project-box" v-if="appForm.taskTypeCodes.indexOf('1') !== -1">
                <a-checkbox-group v-model="checkList">
                  <div class="qui-fx">
                    <div class="left">日常巡查：</div>
                    <div class="qui-fx-f1 content-box">
                      <a-collapse default-active-key="1" expand-icon-position="right">
                        <a-collapse-panel key="1" :style="customStyle" header="常规检查">
                          <div class="qui-fx-ac">
                            检查事项：
                            <a-button
                              icon="plus"
                              class="add-btn"
                              size="small"
                              @click="add(1,'normalCount','normalList')"
                            >添加</a-button>
                            <a-button
                              icon="export"
                              class="export-btn"
                              size="small"
                              @click="check(1)"
                            >预设事项</a-button>
                          </div>
                          <div v-for="item in normalItem" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                class="del-action-btn mar-l10"
                                icon="delete"
                                size="small"
                                @click="del(item,'normalItem')"
                              ></a-button>
                            </div>
                          </div>
                          <div v-for="item in normalList" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                size="small"
                                class="del-action-btn mar-l10"
                                icon="delete"
                                @click="del(item,'normalList')"
                              ></a-button>
                            </div>
                          </div>
                          <a-checkbox value="1" slot="extra" @click.stop="handleClick"></a-checkbox>
                        </a-collapse-panel>
                        <a-collapse-panel key="2" :style="customStyle" header="安全检查">
                          <div class="qui-fx-ac">
                            检查事项：
                            <a-button
                              icon="plus"
                              class="add-btn"
                              size="small"
                              @click="add(2,'safeCount','safeList')"
                            >添加</a-button>
                            <a-button
                              icon="export"
                              class="export-btn"
                              size="small"
                              @click="check(2)"
                            >预设事项</a-button>
                          </div>
                          <div v-for="item in safeItem" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                size="small"
                                class="del-action-btn mar-l10"
                                icon="delete"
                                @click="del(item,'safeItem')"
                              ></a-button>
                            </div>
                          </div>
                          <div v-for="item in safeList" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                size="small"
                                class="del-action-btn mar-l10"
                                icon="delete"
                                @click="del(item,'safeList')"
                              ></a-button>
                            </div>
                          </div>
                          <a-checkbox value="2" slot="extra" @click.stop="handleClick"></a-checkbox>
                        </a-collapse-panel>
                        <a-collapse-panel key="3" :style="customStyle" header="卫生检查">
                          <div class="qui-fx-ac">
                            检查事项：
                            <a-button
                              icon="plus"
                              class="add-btn"
                              size="small"
                              @click="add(3,'healthCount','healthList')"
                            >添加</a-button>
                            <a-button
                              icon="export"
                              class="export-btn"
                              size="small"
                              @click="check(3)"
                            >预设事项</a-button>
                          </div>
                          <div v-for="item in healthItem" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                size="small"
                                class="del-action-btn mar-l10"
                                icon="delete"
                                @click="del(item,'healthItem')"
                              ></a-button>
                            </div>
                          </div>
                          <div v-for="item in healthList" :key="item.key">
                            <div class="qui-fx-ac mar-l80">
                              <a-input style="width:80%" v-model="item.contents"></a-input>
                              <a-button
                                size="small"
                                class="del-action-btn mar-l10"
                                icon="delete"
                                @click="del(item,'healthList')"
                              ></a-button>
                            </div>
                          </div>
                          <a-checkbox value="3" slot="extra" @click.stop="handleClick"></a-checkbox>
                        </a-collapse-panel>
                      </a-collapse>
                    </div>
                  </div>
                </a-checkbox-group>
              </div>
              <div v-if="appForm.taskTypeCodes.indexOf('2') > -1" class="table-box qui-fx">
                <div class="left">设备巡检：</div>
                <table-list
                  class="qui-fx-f1 content-box"
                  :columns="areaColumns.columns"
                  :table-list="areaColumns.equipList"
                  v-if="appForm.taskTypeCodes.indexOf('2') > -1"
                ></table-list>
              </div>
              <div class="project-box qui-fx" v-if="appForm.taskTypeCodes.indexOf('3') > -1">
                <div class="left">安全护导：</div>
                <div class="qui-fx-f1 content-box">
                  <div class="qui-fx-ac">
                    <span class="tip mar-l5">*</span>
                    护导事项：
                    <a-button
                      icon="plus"
                      class="add-btn"
                      size="small"
                      @click="add(4,'guardCount','guardList')"
                    >添加</a-button>
                  </div>
                  <div v-for="item in guardList" :key="item.key">
                    <div class="qui-fx-ac mar-l80">
                      <a-input style="width:80%" v-model="item.contents"></a-input>
                      <a-button
                        size="small"
                        class="del-action-btn mar-l10"
                        icon="delete"
                        @click="del(item,'guardList')"
                      ></a-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center'}">
          <a-button @click="cancel">取消</a-button>
          <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
        </a-form-item>
      </a-form>
      <inspect-item ref="inspectItem" @chooseTree="chooseTree" :type="type"></inspect-item>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import InspectItem from '../../component/InspectItem'
import areaColumns from '../../assets/js/table/areaColumns'
import moment from 'moment'

export default {
  name: 'AreaAdd',
  components: {
    TableList,
    InspectItem
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      areaColumns,
      zbCount: 0,
      contents: '',
      isLoad: false,
      form: this.$form.createForm(this),
      appForm: {
        qrType: '1',
        NFC: '4',
        taskTypeCodes: []
      },
      normalList: [],
      safeList: [],
      healthList: [],
      guardList: [],
      normalCount: 0,
      safeCount: 0,
      healthCount: 0,
      guardCount: 0,
      checkType: '1',
      normalItem: [],
      safeItem: [],
      healthItem: [],
      type: 0,
      checkList: [],
      detailId: '',
      customStyle:
        'background: #F5F5FB;border-radius: 4px;margin-bottom: 10px;border: 0;overflow: scroll;max-height:230px'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['addInspect', 'inspectDetail', 'updateInspect']),
    moment,
    handleClick(event) {
      event.stopPropagation()
    },
    async showDetail() {
      const res = await this.inspectDetail(this.detailId)
      const data = res.data
      this.appForm = data
      this.guardList = data.safeList.map((el, index) => {
        return {
          contents: el,
          key: index
        }
      })
      this.guardCount = data.safeList.length
      const dayList = data.dayList
      dayList.map((el, index) => {
        if (el.contents.length !== 0) {
          this.checkList.push(el.checkType)
        }
      })
      this.normalList = this.filterDate(dayList, '1', 'normalCount')
      this.safeList = this.filterDate(dayList, '2', 'safeCount')
      this.healthList = this.filterDate(dayList, '3', 'healthCount')
    },
    filterDate(dayList, type, count) {
      const arr = dayList.filter((el) => el.checkType === type)[0].contents
      this[count] = arr.length
      return arr.map((el, index) => {
        return {
          contents: el,
          key: index
        }
      })
    },
    // 添加
    add(type, count, list) {
      const newData = {
        key: this[count],
        checkType: type
      }
      this[list] = [...this[list], newData]
      this[count] = this[count] + 1
    },
    // 删除
    del(list, string) {
      this[string] = this[string].filter((i) => i !== list)
    },
    check(type) {
      this.type = type
      this.$refs.inspectItem.visible = true
      this.$refs.inspectItem.checkedKeys = []
    },
    // 树选择预设事项
    chooseTree(data) {
      if (this.type === 1) {
        this.normalItem = data
      } else if (this.type === 2) {
        this.safeItem = data
      } else {
        this.healthItem = data
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          if (this.appForm.taskTypeCodes.length === 0) {
            this.$message.warning('请选择巡检任务类型')
            return false
          }
          // 校验安全护导
          if (this.appForm.taskTypeCodes.indexOf('3') > -1 && this.guardList.length === 0) {
            this.$message.warning('请添加安全护导事项')
            return false
          }
          values.safeList = this.guardList.map((el) => el.contents)
          if (values.safeList.indexOf(undefined) > -1) return this.$message.warning('请填写安全护导事项')
          let arr = []
          if (this.checkList.length === 3) {
            arr = arr
              .concat(this.normalList)
              .concat(this.safeList)
              .concat(this.healthList)
              .concat(this.normalItem)
              .concat(this.safeItem)
              .concat(this.healthItem)
          } else if (this.checkList.length === 1 && this.checkList.indexOf('1') > -1) {
            arr = arr.concat(this.normalList).concat(this.normalItem)
          } else if (this.checkList.length === 2 && this.checkList.indexOf('3') === -1) {
            arr = arr.concat(this.normalList).concat(this.safeList).concat(this.normalItem).concat(this.safeItem)
          } else if (this.checkList.length === 2 && this.checkList.indexOf('2') === -1) {
            arr = arr.concat(this.normalList).concat(this.healthList).concat(this.normalItem).concat(this.healthItem)
          } else if (this.checkList.length === 2 && this.checkList.indexOf('1') === -1) {
            arr = arr.concat(this.safeList).concat(this.safeItem).concat(this.healthList).concat(this.healthItem)
          } else if (this.checkList.length === 1 && this.checkList.indexOf('3') > -1) {
            arr = arr.concat(this.healthList).concat(this.healthItem)
          } else if (this.checkList.length === 1 && this.checkList.indexOf('2') > -1) {
            arr = arr.concat(this.safeList).concat(this.safeItem)
          } else if (this.checkList.length === 0) {
            arr = []
          }
          const normal = []
          const safe = []
          const health = []
          arr.map((el) => {
            if (el.checkType === 1) {
              normal.push(el.contents)
            } else if (el.checkType === 2) {
              safe.push(el.contents)
            } else {
              health.push(el.contents)
            }
          })

          // 校验日常巡查
          if (this.appForm.taskTypeCodes.indexOf('1') > -1 && this.checkList.length === 0) {
            return this.$message.warning('请勾选检查项，并添加检查事项')
          }
          if (
            (this.appForm.taskTypeCodes.indexOf('1') > -1 &&
              normal.indexOf(undefined) > -1 &&
              this.checkList.indexOf('1') > -1) ||
            (this.appForm.taskTypeCodes.indexOf('1') > -1 && normal.length === 0 && this.checkList.indexOf('1') > -1)
          ) {
            return this.$message.warning('请填写常规检查事项')
          }

          if (
            (this.appForm.taskTypeCodes.indexOf('1') > -1 &&
              safe.indexOf(undefined) > -1 &&
              this.checkList.indexOf('2') > -1) ||
            (this.appForm.taskTypeCodes.indexOf('1') > -1 && safe.length === 0 && this.checkList.indexOf('2') > -1)
          ) {
            return this.$message.warning('请填写安全检查事项')
          }
          if (
            (this.appForm.taskTypeCodes.indexOf('1') > -1 &&
              health.indexOf(undefined) > -1 &&
              this.checkList.indexOf('3') > -1) ||
            (this.appForm.taskTypeCodes.indexOf('1') > -1 && health.length === 0 && this.checkList.indexOf('3') > -1)
          ) {
            return this.$message.warning('请填写卫生检查事项')
          }
          values.dayList = [
            {
              checkType: '1',
              contents: normal
            },
            {
              checkType: '2',
              contents: safe
            },
            {
              checkType: '3',
              contents: health
            }
          ]
          values.schoolCode = this.userInfo.schoolCode
          values.taskTypeCodes = this.appForm.taskTypeCodes
          this.isLoad = true
          if (!this.detailId) {
            this.addInspect(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
                this.isLoad = false
              })
          } else {
            values.id = this.detailId
            this.updateInspect(values)
              .then((res) => {
                this.$message.success('操作成功')
                this.$tools.goNext(() => {
                  this.$router.go(-1)
                })
              })
              .catch((res) => {
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
.area-add {
  padding: 20px;
  .content {
    height: calc(100% - 100px);
    overflow-y: scroll;
  }
  .left {
    width: 80px;
  }
  .mar-l5 {
    margin-left: 5px;
  }
  .mar-l80 {
    margin-left: 80px;
    margin-top: 10px;
  }
  .content-box {
    border: 1px solid #ccc;
    padding: 15px 20px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .project-box {
    .del-index {
      color: @tip-color;
      cursor: pointer;
    }
  }
  .ant-calendar-picker {
    width: 100% !important;
  }
  .tip {
    color: #f5222d;
    font-weight: bold;
    margin-right: 5px;
  }
}
.ant-checkbox-group {
  width: 100%;
}
/deep/ .ant-collapse-extra {
  float: left !important;
  margin-right: 10px;
}
</style>
