<template>
  <div class="page-layout qui-fx-ver">
    <choose-user
      ref="user"
      v-if="chooseTag"
      @submit="submitUser"
      is-check
      v-model="chooseTag"></choose-user>
    <div class="top-btn-group">
      <a-button icon="plus" class="add-btn" @click="addUser">新增门卫</a-button>
      说明：门卫拥有【设备管理】中所有门禁设备任意时间的通行权限
    </div>
    <table-list :columns="columns" :table-list="doorList" is-zoom>
      <template v-slot:actions="actions">
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(actions.record)">
          <template slot="title">
            您确定删除吗?
          </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </table-list>
  </div>
</template>

<script>
import DeleteTag from '@c/DeleteTag'
import ChooseUser from '@c/ChooseUser'
import TableList from '@c/TableList'
import { mapState, mapActions } from 'vuex'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '门卫姓名',
    dataIndex: 'userName',
    width: '15%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '10%',
    customRender: text => {
      if (parseInt(text) === 1) {
        return '男'
      } else if (parseInt(text) === 2) {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  {
    title: '组织机构',
    dataIndex: 'orgName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    width: '15%'
  },
  {
    title: '工号',
    dataIndex: 'userNo',
    width: '15%'
  },
  {
    title: '人脸照片',
    dataIndex: 'photoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'photoPic'
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'DoorSet',
  components: {
    DeleteTag,
    ChooseUser,
    TableList
  },
  data() {
    return {
      chooseTag: false,
      columns,
      doorList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.getDoorList()
  },
  methods: {
    ...mapActions('home', [ 'getDoorSet', 'addDoor', 'delDoor' ]),
    async getDoorList() {
      const res = await this.getDoorSet(this.userInfo.schoolCode)
      this.doorList = res.data
    },
    addUser () {
      this.chooseTag = true
    },
    del(record) {
      this.delDoor(record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.getDoorList()
        })
      })
    },
    submitUser(item) {
      if (item.length === 0) {
        this.$message.warning('请选择')
        this.$refs.user.error()
        return false
      }
      const userList = item.map(el => {
        el.schoolCode = this.userInfo.schoolCode
        return el
      })
      this.addDoor(userList).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.user.reset()
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
