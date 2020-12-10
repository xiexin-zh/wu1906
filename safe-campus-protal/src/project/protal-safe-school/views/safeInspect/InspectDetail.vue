<template>
  <div class="daily-detail page-layout bg-fff qui-fx">
    <div class="qui-fx-f1 qui-fx-ver left">
      <div class="qui-fx left-box" v-for="item in detailInfo" :key="item.id">
        <div class="left-title">{{ item.title }}</div>
        <div class="left-content qui-fx-f1" v-if="item.title === '拍照留存：'">
          <img v-for="(list,index) in item.content" :key="index" :src="list" alt />
        </div>
        <div class="left-content qui-fx-f1" v-else>{{ item.content }}</div>
      </div>
    </div>
    <div class="qui-fx-f1 qui-fx-ver right">
      <div class="right-top qui-fx-jsb">
        <div>检查项状态</div>
        <div>不通过/通过</div>
      </div>
      <div class="qui-fx-f1 right-bottom">
        <no-data v-if="checkList.length === 0" msg="暂无数据~"></no-data>
        <div class="right-content" v-for="list in checkList" :key="list.id">
          <a-collapse expand-icon-position="right" v-if="list.children && list.children.length > 0">
            <a-collapse-panel :header="list.name">
              <div class="right-info qui-fx-jsb" v-for="item in list.children" :key="item.id">
                <div class="right-text">{{ item.name }}</div>
                <div>
                  <a-switch :defaultChecked="item.state === '1' ? true : false" disabled />
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
          <div class="right-info qui-fx-jsb" v-else>
            <div class="right-text">{{ list.name }}</div>
            <div>
              <a-switch :defaultChecked="list.state === '1' ? true : false" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import NoData from '@c/NoData'
export default {
  name: 'InspectDetail',
  components: {
    NoData
  },
  data() {
    return {
      detailId: '',
      detailInfo: {},
      checkList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.detailId = this.$route.query.id
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['taskResultDetail']),
    moment,
    // 获取详情
    async showDetail() {
      const res = await this.taskResultDetail(this.detailId)
      const data = res.data
      this.checkList = data.checkList ? data.checkList : []
      this.detailInfo = [
        {
          title: '巡查区域：',
          content: data.address
        },
        {
          title: '巡查人：',
          content: data.userName
        },
        {
          title: '巡查完成时间：',
          content: data.completeTime ? this.$tools.getDate(data.completeTime) : ''
        },
        {
          title: '巡查状态：',
          content: data.state === '1' ? '已巡查' : '未巡查'
        },
        {
          title: '巡查定位地点：',
          content: data.address
        },
        {
          title: '拍照留存：',
          content: data.photoUrls
        },
        {
          title: '备注：',
          content: data.remark
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.daily-detail {
  padding: 20px;
  .left {
    .left-box {
      border: 1px solid #9698d6;
      height: 55px;
      line-height: 53px;
      &:nth-child(6),
      &:nth-child(7) {
        height: 120px;
        line-height: 117px;
      }
      &:nth-child(2n) {
        border-bottom: none;
        border-top: none;
      }
      .left-title {
        width: 150px;
        background-color: #f5f5fb;
        border-right: 1px solid #9698d6;
        border-left: 1px solid #9698d6;
        text-align: right;
        padding: 0 5px;
        color: #575758;
      }
      .left-content {
        padding: 0 10px;
        color: #333;
        width: 100%;
        overflow-x: scroll;
        img {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }
      }
    }
  }
  .right {
    margin-left: 25px;
    .right-top {
      height: 50px;
      line-height: 50px;
      background-color: #f5f5fb;
      border: 1px solid #9698d6;
      padding: 0 10px;
      color: #575758;
    }
    .right-bottom {
      padding: 10px;
      border: 1px solid #9698d6;
      border-top: none;
      max-height: calc(100vh - 150px);
      overflow-y: scroll;
    }
    .right-content {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      .right-info {
        margin-top: 20px;
        &:first-of-type {
          margin-top: 0;
        }
        .right-text {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
