<template>
  <div class="details">
    <div class="details-top details-main">
      <div class="title">
        <span>活动详情</span>
        <a-tooltip placement="topLeft" title="编辑">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click.stop="editDetails(action.record.id)"
          ></a-button>
        </a-tooltip>
      </div>
      <div class="content">
        <div class="table-list">
          <div class="msg-item" v-for="item in detailsMsg" :key="item.id">
            <div class="name common">{{ item.name }}</div>
            <div class="text common">{{ item.text }}</div>
          </div>
          <div class="msg-item item">
            <div class="name common">活动描述</div>
            <div class="text common">{{ description }}</div>
          </div>
          <div class="msg-item item">
            <div class="name common">活动内容</div>
            <div class="text common">{{ activityContent }}</div>
          </div>
          <div class="msg-item item">
            <div class="name common">{{ type === '1' ? '教研' : '备课' }}组教师名单</div>
            <div class="text common">{{ userStr }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="details-bottom details-main">
      <div class="title">
        <span>活动详情</span>
        <a-button icon="plus" class="add-btn" @click="addNote('')">添加活动纪要</a-button>
      </div>
      <div class="content">
        <table-list isBorder :columns="columns" :table-list="tableList">
          <template v-slot:actions="action">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addNote(action.record)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteList(action.record)"
            >
              <template slot="title"> 您确定删除吗? </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </template>
        </table-list>
      </div>
    </div>
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
    />
  </div>
</template>

<script>
import TableList from '../../../component/TableList'
import SubForm from '../../../component/SubForm'
import Tools from '@/utils/tools'
const columns = [
  {
    title: '序号',
    width: 80,
    align: 'center',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '活动开始时间',
    dataIndex: 'startTime',
    width: 120,
    align: 'center',
    customRender: (text) => {
      return Tools.getDate(text, 5)
    }
  },
  {
    title: '活动结束时间',
    dataIndex: 'endTime',
    width: 120,
    align: 'center',
    customRender: (text) => {
      return Tools.getDate(text, 5)
    }
  },
  {
    title: '活动纪要',
    dataIndex: 'content',
    align: 'center'
  },
  {
    title: '上传人',
    dataIndex: 'creatUser',
    align: 'center',
    width: 80
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    width: 120,
    align: 'center',
    customRender: (text) => {
      return Tools.getDate(text, 5)
    }
  },
  {
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const detailsMsg = [
  {
    id: '1',
    name: '年级',
    text: ''
  },
  {
    id: '2',
    name: '学期',
    text: ''
  },
  {
    id: '3',
    name: '专业',
    text: ''
  },
  {
    id: '4',
    name: '备课组',
    text: ''
  },
  {
    id: '5',
    name: '主持人',
    text: ''
  },
  {
    id: '6',
    name: '主讲人',
    text: ''
  },
  {
    id: '7',
    name: '活动日期',
    text: ''
  },
  {
    id: '8',
    name: '活动名称',
    text: ''
  },
  {
    id: '9',
    name: '活动地点',
    text: ''
  },
  {
    id: '10',
    name: '附件',
    text: ''
  }
]
const formData = [
  {
    value: 'startTime',
    initValue: '',
    type: 'singleTime',
    label: '活动开始时间',
    placeholder: '年/月/日'
  },
  {
    value: 'endTime',
    initValue: '',
    type: 'singleTime',
    label: '活动结束时间',
    placeholder: '年/月/日'
  },
  {
    value: 'content',
    initValue: '',
    type: 'textarea',
    label: '活动纪要',
    max: 500,
    rows: 6,
    placeholder: '请输入职务活动纪要(限500字内)'
  }
]
export default {
  name: 'Details',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  components: {
    TableList,
    SubForm
  },
  data() {
    return {
      columns,
      formData,
      formStatus: false,
      formTitle: '活动纪要',
      tableList: [],
      detailsMsg,
      description: '',
      activityContent: '',
      userStr: ''
    }
  },
  created() {
    this.detailsMsg[3].name = this.type === '1' ? '教研组' : '备课组'
  },
  methods: {
    editDetails() {},
    addNote(record) {
      this.formStatus = true
    },
    deleteList() {},
    submitForm(values) {}
  }
}
</script>

<style lang="less" scoped>
.details {
  height: calc(100vh - 65px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}
.details-top {
  margin-bottom: 30px;
}
.details-main {
  .title {
    height: 40px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  }
  .content {
    padding: 20px 50px;
    box-sizing: border-box;
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
          width: 20%;
          background-color: rgba(242, 242, 242, 1);
        }
        .text {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 80%;
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

      .item {
        width: 100%;

        .common {
          height: 100px;
          overflow-y: auto;
        }
        .name {
          width: 10%;
        }
      }
      .item:nth-child(2n) {
        border-left: 1px solid #ccc;
      }
    }
  }
}
</style>