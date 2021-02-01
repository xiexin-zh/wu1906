<template>
  <div class="warn page-layout u-fx-ver">
    <u-choose-teacher
      is-check
      chooseByDutyTag
      allowEmpty
      v-if="chooseStatus"
      ref="chooseTeacherRef"
      title="添加通知对象"
      :schoolCode="schoolCode"
      v-model="chooseStatus"
      :bindList="bindList"
      @submit="submitChoose"
    />
    <div class="u-mar-b">
      <u-alert
        message
        description="勾选通知对象后，家长将收到绑定孩子的消息推送，班主任收到本班住宿学生的消息推送，宿管收到负责宿舍的学生的消息推送，额外通知对象收到所有住宿学生的消息推送。"
      ></u-alert>
    </div>
    <div class="content u-fx-wp">
      <div
        class="box u-fx-ac-jc u-tx-c u-border-radius-middle u-type-white-bg u-mar-r u-mar-b u-padd"
        v-for="list in warnList"
        :key="list.type">
        <a-switch class="switch" checked-children="启用" un-checked-children="禁用" v-model="list.enable" @change="change($event,list)"/>
        <div class="img-box u-mar-b10" :style="`background:${list.color}`">
          <img :src="list.icon" alt />
        </div>
        <div class="u-font-1">{{ list.title }}</div>
        <div class="info">
          <div>时间：{{ list.time }}</div>
          <div>通知对象：
            <a-checkbox-group v-model="list.noticer" :options="options" @change="change($event,list)" />
          </div>
          <div>
            额外通知对象：{{ list.userCount }}人
            <a-icon class="u-type-primary u-font-2 u-mar-l5" type="plus-circle" @click="addUser(list)"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import absent from '../../assets/img/absent.png'
import late from '../../assets/img/late.png'
import notice from '../../assets/img/notice.png'
import remind from '../../assets/img/remind.png'
export default {
  name: 'Warn',
  components: {},
  data() {
    return {
      absent,
      late,
      notice,
      remind,
      warnList: [
        {
          id: 1,
          type: '1',
          icon: remind,
          title: '深夜外出提醒',
          time: '晚查寝结束时间至0:00外出',
          userCount: 0,
          color: '#D6E8FE',
          noticer: [],
          enable: false
        },
        {
          id: 2,
          type: '2',
          icon: late,
          title: '晚归提醒',
          time: '晚查寝结束时间至0:00归寝',
          userCount: 0,
          color: '#FEF5DF',
          noticer: [],
          enable: false
        },
        {
          id: 3,
          type: '3',
          icon: absent,
          title: '未归提醒',
          time: '晚查寝结束时间还没有归寝',
          userCount: 0,
          color: '#FFEBEC',
          noticer: [],
          enable: false
        },
        {
          id: 4,
          type: '4',
          icon: notice,
          title: '出入宿舍通知',
          time: '每次出入宿舍',
          userCount: 0,
          color: '#E6FEFE',
          noticer: [],
          enable: false
        }
      ],
      checkedList: [],
      options: [
        {
        label: '家长',
        value: 1
      },
      {
        label: '班主任',
        value: 2
      },
      {
        label: '宿管',
        value: 4
      }],
      chooseStatus: false,
      bindList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getWarnList()
  },
  methods: {
     ...mapActions('home', ['getWarnList', 'updateWarn', 'getWarnUser', 'updateWarnUser']),
     // 获取列表
    async _getWarnList() {
      const res = await this.getWarnList({ schoolCode: this.schoolCode })
      if (res.data.length === 0) return
      for (let i = 0; i < this.warnList.length; i++) {
        for (let y = 0; y < res.data.length; y++) {
          if (this.warnList[i].type === res.data[y].type) {
            this.warnList[i] = Object.assign(this.warnList[i], res.data[y])
          }
        }
      }
    },
    // 更新提醒
    async _updateWarn(type, data) {
      const req = {
        enable: data.enable,
        noticer: data.noticer,
        type: data.type,
        schoolCode: this.schoolCode
      }
      const res = await this.updateWarn(req)
      this.info = res.data
      if (type) {
        this.$tools.message('succses', '操作成功')
        this.$tools.goNext(this._getWarnList)
      }
    },
    // 状态和对象的改变
    change(e, value) {
      this._updateWarn(1, value)
    },
    // 点击添加额外通知对象
    async addUser(record) {
      if (!record.code) {
        await this._updateWarn(0, record)
        this.warningCode = this.info.code
      } else {
        this.warningCode = record.code
      }
      const req = {
        schoolCode: this.schoolCode,
        warningCode: this.warningCode
      }
      const res = await this.getWarnUser(req)
      this.bindList = res.data
      this.chooseStatus = true
    },
    // 提交额外通知对象
    async submitChoose(values) {
      try {
        const req = {
          schoolCode: this.schoolCode,
          warningCode: this.warningCode,
          noticerDtoList: values.map(item => {
            return {
              userCode: item.userCode,
              userName: item.userName
            }
          })
        }
        await this.updateWarnUser(req)
        this.$refs.chooseTeacherRef.reset()
        this.$tools.message('success', '添加成功')
        this.$tools.goNext(this._getWarnList)
      } catch (err) {
        this.$refs.chooseTeacherRef.error()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 10px);
  overflow-y: scroll;
  .box {
    width: 538px;
    height: 345px;
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
.ant-switch-checked {
  background-color: #008F52;
}
</style>
