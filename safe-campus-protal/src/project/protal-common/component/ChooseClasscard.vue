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
    <no-data class="u-fx-ac-jc" style="width: 300px" v-if="noData" msg="暂无数据，请去发布对象添加设备~"></no-data>
    <div v-else>
      <div class="choose-user qui-fx">
        <div class="qui-fx-ver qui-fx-f1">
          <table-list
            is-check
            :scroll-h="500"
            v-model="chooseList"
            :columns="columns"
            @clickRow="clickRow"
            @selectAll="selectAll"
            :table-list="tableList"
          >
            <template v-slot:other2="record">{{ record.record.gradeName }}{{ record.record.className }}</template>
          </table-list>
        </div>
        <div class="user-box qui-fx-ver">
          <div class="title qui-fx-jsb">
            <span>已选择</span>
            <span>{{ totalList.length }}个</span>
          </div>
          <div class="qui-fx-f1" style="overflow: auto">
            <ul>
              <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb qui-fx-ac">
                <span>{{ item.gradeName }}{{ item.className }}</span>
                <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <a-form :form="form">
          <a-form-item label="选择全屏展示的时间：" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <a-range-picker
              v-decorator="[
                'time',
                {
                  initialValue: [appForm.startTime, appForm.endTime],
                  rules: [{ required: true, message: '请选择时间' }]
                }
              ]"
              :showTime="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              @change="onChange"
              @ok="onOk"
            />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-modal>
</template>

<script>
import NoData from '@c/NoData'
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
const columns = [
  {
    title: '序号',
    width: '25%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '绑定场地',
    dataIndex: 'placeName',
    width: '25%'
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '25%',
    customRender: text => {
      return parseInt(text) === 1 ? '室内' : '室外'
    }
  },
  {
    title: '关联数据',
    dataIndex: 'className',
    width: '25%',
    scopedSlots: {
      customRender: 'other2'
    }
  }
]
export default {
  name: 'ChooseSubteacher',
  components: {
    TableList,
    NoData
  },
  props: {
    isCheck: {
      type: Boolean,
      default: true
    },
    chooseType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    mediaCode: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    bindObj: {
      type: Object,
      default: () => {
        return {}
      }
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
  data() {
    return {
      confirmLoading: false,
      noData: false,
      chooseList: [],
      columns,
      tableList: [],
      totalList: [],
      form: this.$form.createForm(this),
      appForm: {}
    }
  },
  created() {
    this.totalList = this.bindObj.deviceList
    this.bindObj.deviceList.forEach(item => {
      this.chooseList.push(item.id)
    })
    this.appForm = {
      startTime: this.bindObj.startTime
        ? moment(new Date(this.bindObj.startTime), 'YYYY-MM-DD HH:MM')
        : moment(new Date(), 'YYYY-MM-DD HH:MM'),
      endTime: this.bindObj.endTime
        ? moment(new Date(this.bindObj.endTime), 'YYYY-MM-DD HH:MM')
        : moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 'YYYY-MM-DD HH:MM')
    }
    this.showList()
  },
  async mounted() {},
  methods: {
    ...mapActions('home', ['getDeviceData']),
    async showList() {
      const req = {
        mediaCode: this.mediaCode
      }
      const res = await this.getDeviceData(req)
      if (!res.data || res.data.list.length === 0) {
        this.noData = true
        return
      }
      this.tableList = res.data.list
    },
    searchForm(values) {
      this.searchList = values
      this.showList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    resetBtn() {
      this.keyword = ''
      this.deviceType = ''
      this.getControlList()
    },
    error() {
      this.confirmLoading = false
    },
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    onChange(value, dateString) {
      this.appForm.startTime = dateString[0]
      this.appForm.endTime = dateString[1]
    },
    onOk(value) {
      this.appForm.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm')
      this.appForm.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm')
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择设备')
        return
      }
      if (!this.appForm.startTime || !this.appForm.endTime) {
        this.$message.warning('请选择全屏展示的时间')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList, this.appForm)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 500px;
  .org-box {
    width: 200px;
  }
  .user-box {
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
/deep/ .ant-modal-body {
  padding: 14px;
}
</style>
