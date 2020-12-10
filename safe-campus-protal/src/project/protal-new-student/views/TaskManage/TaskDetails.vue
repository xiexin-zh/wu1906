<template>
  <div class="home page-layout qui-fx-ver">
    <div class="head-btn">
      <a-button type="primary" @click="editMsg"> 编辑 </a-button>
    </div>
    <div class="message-box">
      <div class="base-message message">
        <div class="title">基本信息</div>
        <div class="base-msg-table">
          <div class="table-list">
            <div class="msg-item" v-for="item in baseList" :key="item.id">
              <div class="name common">{{ item.name }}</div>
              <div class="text common">{{ item.text }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="project-message message">
        <div class="title">专业信息</div>
        <div class="project-msg-table">
          <TableList :columns="columns" :table-list="projectList" isBorder />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import Tools from '@u/tools'
// Tools.getDate(text)
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '专业',
    dataIndex: 'majorName'
  },
  {
    title: '招生人数',
    dataIndex: 'studentNum'
  }
]
export default {
  name: 'TaskDetails',
  components: {
    TableList
  },
  data() {
    return {
      baseList: [
        {
          id: '1',
          name: '任务名称',
          text: ''
        },
        {
          id: '2',
          name: '创建时间',
          text: ''
        },
        {
          id: '3',
          name: '年级',
          text: ''
        },
        {
          id: '4',
          name: '创建人',
          text: ''
        },
        {
          id: '5',
          name: '招生截止时间',
          text: ''
        }
      ],
      projectList: [],
      columns
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    const id = this.$route.query.id
    if (!id) {
      this.$router.push({
        path: '/taskManage'
      })
      return
    }
    this.showList(id)
  },
  methods: {
    ...mapActions('home', ['taskDetailById']),
    // 任务详情
    async showList(id) {
      const res = await this.taskDetailById(id)
      if (res && res.code === 200) {
        const { taskName, closingDate, createTime, createUserName, gradeNum, majorList } = res.data
        this.baseList = this.baseList.map((item, index) => {
          const arr = [taskName, Tools.getDate(createTime), gradeNum, createUserName, Tools.getDate(closingDate)]
          return {
            ...item,
            text: arr[index]
          }
        })
        this.projectList = majorList.map((item) => {
          return {
            ...item,
            id: item.majorCode
          }
        })
      }
    },
    // 编辑任务
    editMsg() {
      const id = this.$route.query.id
      this.$router.push({
        path: `/taskManage/addTask`,
        query: {
          id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px 40px;
}
.head-btn {
  width: 80%;
  margin: 0 auto;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.message-box {
  flex: 1;
  overflow-y: scroll;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 80%;
  height: 46px;
  padding: 0 10px;
  font-size: 16px;
  background: rgba(242, 242, 242, 1);
}
.message {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.base-message {
  padding: 30px 0;
  margin-bottom: 50px;

  .base-msg-table {
    display: flex;
    box-sizing: border-box;
    width: 80%;
    padding: 40px 100px;
    border: 1px solid rgba(242, 242, 242, 1);

    .table-list {
      display: flex;
      flex-wrap: wrap;
      flex: 1;

      .msg-item {
        display: flex;
        width: 50%;
        border: 1px solid #ccc;

        .common {
          box-sizing: border-box;
          height: 40px;
          padding: 0 8px;
        }

        .name {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 40%;
          background-color: rgba(242, 242, 242, 1);
        }
        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 60%;
        }
      }
      .msg-item {
        border-top: 0;
        border-left: 0;
      }
      .msg-item:nth-child(2n + 1) {
        border-top: 0;
        border-left: 1px solid #ccc;
      }
      .msg-item:nth-child(1) {
        border-top: 1px solid #ccc;
      }
      .msg-item:nth-child(2) {
        border-top: 1px solid #ccc;
      }
    }
  }
}

.project-message {
  padding: 30px 0;
  .project-msg-table {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    box-sizing: border-box;
    width: 80%;
    padding: 40px 100px;
    border: 1px solid rgba(242, 242, 242, 1);
  }

  /deep/ .ant-table-thead {
    background: rgba(242, 242, 242, 1);
  }
}
</style>
