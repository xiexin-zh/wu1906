<template>
  <a-modal
    width="1200px"
    title="选择下属机构"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-row type="flex" justify="start" style="margin-bottom: 15px;">
      <a-col>
        <span>机构名称/编码：</span>
        <a-input
          v-model="keyWord"
          style="width: 200px;margin-right: 20px"
          placeholder="请输入机构名称/编码"
        />
      </a-col>
      <a-col>
        <a-button type="primary" @click="getStudentList(true)">查询</a-button>
        <a-button type="default" @click="resetBtn">重置</a-button>
      </a-col>
    </a-row>
    <div class="choose-user qui-fx">
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          is-check
          is-zoom
          :scroll-h="500"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="userList"
        ></table-list>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb qui-fx-ac">
              <span>{{ item.eduName }}</span>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { mapActions } from 'vuex'
import TableList from '@c/TableList'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '机构名称',
    dataIndex: 'eduName',
    width: '40%'
  },
  {
    title: '机构编码',
    dataIndex: 'eduCode',
    width: '40%'
  }
]
export default {
  name: 'BindInstitute',
  components: {
    TableList
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    schoolInfo: {
      type: Object,
      default: () => {
        return {}
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
      keyWord: '',
      total: 0,
      columns,
      userList: [],
      totalList: []
    }
  },
  async mounted() {
    this.getStudentList()
  },
  methods: {
    ...mapActions('home', ['getUnbindEdu']),
    changePage() {
      this.getStudentList()
    },
    async getStudentList() {
      const req = {
        areaCode: this.schoolInfo.level === '3' ? this.schoolInfo.areaCode : '',
        cityCode: this.schoolInfo.level === '2' ? this.schoolInfo.cityCode : '',
        provinceCode: this.schoolInfo.level === '1' ? this.schoolInfo.provinceCode : '',
        keyWord: this.keyWord,
        type: this.schoolInfo.level === '3' ? '1' : '2',
        level: this.schoolInfo.level,
        eduCode: this.schoolInfo.eduCode
      }
      const res = await this.getUnbindEdu(req)
      this.userList = res.data
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    resetBtn() {
      this.keyWord = ''
      this.getStudentList()
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
    submitOk() {
      if (this.totalList.length === 0) {
        this.$message.warning('请选择机构')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', this.totalList)
      this.reset()
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
