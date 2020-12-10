<template>
  <a-modal width="1200px" title="选择场地" v-model="status" @ok="submitOk" :maskClosable="false" :destroyOnClose="true">
    <div class="choose-user qui-fx">
      <div class="place-tree">
        <place-tree @select="select"></place-tree>
      </div>
      <div class="qui-fx-ver qui-fx-f1">
        <table-list
          :is-check="isCheck"
          :scroll-h="500"
          v-model="chooseList"
          :columns="columns"
          @clickRow="clickRow"
          @selectAll="selectAll"
          :table-list="roomList"
        >
          <template v-slot:other1="other1">
            <a-tag :color="parseInt(other1.record.hasDorm) === 1 ? '#87d068' : '#2db7f5'">{{
              $tools.hasDorm(other1.record.hasDorm)
            }}</a-tag>
          </template>
        </table-list>
      </div>
      <div class="user-box qui-fx-ver">
        <div class="title qui-fx-jsb">
          <span>已选择场地</span>
          <span>{{ totalList.length }}个</span>
        </div>
        <div class="qui-fx-f1" style="overflow: auto">
          <ul>
            <li v-for="(item, index) in totalList" :key="item.id" class="qui-fx-jsb">
              <div>{{ item.placeName }}{{ item.floorName }}{{ item.roomName }}</div>
              <a-tag @click="delUser(item.id, index)" color="#f50">删除</a-tag>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import TableList from './TableList'
import $ajax from '@u/ajax-serve'
import { mapState } from 'vuex'
import PlaceTree from './PlaceTree'
import hostEnv from '@config/host-env'
const columns = [
  {
    title: '序号',
    width: '20%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '楼栋',
    dataIndex: 'placeName',
    width: '25%'
  },
  {
    title: '楼层',
    dataIndex: 'floorName',
    width: '25%'
  },
  {
    title: '房间',
    dataIndex: 'roomName',
    width: '25%'
  }
]
export default {
  name: 'ChoosePlace',
  components: {
    TableList,
    PlaceTree
  },
  props: {
    isAll: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: true
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
  async mounted() {},
  data() {
    return {
      chooseList: [],
      columns,
      roomList: [],
      totalList: []
    }
  },
  methods: {
    delUser(id, index) {
      this.totalList.splice(index, 1)
      this.chooseList.splice(this.chooseList.indexOf(id), 1)
    },
    async select(obj) {
      this.chooseItem = {
        placeId: obj.node.$parent.eventKey || '',
        placeName: obj.node.$parent.title || '',
        floorId: obj.node.eventKey,
        floorName: obj.node.title
      }
      if (!obj.node.$parent.eventKey) {
        this.$message.warning('请选择楼层进行查询')
        return
      }
      const req = {
        schoolCode: this.userInfo.schoolCode,
        parentId: obj.node.eventKey
      }
      this.getRoomList(req)
    },
    getRoomList(req) {
      $ajax
        .post({
          url: `${hostEnv.protal_api_10050}/place/manage/getPlaceManageList`,
          params: req
        })
        .then(res => {
          this.roomList = res.data.list.map(item => {
            return {
              id: item.id,
              ...this.chooseItem,
              roomId: item.id,
              roomName: item.name
            }
          })
        })
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
      if (this.totalList.length === 0 && this.bindId === -1) {
        this.$message.warning('请选择场地')
        return
      }
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
    width: 260px;
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
