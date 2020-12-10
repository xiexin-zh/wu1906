<template>
  <a-modal
    width="1200px"
    title="绑定设备"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <search-form isReset @search-form="searchForm" :search-label="searchLabel">
      <template v-slot:place>
        <a-form-item label="绑定场地">
          <a-cascader
            :options="buildList"
            @click.stop="onFocus"
            :loadData="loadData"
            placeholder="请选择绑定场地"
            v-decorator="['places']"
          />
        </a-form-item>
        <a-form-item label="关联数据">
          <a-cascader
            :options="classList"
            @click.stop="classOnFocus"
            :loadData="classLoadData"
            placeholder="请选择关联数据"
            v-decorator="['classes']"
          />
        </a-form-item>
      </template>
    </search-form>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          :scroll-h="500"
          :page-list="pageList"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        >
          <template v-slot:other1="record"> {{ record.record.gradeName }}{{ record.record.className }} </template>
        </table-list>
        <page-num
          :jumper="false"
          v-model="pageList"
          :mar-top="20"
          :mar-bot="0"
          size="small"
          :total="total"
          @change-page="getList"
        ></page-num>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb qui-fx-ac">
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
import PageNum from '@c/PageNum'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
import $ajax from '@u/ajax-serve'
import hostEnv from '@config/host-env'
import { mapState } from 'vuex'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    width: '15%'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '网络相机' : '面板机'
    }
  },
  {
    title: 'SN码',
    dataIndex: 'deviceSn',
    width: '10%'
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '在线' : '离线'
    }
  },
  {
    title: '绑定场地',
    dataIndex: 'placeName',
    width: '20%'
  },
  {
    title: '安装位置',
    dataIndex: 'site',
    width: '10%',
    customRender: text => {
      return parseInt(text) === 1 ? '室内' : '室外'
    }
  },
  {
    title: '关联数据',
    dataIndex: 'gradeName',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  }
]
const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: '2',
        val: '面板机'
      },
      {
        key: '1',
        val: '网络相机'
      }
    ],
    value: 'deviceType',
    type: 'select',
    label: '设备类型'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '在线'
      },
      {
        key: 2,
        val: '离线'
      }
    ],
    value: 'deviceStatus',
    type: 'select',
    label: '设备状态'
  }
]
export default {
  name: 'ChooseClasscards',
  components: {
    PageNum,
    TableList,
    SearchForm
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    chooseType: {
      type: String,
      default: ''
    },
    bindObj: {
      type: Array,
      default: () => {
        return []
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
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      searchLabel,
      userList: [],
      totalList: [],
      buildList: [],
      classList: [],
      searchObj: {}
    }
  },
  async mounted() {
    if (this.chooseType === 'classCard') {
      this.bindObj.forEach(item => {
        this.chooseList.push(item.key)
        this.totalList.push({
          id: item.key,
          deviceName: item.label,
          deviceSn: item.deviceSn
        })
      })
    }
    this.getList()
  },
  methods: {
    async onFocus(value) {
      this.buildList = []
      const res = await $ajax.get({
        url: `${hostEnv.protal_api_10050}/place/manage/getFirstStagePlaceList`,
        params: {
          schoolCode: this.userInfo.schoolCode
        }
      })
      this.buildList = res.data
      this.buildList.forEach(el => {
        el.label = el.name
        el.value = el.id
        el.isLeaf = false
      })
    },
    async loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
        params: {
          parentId: targetOption.id,
          schoolCode: this.userInfo.schoolCode
        }
      })
      targetOption.loading = false
      targetOption.children = res.data.list
      // 处理第三层没有子节点的情况
      targetOption.children.forEach(el => {
        el.label = el.name + (el.type === '2' ? '楼' : '')
        el.value = el.id
        el.isLeaf = el.type === '3'
      })
      targetOption.children.unshift({
        label: '全部',
        value: ''
      })
      this.buildList = [...this.buildList]
    },
    async classOnFocus(value) {
      this.classList = []
      const res = await $ajax.postForm({
        url: `${hostEnv.protal_api_11002}/grade/manage/list`,
        params: {
          schoolCode: this.userInfo.schoolCode
        }
      })
      this.classList = res.data.list
      this.classList.forEach(el => {
        el.label = el.name
        el.value = el.code
        el.isLeaf = false
      })
    },
    async classLoadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11002}/classManage/list`,
        params: {
          gradeCode: targetOption.code,
          schoolCode: this.userInfo.schoolCode
        }
      })
      targetOption.loading = false
      targetOption.children = res.data.list
      targetOption.children.forEach(el => {
        el.label = el.className
        el.value = el.classCode
        el.isLeaf = true
      })
      targetOption.children.unshift({
        label: '全部',
        value: ''
      })
      this.classList = [...this.classList]
    },
    async getList(type = false) {
      const res = await $ajax.post({
        url: `${hostEnv.protal_api_11009}/classcard/bind/list`,
        params: {
          ...this.pageList,
          ...this.searchObj,
          schoolCode: this.userInfo.schoolCode,
          placeId: this.searchObj.places ? this.searchObj.places.join(',') : undefined,
          gradeCode: this.searchObj.classes ? this.searchObj.classes[0] : undefined,
          classCode: this.searchObj.classes ? this.searchObj.classes[1] : undefined
        }
      })
      this.userList = res.data.list.map(item => {
        return {
          ...item,
          id: item.id.toString()
        }
      })
      this.total = res.data.total
    },
    searchForm(values) {
      console.log(values)
      this.searchObj = values
      this.getList()
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
      console.log(item)
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
          console.log(this.totalList)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    },
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择班牌')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
    }
  }
}
</script>

<style lang="less" scoped>
.choose-user {
  height: 600px;
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
</style>
