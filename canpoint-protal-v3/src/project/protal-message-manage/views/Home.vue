<template>
  <div class="home page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-alert
        closable
        type="error"
        message="温馨提示"
        description="在此界面可以新增和删除学生"
      ></u-alert>
      <u-search-form :search-label="searchLabel" @search="search">
        <div slot="left">
          <u-space>
            <u-button
              icon="plus"
              @click="change"
              type="primary"
            >新增设备</u-button
            >
            <u-button @click="change" type="default">标签</u-button>
            <u-button @click="change" type="light">排序</u-button>
          </u-space>
        </div>
        <div slot="right"></div>
      </u-search-form>
      <u-space class="u-fx-ac">
        已选择 {{ chooseList.length }} 项数据
        <u-button type="light">排序</u-button>
        <u-button
          type="danger"
          :disabled="chooseList.length === 0"
        >批量解绑班主任</u-button
        >
        <u-button
          type="danger"
          :disabled="chooseList.length === 0"
        >批量解绑教师</u-button
        >
      </u-space>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        is-check
        :width="40"
        :height="40"
        is-zoom
        :page-list="pageList"
        :columns="columns"
        :table-list="userList"
        v-model="chooseList"
      >
        <template v-slot:slotOne="slotOne">{{ slotOne.record.age }}</template>
        <template v-slot:actions="actions">
          <u-button type="link">详情</u-button>
          <u-button type="link">权限</u-button>
          <u-button type="link">编辑</u-button>
          <u-button type="link" delete>删除</u-button>
        </template>
      </u-table>
    </div>
    <u-pagination
      justify="end"
      v-model="pageList"
      :total="total"
      @change="getList"
    ></u-pagination>
  </div>
</template>

<script>
import $http from '@u/libs/ajax-serve'
import { getDataState } from '@u/libs/data-state'
const searchLabel = [
  {
    value: 'name', // 表单属性
    type: 'input', // 表单类型
    label: '姓名', // 表单label值
    placeholder: '请输入姓名' // 表单默认值(非必选字段)
  },
  {
    value: 'keyword', // 分类查询
    type: 'selectInput', // 表单类型
    selectType: [
      {
        key: 1,
        val: '姓名'
      },
      {
        key: 2,
        val: '工号'
      }
    ],
    placeholder: '请输入' // 表单默认值(非必选字段)
  },
  {
    list: [
      // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: 1,
        val: '开启'
      },
      {
        key: 2,
        val: '关闭'
      }
    ],
    value: 'status',
    type: 'select',
    label: '状态'
  },
  {
    value: 'dateTime', // 单个日期
    type: 'singleTime',
    label: '日期'
  },
  {
    value: 'rangeTime', // 日期区间
    type: 'rangeTime',
    label: '起始时间'
  }
]
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '10%'
  },
  {
    title: '年龄',
    width: '10%',
    scopedSlots: {
      customRender: 'slotOne'
    }
  },
  {
    title: '身份类型',
    width: '10%',
    dataIndex: 'type',
    customRender: text => {
      return getDataState('personType', text)
    }
  },
  {
    title: '照片',
    width: '15%',
    dataIndex: 'phoneOne',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '抓拍照片',
    width: '15%',
    dataIndex: 'phoneTwo',
    scopedSlots: {
      customRender: 'snapPic'
    }
  },
  {
    title: '操作',
    width: '30%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      searchLabel,
      userList: [],
      columns,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      list: ['删除', '配置', '更多信息']
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    change() {
      alert('点击了按钮')
    },
    async getList() {
      const res = await $http.get({
        url: 'http://42.194.220.14:3000/mock/18/getTableList',
        params: {
          ...this.pageList
        }
      })
      this.userList = res.data
      this.total = res.total
    },
    search(values) {
      alert(values)
    }
  }
}
</script>
<style lang="less" scoped></style>
