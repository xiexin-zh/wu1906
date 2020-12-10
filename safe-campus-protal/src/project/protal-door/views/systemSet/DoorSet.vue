<template>
  <div class="page-layout qui-fx-ver" id="tableList">
    <choose-user
      ref="user"
      v-if="chooseTag"
      @submit="submitUser"
      is-check
      v-model="chooseTag"></choose-user>
    <choose-control
      ref="chooseControl"
      is-check
      v-if="controlTag"
      v-model="controlTag"
      :schoolCode="userInfo.schoolCode"
      @submit="submitControl"
      title="添加控制组">
    </choose-control>
    <search-form v-if="false" is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left"></div>
    </search-form>
    <a-table
      style="margin-top: 10px"
      :pagination="false"
      :rowKey="record => record.id"
      :columns="columns"
      :dataSource="doorList"
      :scroll="{y: this.$tools.setScroll('tableList')}"
    >
      <template slot="index" slot-scope="text, record, index">{{ index + 1 }}</template>
      <template slot="controlGroupList" slot-scope="text,record">
        <div v-for="(control, index) in text" :key="index" class="control-list">
          <delete-tag @delTag="del(control,record)" :tag-info="userDeal(1,control)"></delete-tag>
        </div>
      </template>
      <template slot="userInfoList" slot-scope="text,record">
        <div v-for="(user, index) in text" :key="index" class="control-list">
          <delete-tag @delTag="delUser(user,record)" :tag-info="userDeal(0,user)"></delete-tag>
        </div>
      </template>
      <template slot="actions" slot-scope="text">
        <a-tag @click="addUser(1,text)">绑定设备</a-tag>
        <a-tag @click="addUser(0,text)">添加门卫</a-tag>
      </template>
    </a-table>
  </div>
</template>

<script>
import DeleteTag from '@c/DeleteTag'
import ChooseUser from '@c/ChooseUser'
import ChooseControl from '@c/ChooseControl'
import SearchForm from '@c/SearchForm'
import { mapState, mapActions } from 'vuex'
const searchLabel = [
  // {
  //   value: 'userName', // 表单属性
  //   type: 'input', // 表单类型
  //   label: '门卫姓名', // 表单label值
  //   placeholder: '请输入姓名' // 表单默认值(非必选字段)
  // }
  {
    list: [ // 选择列表项，select控件必传
      {
        key: '',
        val: '全部'
      },
      {
        key: '01',
        val: '小学'
      },
      {
        key: '02',
        val: '初中'
      },
      {
        key: '03',
        val: '高中'
      }
    ],
    value: 'placeCode',
    type: 'select',
    label: '出入口'
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
    title: '出入口',
    dataIndex: 'placeName',
    width: '15%'
  },
  {
    title: '门禁设备',
    dataIndex: 'controlGroupList',
    width: '25%',
    scopedSlots: {
      customRender: 'controlGroupList'
    }
  },
  {
    title: '门卫姓名',
    dataIndex: 'userInfoList',
    width: '25%',
    scopedSlots: {
      customRender: 'userInfoList'
    }
  },
  {
    title: '操作',
    width: '25%',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]
export default {
  name: 'DoorSet',
  components: {
    SearchForm,
    DeleteTag,
    ChooseUser,
    ChooseControl
  },
  data() {
    return {
      chooseTag: false,
      controlTag: false,
      columns,
      searchLabel,
      doorList: [],
      placeCode: '',
      pageList: {
        pageNum: 1,
        pageSize: 10000000
      }
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getDoorList()
  },
  methods: {
    ...mapActions('home', [
      'getDoorSet', 'addDoor', 'delDoor', 'addControl', 'delControl', 'getPlace'
    ]),
    async placeGet() {
      const req = {
        category: '103',
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getPlace(req)
      this.searchLabel[0].list = res.data.map(el => {
        el.key = el.code
        el.val = el.name
        return el
      })
    },
    userDeal(type, user) {
      if (type) {
        return {
          name: user.controlGroupName,
          ...user
        }
      } else {
        return {
          name: user.userName,
          ...user
        }
      }
    },
    async getDoorList() {
      this.pageList.schoolCode = this.userInfo.schoolCode
      this.pageList.placeType = '103'
      const res = await this.getDoorSet(this.pageList)
      this.doorList = res.data.map(item => {
        return {
          ...item,
          id: item.placeCode
        }
      })
    },
    addUser(type, text) {
      if (type) {
        this.controlTag = true
      } else {
        this.chooseTag = true
      }
      this.placeCode = text.placeCode
    },
    del(control, record) {
      const req = {
        placeCode: record.placeCode,
        schoolCode: this.userInfo.schoolCode,
        controlGroupCode: control.controlGroupCode
      }
      this.delControl(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.getDoorList()
        })
      })
    },
    delUser(user, record) {
      const req = {
        placeCode: record.placeCode,
        schoolCode: this.userInfo.schoolCode,
        userCode: user.userCode
      }
      this.delDoor(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.getDoorList()
        })
      })
    },
    searchForm(value) {
      this.pageList.placeCode = value.placeCode
      this.getDoorList()
    },
    submitUser(item) {
      const userList = item.map(el => {
        el.userType = '1'
        return el
      })
      const req = {
        placeCode: this.placeCode,
        schoolCode: this.userInfo.schoolCode,
        userList: userList
      }
      this.addDoor(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.user.reset()
          this.getDoorList()
        })
      })
    },
    submitControl(item) {
      const req = {
        placeCode: this.placeCode,
        schoolCode: this.userInfo.schoolCode,
        controlGroupList: item
      }
      this.addControl(req).then(res => {
        this.$message.success('操作成功')
        //   this.$refs.chooseControl.reset()
        this.$tools.goNext(() => {
          this.getDoorList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.control-list {
  display: inline-block;
  margin: 0 10px 10px 0;
}
</style>
