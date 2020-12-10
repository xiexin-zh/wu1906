<template>
  <div class="service-list">
    <submit-form
      ref="service"
      @submit-form="serviceForm"
      title="设备分组"
      v-model="serviceStatus"
      :form-data="serviceData"
    ></submit-form>
    <div class="title qui-fx-ac">
      <div class="qui-fx-f1 qui-fx-jc">设备分组</div>
      <div style="width: 60px;" class="qui-tx-c" @click="actionService(false)">
        <a-icon type="plus-circle" />
      </div>
    </div>
    <a-skeleton
      style="padding: 0 15px"
      v-if="tabList.length == 0"
      active
      :paragraph="{ rows: 10 }"
    />
    <ul>
      <li
        v-for="(list, index) in tabList"
        :key="list.key"
        :class="['qui-fx-ac', { act: currentIndex === index }]"
      >
        <div @click="changeTab(list, index)" class="qui-fx-f1 qui-fx-jc qui-te">{{ list.val }}</div>
        <div style="width: 60px;" class="qui-tx-c">
          <span v-if="currentIndex === index">
            <a-icon type="form" @click="actionService(true, list)" />
            <a-icon
              v-if="index != 0"
              type="delete"
              @click="delList(list.id, index)"
              style="color:rgb(255, 85, 0);padding-left: 8px"
            />
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
    value: 'deviceGroupName',
    initValue: '',
    type: 'input',
    label: '设备分组名称',
    readonly: false,
    required: true,
    placeholder: '请输入设备分组名称'
  }
]
export default {
  name: 'VerticalTab',
  components: {
    SubmitForm,
    NoData
  },

  computed: {
    ...mapState('home', ['userInfo'])
  },
  data() {
    return {
      tabList: [],
      serviceStatus: false,
      serviceData,
      currentIndex: 0
    }
  },
  mounted() {
    this.showService()
  },
  methods: {
    ...mapActions('home', ['addDeviceGroup', 'delDeviceGroup', 'groupList', 'updateDeviceGroup']),
    showService() {
      this.groupList({
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName
      }).then(res => {
        if (res.data.length === 0) return
        this.tabList = res.data.map(item => {
          return {
            ...item,
            key: item.deviceGroupCode,
            val: item.deviceGroupName
          }
        })
        if (!this.isFirst) this.$emit('change', this.tabList[0])
        this.$emit('getList', this.tabList)
      })
    },
    delList(id, index) {
      console.log(index)
      this.$tools.delTip('确定删除吗?', () => {
        this.delDeviceGroup({
          id: id
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
    actionService(type, item) {
      this.isEdit = type
      this.serviceStatus = true
      if (type) {
        this.id = item.id
        this.deviceGroupCode = item.deviceGroupCode
        this.serviceData = this.$tools.fillForm(this.serviceData, item)
      } else {
        this.serviceData = serviceData
      }
    },
    serviceForm(values) {
      let msg, fun
      if (this.isEdit) {
        msg = '编辑成功'
        fun = 'updateDeviceGroup'
      } else {
        msg = '新增成功'
        fun = 'addDeviceGroup'
      }
      this[fun]({
        ...values,
        id: this.id,
        deviceGroupCode: this.deviceGroupCode,
        schoolCode: this.userInfo.schoolCode,
        schoolName: this.userInfo.schoolName
      })
        .then(res => {
          this.isFirst = 'no'
          this.$message.success(msg)
          this.$refs.service.reset()
          this.$tools.goNext(() => {
            this.showService()
          })
        })
        .catch(() => {
          this.$refs.service.error()
        })
    },
    changeTab(item, index) {
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
        color: #666;
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
