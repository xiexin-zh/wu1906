<template>
  <div class="service-list">
    <submit-form ref="service" @submit-form="serviceForm" title="新增识别服务" v-model="serviceStatus" :form-data="serviceData">
    </submit-form>
    <div class="title qui-fx-ac">
      <div class="qui-fx-f1 qui-fx-jc">
        识别服务列表
      </div>
      <div style="width: 60px;" class="qui-tx-c" @click="actionService(false)">
        <a-icon type="plus-circle" />
      </div>
    </div>
    <a-skeleton style="padding: 0 15px" v-if="tabList.length == 0" active :paragraph="{rows: 10}" />
    <ul>
      <li v-for="(list, index) in tabList" :key="list.key" :class="['qui-fx-ac', {'act': currentIndex === index}]">
        <div @click="changeTab(list, index)" class="qui-fx-f1 qui-fx-jc qui-te">{{ list.val }}</div>
        <div style="width: 60px;" class="qui-tx-c">
          <span v-if="currentIndex === index">
            <a-icon type="form" @click="actionService(true, list)" />
            <a-icon type="delete" @click="delList(list.serverCode, list.id,index)" style="color:rgb(255, 85, 0);padding-left: 8px" />
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import SubmitForm from '@c/SubmitForm'
import NoData from '@c/NoData'
import { mapState, mapActions } from 'vuex'
const serviceData = [
  {
    value: 'serverName',
    initValue: '',
    type: 'input',
    label: '服务名称',
    readonly: false,
    required: true,
    max: 30, // 最大长度
    placeholder: '请输入识别服务名称'
  },
  {
    value: 'serverIp',
    initValue: '',
    type: 'input',
    label: '服务IP',
    readonly: false,
    required: true,
    max: 30, // 最大长度
    regular: 'ip', // 正则验证
    placeholder: '请输入识别服务IP'
  },
  {
    value: 'remarks',
    initValue: '',
    type: 'input',
    label: '服务描述',
    readonly: false,
    required: false,
    max: 30, // 最大长度
    placeholder: '请输入识别服务描述'
  }
]
export default {
  name: 'VerticalTab',
  components: {
    SubmitForm,
    NoData
  },
  computed: {
    ...mapState('home', [
      'schoolCode'
    ])
  },
  data () {
    return {
      tabList: [],
      serviceStatus: false,
      serviceData,
      currentIndex: 0
    }
  },
  mounted () {
    this.showService()
  },
  methods: {
    ...mapActions('home', [
      'getServerInfo',
      'addIdentServerInfo',
      'updateIdentServerInfo',
      'delIdentServerInfo'
    ]),
    showService () {
      this.getServerInfo({
        page: 1,
        size: 40,
        schoolCode: this.schoolCode
      }).then(res => {
        if (res.data.list.length === 0) return
        this.tabList = res.data.list.map(item => {
          return {
            ...item,
            key: item.serverCode,
            val: item.serverName
          }
        })
        if (!this.isFirst) this.$emit('change', this.tabList[0])
      })
    },
    delList (serverCode, id, index) {
      this.$tools.delTip('确定删除吗?', () => {
        this.delIdentServerInfo({
          id: id,
          serverCode: serverCode,
          schoolCode: this.schoolCode
        }).then(res => {
          this.$message.success('删除成功')
          this.tabList.splice(index, 1)
          if (this.currentIndex === index) {
            this.currentIndex = 0
            this.$emit('change', this.tabList[0])
          }
        })
      })
    },
    actionService (type, item) {
      this.isEdit = type
      this.serviceStatus = true
      if (type) {
        this.id = item.id
        this.serverCode = item.serverCode
        this.serviceData = this.$tools.fillForm(this.serviceData, item)
      } else {
        this.serviceData = serviceData
      }
    },
    serviceForm (values) {
      let msg, fun
      if (this.isEdit) {
        msg = '编辑成功'
        fun = 'updateIdentServerInfo'
      } else {
        msg = '新增成功'
        fun = 'addIdentServerInfo'
      }
      this[fun]({
        ...values,
        id: this.id,
        serverCode: this.serverCode,
        schoolCode: this.schoolCode
      }).then(res => {
        this.isFirst = 'no'
        this.$message.success(msg)
        this.$refs.service.reset()
        this.$tools.goNext(() => {
          this.showService()
        })
      }).catch(() => {
        this.$refs.service.error()
      })
    },
    changeTab (item, index) {
      this.currentIndex = index
      this.$emit('change', item)
    }
  }
}
</script>

<style lang="less" scoped>
  .service-list {
    .title {
      padding: 0 10px;
      color: @main-color;
      font-size: 16px;
      font-weight: bold;
      height: 45px;
      text-align: center;
      line-height: 45px;
      background-color: #fafafa;
    }
    i {
      font-size: 16px;
      color: @main-color;
    }
    ul {
      width: 100%;
      li {
        height: 42px;
        padding: 0 10px;
        line-height: 42px;
        cursor: pointer;
        text-align: center;
        border-bottom: 1px @bor-color solid;
        position: relative;
        &.act {
          background-color: #e6f7ff;
          color:#666;
          &::before {
            position: absolute;
            content: '';
            border: 8px#666 solid;
            border-top: 8px transparent solid;
            border-right: 8px transparent solid;
            border-bottom: 8px transparent solid;
            top: 14px;
            left: 15px;
            width: 0;
            height: 0;
          }
        }
      }
    }
  }
</style>
