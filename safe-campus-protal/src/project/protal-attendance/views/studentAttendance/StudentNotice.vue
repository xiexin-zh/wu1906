<template>
  <div class="page-layout qui-fx">
    <div class="notice-box qui-fx-ver">
      <div class="qui-fx-jsb box-top">
        <div>
          <span class="mar-r10">学生出入通知</span>
          <a-checkbox-group
            :options="options"
            v-model="noticeList.inOutVal"
            :disabled="noticeList.inOut"
          />
        </div>
        <a-button
          style="backgroundColor:#0096f5;color:#fff;"
          v-if="noticeList.inOut"
          @click="noticeList.inOut = false"
        >修改</a-button
        >
        <a-button type="primary" v-else @click="modifyInOut">保存</a-button>
      </div>
      <div class="qui-fx-f1 box-bottom" style="padding:10px;">
        <div class="box-content">
          <div>时间：学生进出校打卡时间</div>
          <div>说明：学生每次出入校产生打卡记录时，发送出入时间通知</div>
          <div>
            通知对象：
            <a-checkbox-group
              :options="objOpt"
              v-model="noticeList.inOutObj"
              :disabled="noticeList.inOut"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="notice-box qui-fx-ver">
      <div class="qui-fx-jsb box-top">
        <div>
          <span class="mar-r10">学生未到校通知</span>
          <a-checkbox-group
            :options="options"
            v-model="noticeList.absentVal"
            :disabled="noticeList.absent"
          />
        </div>
        <a-button
          style="backgroundColor:#0096f5;color:#fff;"
          v-if="noticeList.absent"
          @click="noticeList.absent = false"
        >修改</a-button
        >
        <a-button type="primary" v-else @click="modifyAbsent">保存</a-button>
      </div>
      <div class="qui-fx-f1 box-bottom" style="padding:10px;">
        <div class="box-content">
          <div>
            时间：学生在上学期间
            <span v-if="noticeList.absent">{{ noticeList.inTime }}</span>
            <a-input-number v-else size="small" :min="1" :max="120" v-model="noticeList.inTime" />
            分钟后还没有进校记录
          </div>
          <div>说明：学生在上学时间后一段时间仍未进校，发送预警通知</div>
          <div>
            通知对象：
            <a-checkbox-group
              :options="plainOpt"
              v-model="noticeList.absentObj"
              :disabled="noticeList.absent"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="notice-box qui-fx-ver">
      <div class="qui-fx-jsb box-top">
        <div>
          <span class="mar-r10">学生滞留通知</span>
          <a-checkbox-group
            :options="options"
            v-model="noticeList.retainVal"
            :disabled="noticeList.retain"
          />
        </div>
        <a-button
          style="backgroundColor:#0096f5;color:#fff;"
          v-if="noticeList.retain"
          @click="noticeList.retain = false"
        >修改</a-button
        >
        <a-button type="primary" v-else @click="modifyRetain">保存</a-button>
      </div>
      <div class="qui-fx-f1" style="padding:10px;">
        <div class="box-content">
          <div>
            时间：学生在放学时间
            <span v-if="noticeList.retain">{{ noticeList.outTime }}</span>
            <a-input-number v-else size="small" :min="1" :max="120" v-model="noticeList.outTime" />
            分钟后还没有出校记录
          </div>
          <div>说明：学生在放学时间后一段时间仍未出校，发送预警通知</div>
          <div>
            通知对象：
            <a-checkbox-group
              :options="plainOpt"
              v-model="noticeList.retainObj"
              :disabled="noticeList.retain"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'StudentNotice',
  components: {},
  data() {
    return {
      noticeList: {
        inOut: true,
        absent: true,
        retain: true,
        absentVal: [],
        retainVal: [],
        inOutVal: [],
        inOutObj: [],
        absentObj: [],
        retainObj: [],
        inTime: '0',
        outTime: '0'
      },
      options: [
        {
          label: '启用',
          value: '1'
        }
      ],
      objOpt: [
        {
          label: '家长',
          value: '2'
        }
      ],
      plainOpt: [
        {
          label: '家长',
          value: '2'
        },
        {
          label: '班主任',
          value: '1'
        }
      ]
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.setGet()
  },
  methods: {
    ...mapActions('home', [
      'getTeacherDetail',
      'studentAccess',
      'studentNoEnter',
      'studentRetention',
      'getSetting'
    ]),
    setGet() {
      this.getSetting({ schoolCode: this.userInfo.schoolCode }).then(res => {
        const data = res.data
        if (data.length > 0) {
          data.forEach(el => {
            if (el.msgType === '1') {
              this.noticeList.inOutObj = el.informer.split(',')
              this.noticeList.inOutVal = el.enable ? ['1'] : []
            } else if (el.msgType === '2') {
              this.noticeList.absentObj = el.informer.split(',')
              this.noticeList.absentVal = el.enable ? ['1'] : []
              this.noticeList.inTime = el.duration
            } else {
              this.noticeList.retainObj = el.informer.split(',')
              this.noticeList.retainVal = el.enable ? ['1'] : []
              this.noticeList.outTime = el.duration
            }
          })
        }
      })
    },
    modifyInOut() {
      this.noticeList.inOut = true
      const req = {
        schoolCode: this.userInfo.schoolCode,
        noticer: this.noticeList.inOutObj.length === 1 ? this.noticeList.inOutObj[0] : '',
        enable: this.noticeList.inOutVal.length === 1
      }
      this.studentAccess(req).then(res => {
        this.$message.success('操作成功')
      })
    },
    modifyAbsent() {
      this.noticeList.absent = true
      const req = {
        schoolCode: this.userInfo.schoolCode,
        noticer: this.noticeList.absentObj.length > 0 ? this.noticeList.absentObj.join(',') : '',
        enable: this.noticeList.absentVal.length > 0,
        timeCount: this.noticeList.inTime
      }
      this.studentNoEnter(req).then(res => {
        this.$message.success('操作成功')
      })
    },
    modifyRetain() {
      this.noticeList.retain = true
      const req = {
        schoolCode: this.userInfo.schoolCode,
        noticer: this.noticeList.retainObj.length > 0 ? this.noticeList.retainObj.join(',') : '',
        enable: this.noticeList.retainVal.length > 0,
        timeCount: this.noticeList.outTime
      }
      this.studentRetention(req).then(res => {
        this.$message.success('操作成功')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.notice-box {
  width: 32%;
  height: 220px;
  margin-left: 20px;
  margin-top: 10px;
  background-color: #fff;
  border: 1px solid #7365c1;
  border-radius: 5px;
  &:first-of-type {
    margin-left: 10px;
  }
  .box-top {
    height: 40px;
    border-bottom: 1px solid #d5d5d5;
    align-items: center;
    padding: 0 10px;
  }
  .box-content {
    height: 160px;
    background-color: #efedfe;
    border-radius: 5px;
    padding: 10px;
    overflow: scroll;
    div {
      margin-top: 7px;
    }
  }
}
/deep/ .ant-checkbox {
  .ant-checkbox-inner {
    border: 1px solid #6757bd;
    width: 18px;
    height: 18px;
  }
}
/deep/ .ant-checkbox-group-item {
  color: #6757bd;
}
.notice-box .box-content .ant-input-number {
  margin-top: 0px;
}
</style>
