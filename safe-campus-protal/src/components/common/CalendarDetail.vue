<template>
  <a-modal
    width="1200px"
    :title="title"
    v-model="status"
  >
    <a-row type="flex" justify="end" style="margin-bottom: 15px; margin-right: 215px">
      <a-col>
        <span>姓名/学号：</span>
      </a-col>
      <a-col>
        <span>姓名/学号：</span>
      </a-col>
      <a-col>
        <span>姓名/学号：</span>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
      :page-list="pageList" :columns="columns" :table-list="userList"
        ></table-list>
      </div>
    </div>
  </a-modal>
</template>

<script>
import TableList from './TableList'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import hostEnv from '@config/host-env'
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
    width: '20%'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: '15%',
    customRender: text => {
      return parseInt(text) === 1 ? '男' : '女'
    }
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '照片',
    dataIndex: 'photoUrl',
    width: '30%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  }
]
export default {
  name: 'CalendarDetail',
  components: {
    TableList
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
  },
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
  mounted() {
  },
  data() {
    return {
      pageList: {
        page: 1,
        size: 20
      },
      total: 0,
      columns,
      userList:[]
    }
  },
  methods: {

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
