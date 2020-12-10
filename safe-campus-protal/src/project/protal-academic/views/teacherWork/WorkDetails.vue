<template>
  <div class="details">
    <div class="details-top details-main">
      <div class="title">
        <span>工作计划详情</span>
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
          <div class="msg-item item" style="height: 40px">
            <div class="name common" style="height: 39px">教师</div>
            <div class="text common" style="height: 40px">{{ userName }}</div>
          </div>
          <div class="msg-item" v-for="item in detailsMsg" :key="item.id">
            <div class="name common">{{ item.name }}</div>
            <div class="text common">{{ item.text }}</div>
          </div>
          <div class="msg-item item" style="height: 40px">
            <div class="name common" style="height: 39px">附件</div>
            <div class="text common">{{ file }}</div>
          </div>
          <div class="msg-item item">
            <div class="name common">教师工作计划内容</div>
            <div class="text common">{{ planContent }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tools from '@/utils/tools'

const detailsMsg = [
  {
    id: '1',
    name: '学期',
    text: ''
  },
  {
    id: '2',
    name: '专业',
    text: ''
  },
  {
    id: '3',
    name: '班级',
    text: ''
  },
  {
    id: '4',
    name: '课程',
    text: ''
  },
  {
    id: '5',
    name: '周课时',
    text: ''
  },
  {
    id: '6',
    name: '学期总课时',
    text: ''
  },
  {
    id: '7',
    name: '活动名称',
    text: ''
  },
  {
    id: '8',
    name: '活动地点',
    text: ''
  }
]

export default {
  name: 'WorkDetails',
  data() {
    return {
      detailsMsg,
      file: '',
      planContent: '',
      userName: ''
    }
  },
  methods: {
    editDetails() {}
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
      .msg-item:nth-child(2n) {
        border-top: 0;
        border-left: 1px solid #ccc;
        border-right: 0;
      }
      .msg-item:nth-child(1) {
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
      .item:first-child .name {
        border-bottom: 1px solid #ccc;
      }
      .item:nth-child(2n) {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }
  }
}
</style>