<template>
  <div class="notice-set page-layout u-fx-ver">
    <div class="content u-fx-wp">
      <div
        class="box u-fx-ac-jc u-tx-c u-border-radius-middle u-type-white-bg u-mar-r  u-padd"
        v-for="list in warnList"
        :key="list.msgType">
        <a-switch class="switch" checked-children="启用" un-checked-children="禁用" v-model="list.enable" @change="change($event,list)"/>
        <div class="img-box u-mar-b10" :style="`background:${list.color}`">
          <img :src="list.icon" alt />
        </div>
        <div class="u-font-1">{{ list.title }}</div>
        <div class="info">
          <div>时间：{{ list.time }}</div>
          <div>说明：{{ list.desp }}</div>
          <div>通知对象：
            <a-checkbox-group v-model="list.informer" :options="options" @change="change($event,list)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import leave from '../../assets/img/leave.png'
import absent from '../../assets/img/absent.png'
import notice from '../../assets/img/notice.png'
import stay from '../../assets/img/stay.png'
export default {
  name: 'NoticeSet',
  components: {},
  data() {
    return {
      leave,
      absent,
      notice,
      stay,
      warnList: [
        {
          id: 1,
          msgType: '1',
          icon: notice,
          title: '学生到校通知',
          time: '学生每次进校打卡时',
          color: '#D6E8FE',
          informer: [],
          desp: '学生每次进校产生打卡记录时，微信公众号发送出入通知',
          enable: false
        },
        {
          id: 2,
          msgType: '2',
          icon: leave,
          title: '学生离校通知',
          time: '学生每次出校打卡时',
          color: '#FEF5DF',
          informer: [],
          desp: '学生每次出校产生打卡记录时，微信公众号发送出入通知',
          enable: false
        },
        {
          id: 3,
          msgType: '3',
          icon: absent,
          title: '学生未到校通知',
          time: '学生在上学时间 10 分钟后还没有进校记录',
          color: '#FFEBEC',
          informer: [],
          desp: '学生在上学时间后一段时间仍未进校，微信公众号发送预警通知',
          enable: false
        },
        {
          id: 4,
          msgType: '4',
          icon: stay,
          title: '学生滞留通知',
          time: '学生在放学时间 10 分钟后还没有出校记录',
          color: '#E6FEFE',
          informer: [],
          desp: '学生在放学时间后一段时间仍未出校，微信公众号发送预警通知',
          enable: false
        }
      ],
      checkedList: [],
      options: [
        {
          label: '家长',
          value: '1'
        },
        {
          label: '班主任',
          value: '2'
        }
      ],
      chooseStatus: false,
      bindList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getMsgList()
  },
  methods: {
     ...mapActions('home', ['getMsgList', 'updateMsg']),
     // 获取列表
    async _getMsgList() {
      const res = await this.getMsgList({ schoolCode: this.schoolCode })
      if (res.data.length === 0) return
      res.data = res.data.map(el => {
        return {
          ...el,
          informer: el.informer ? el.informer.split(',') : ''
        }
      })
      for (let i = 0; i < this.warnList.length; i++) {
        for (let y = 0; y < res.data.length; y++) {
          if (this.warnList[i].msgType === res.data[y].msgType) {
            this.warnList[i] = Object.assign(this.warnList[i], res.data[y])
          }
        }
      }
    },
    // 更新提醒
    async _updateMsg(type, data) {
      const req = {
        enable: data.enable,
        informer: data.informer.join(','),
        msgType: data.msgType,
        schoolCode: this.schoolCode
      }
      const res = await this.updateMsg(req)
      this.info = res.data
      if (type) {
        this.$tools.message('succses', '操作成功')
        this.$tools.goNext(this._getMsgList)
      }
    },
    // 状态和对象的改变
    change(e, value) {
      this._updateMsg(1, value)
    }
  }
}
</script>
<style lang="less" scoped>
.notice-set {
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .box {
      width: 538px;
      height: 360px;
      position: relative;
      line-height: 40px;
      .switch {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .info {
        text-align: left;
      }
      .img-box {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        line-height: 45px;
        img {
          width: 50%;
          height: 50%;
        }
      }
    }
  }
}
.ant-switch-checked {
  background-color: #008F52;
}
</style>
