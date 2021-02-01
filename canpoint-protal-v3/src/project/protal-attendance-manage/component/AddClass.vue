<template>
  <a-modal
    width="1000px"
    title="添加班次"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form" :style="{ maxHeight: maxHeight }">
      <a-form-item label="班次名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 15 }">
        <a-input
          placeholder="请输入班次名称"
          :maxLength="15"
          v-decorator="['shiftName', { initialValue: shiftName, rules: [{ required: true, message: '请输入班次名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="打卡时间" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" :required="true">
        <div class="u-tips-color">类型：一天两次上下班，每个时间必填。打卡时间范围不能交叉，且需包含该次上下班时间。</div>
        <a-table
          :columns="columns"
          :dataSource="data"
          :bordered="true"
          :pagination="false"
          class="table"
        >
          <template slot="other1" slot-scope="text, record">
            <div class="action u-fx-jsa u-fx-ac">
              <template>
                {{ record.title }}
                <a-time-picker
                  :allowClear="false"
                  format="HH:mm"
                  :disabledHours="val => getDisabledHours(val, record.id, 'time')"
                  :disabledMinutes="val => getDisabledMinutes(val, record.id, 'time')"
                  :defaultValue="moment(record.time, 'HH:mm')"
                  @change="(val, dateStrings) => changeTime(val, dateStrings, 'time', record.id)"
                />
              </template>
            </div>
          </template>
          <template slot="other2" slot-scope="text, record">
            <div class="action u-fx-jsa u-fx-ac">
              <template>
                <a-time-picker
                  :allowClear="false"
                  format="HH:mm"
                  :defaultValue="moment(record.startTime, 'HH:mm')"
                  :disabledHours="val => getDisabledHours(val, record.id, 'startTime')"
                  :disabledMinutes="val => getDisabledMinutes(val, record.id, 'startTime')"
                  @change="(val, dateStrings) => changeTime(val, dateStrings, 'startTime', record.id)"
                />
                <span>至</span>
                <a-time-picker
                  :allowClear="false"
                  format="HH:mm"
                  :disabledHours="val => getDisabledHours(val, record.id, 'endTime')"
                  :disabledMinutes="val => getDisabledMinutes(val, record.id, 'endTime')"
                  :defaultValue="moment(record.endTime, 'HH:mm')"
                  @change="(val, dateStrings) => changeTime(val, dateStrings, 'endTime', record.id)"
                />
                可打卡
              </template>
            </div>
          </template>
          <template slot="other3" slot-scope="text, record">
            <div class="action u-fx-jsa u-fx-ac">
              <template>
                <a-switch
                  v-model="record.checked"
                  checked-children="是"
                  un-checked-children="否"
                  @change="onChange($event,record)"
                  :disabled="parseInt(record.id) === 0"/>
              </template>
            </div>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '上下班时间',
    align: 'center',
    dataIndex: 'weekDay',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '打卡时间限制',
    dataIndex: 'accessTime',
    align: 'center',
    scopedSlots: {
      customRender: 'other2'
    }
  },
  {
    title: '是否需要打卡',
    dataIndex: 'accessTime1',
    align: 'center',
    scopedSlots: {
      customRender: 'other3'
    }
  }
]
export default {
  name: 'AddClass',
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      moment,
      maxHeight: window.screen.height - 280 + 'px',
      columns,
      data: [
        {
          key: 1,
          id: 0,
          title: '上午上班'
        },
        {
          key: 2,
          id: 1,
          title: '上午下班'
        },
        {
          key: 3,
          id: 2,
          title: '下午上班'
        },
        {
          key: 4,
          id: 3,
          title: '下午下班'
        }
      ],
      form: this.$form.createForm(this),
      shiftName: '',
      confirmLoading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    classObg: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
  },
  methods: {
    ...mapActions('home', ['addShiftManage', 'updateShiftManage']),
    // 添加提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const arr = []
          this.data.forEach((element, index) => {
            if (element.time <= element.startTime || element.time >= element.endTime || element.startTime >= element.endTime) {
              arr.push(1)
            }
            if (index < 3) {
              if (this.data[index].time >= this.data[index + 1].time || this.data[index].startTime >= this.data[index + 1].startTime || this.data[index].endTime >= this.data[index + 1].endTime) {
                arr.push(1)
              }
            }
            if (index !== 0) {
              if (this.data[index].startTime <= this.data[index - 1].endTime) {
                arr.push(1)
              }
            }
          })
          if (arr.indexOf(1) > -1) {
            this.$message.warning('请填写正确的时间')
            return false
          }
          const shiftRuleDtoList = this.data.map(el => {
            return {
              hasValid: el.checked ? '1' : '0',
              workTime: el.time,
              startTime: el.startTime,
              endTime: el.endTime
            }
          })
          const req = {
            ...values,
            name: values.shiftName,
            schoolCode: this.schoolCode,
            shiftRuleDtoList: shiftRuleDtoList
          }
          this.confirmLoading = true
          if (this.classId) {
            req.id = this.classId
            this.updateShiftManage(req)
              .then(res => {
                this.$message.success('编辑成功')
                this.$tools.goNext(() => {
                  this.confirmLoading = false
                  this.status = false
                  this.$emit('update')
                })
              })
              .catch(() => {
                this.confirmLoading = false
              })
          } else {
            this.addShiftManage(req)
              .then(res => {
                this.$message.success('添加成功')
                this.$tools.goNext(() => {
                  this.confirmLoading = false
                  this.status = false
                  this.$emit('update')
                })
              })
              .catch(() => {
                this.confirmLoading = false
              })
          }
        }
      })
    },
    // 上下班时间的改变
    changeTime(val, dateStrings, type, id) {
      this.data[id][type] = dateStrings
    },
    // 限制小时
    getDisabledHours(val, id, string) {
    },
    // 限制分钟
    getDisabledMinutes(selectedHour, id, string) {
    },
    // switch的改变
    onChange(e, record) {
      if (record.id === 1) {
        this.data[2].checked = this.data[1].checked
      } else if (record.id === 2) {
        this.data[1].checked = this.data[2].checked
      }
    }
  }
}
</script>

<style lang="less" scoped>
.set-group {
  .table {
    min-height: 300px;
    overflow: auto;
  }
}
</style>
