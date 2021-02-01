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
    <u-search-form class="u-mar-b10" :search-label="columnList.deviceSearchLabel" @search="searchForm"></u-search-form>
    <div class="choose-device u-fx">
      <div class="u-fx-ver u-fx-f1">
        <u-table
          :scroll-h="500"
          :is-check="isCheck"
          :is-radio="isRadio"
          is-zoom
          :page-list="pageList"
          v-model="chooseList"
          :columns="(editControlType || chooseType === 'door') ? columnList.doorDeviceColumns : columnList.deviceColumns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="deviceList"
        >
          <template v-slot:actions="actions">
            <div v-if="editControlType">
              <a-switch
                @click.native.stop
                @change="controlTypeCilck($event, actions.record)"
                checked-children="是"
                un-checked-children="否"
                v-model="actions.record.controlType"
              />
            </div>
            <div v-if="chooseType === 'door'">
              {{ actions.record.controlType === 1 ? '是' : '否' }}
            </div>
          </template>
        </u-table>
        <div class="u-fx-je">
          <u-pagination :total="total" v-model="pageList" @change="getDeviceList"></u-pagination>
        </div>
      </div>
      <div class="device-box u-fx-ver">
        <div class="title u-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="u-fx-f1 u-auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.deviceSn" class="u-fx-jsb u-fx-ac">
              <span>{{ item.deviceName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
import columnList from '../../asstes/js/choose-data-colums'

export default {
  name: 'ChooseDevice',
  components: {},
  props: {
    // 学校编码
    schoolCode: {
      type: String,
      default: ''
    },
    // 更新方式 false：更新所有，true：新增和删除分开更新
    updateType: {
      type: Boolean,
      default: false
    },
    // 允许选择空数据,默认不允许
    allowEmpty: {
      type: Boolean,
      default: false
    },
    // 弹出框标题
    title: {
      type: String,
      default: '选择设备'
    },
    // 打开弹窗
    value: {
      type: Boolean,
      default: false
    },
    // 是否为单选
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否为多选
    isCheck: {
      type: Boolean,
      default: false
    },
    // 是否为过滤模式
    filterChoose: {
      type: Boolean,
      default: false
    },
    // 选择设备模式： 默认从控制中心选择，可选从门禁选择，值为door
    chooseType: {
      type: String,
      default: ''
    },
    // 编辑设备是否校门门禁属性
    editControlType: {
      type: Boolean,
      default: false
    },
    // 已选择数据回显
    bindList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
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
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchObj: {},
      total: 0,
      columnList,
      deviceList: [],
      totalList: [],
      oldTotalList: []
    }
  },
  async mounted() {
    console.log(this.bindList)
    this.chooseList = this.bindList.map((el) => el.deviceSn)
    if (!this.filterChoose) {
      this.totalList = this.bindList.map((el) => {
        return {
          ...el,
          id: el.deviceSn
        }
      })
    }
    if (this.updateType) {
      this.oldTotalList = JSON.parse(JSON.stringify(this.totalList))
    }
    this.getDeviceList()
  },
  methods: {
    async getDeviceList() {
      let res = null
      if (this.chooseType === 'door') {
        res = await $ajax.post({
          url: `/protal_v3_10162/setting/device/info/query`,
          params: {
            schoolCode: this.schoolCode,
            ...this.searchObj,
            pageNum: this.pageList.page,
            pageSize: this.pageList.size
          }
        })
      } else {
        res = await $ajax.post({
          url: `/protal_api_10090/device/info/queryDeviceInfos`,
          params: {
            schoolCode: this.schoolCode,
            ...this.pageList,
            ...this.searchObj
          }
        })
      }
      this.deviceList = res.data.list.map((ele) => {
        return {
          ...ele,
          deviceId: ele.id,
          id: ele.deviceSn,
          controlType: this.editControlType ? true : ele.controlType
        }
      })
      if (this.editControlType) {
        this.bindList.forEach(ele => {
          const index = this.deviceList.findIndex(list => list.deviceSn === ele.deviceSn)
          if (index !== -1) {
            this.deviceList[index].controlType = ele.controlType === 1
          }
        })
      }
      if (this.filterChoose) {
        this.chooseList.forEach((ele) => {
          const index = this.deviceList.findIndex((list) => list.deviceSn === ele)
          if (index !== -1) this.deviceList[index].disabled = true
        })
      }
      this.total = res.data.total
    },
    controlTypeCilck(value, e) {
      const index = this.totalList.findIndex((list) => list.id === e.id)
      if (index !== -1) {
        this.totalList[index].controlType = value
      }
    },
    searchForm(values) {
      this.searchObj = values
      this.getDeviceList()
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
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
        item.forEach((item) => {
          const index = this.totalList.findIndex((list) => {
            return list.deviceSn === item.deviceSn
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (this.filterChoose && item.disabled) return
      console.log(item)
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
          console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex((list) => list.deviceSn === item.deviceSn)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0 && !this.allowEmpty) {
        this.$message.warning(`请${this.title}`)
        return
      }
      this.confirmLoading = true
      if (this.updateType) {
        const delList = this.oldTotalList.filter((item) => {
          return JSON.stringify(this.totalList).indexOf(item.id) === -1
        })
        const addList = this.totalList.filter((item) => {
          return JSON.stringify(this.oldTotalList).indexOf(item.id) === -1
        })
        this.$emit('submit', { delList, addList })
      } else {
        this.$emit('submit', this.totalList)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.choose-device {
  height: 600px;
  .device-box {
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
</style>
