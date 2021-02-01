<template>
  <div class="system-set page-layout u-fx layout-padd u-type-white-bg">
    <u-choose-teacher
      is-check
      chooseByDutyTag
      allowEmpty
      ref="chooseTeacherRef"
      v-if="showTag"
      v-model="showTag"
      :schoolCode="schoolCode"
      :bindList="userList"
      @submit="submit"
      title="添加校医"
    >
    </u-choose-teacher>
    <div class="u-fx-f1 content">
      <a-collapse v-model="activeKey" expand-icon-position="left">
        <a-collapse-panel v-for="list in checkList" :key="list.id" :header="list.name">
          <div class=" u-fx-f1 u-padd-l" v-if="list.id === '0'">
            <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" >
              <a-form-item label="发热温度值：" label-align="left">
                <span v-if="!list.disabled">{{ temp }}</span>
                <a-input-number
                  v-decorator="['temp',{ initialValue: temp }]"
                  :min="0"
                  :max="100000"
                  :step="0.1"
                  v-if="list.disabled"/>℃判为发热
              </a-form-item>
            </a-form>
          </div>
          <div class=" u-fx-f1 u-padd-l" v-if="list.id === '1'">
            校医人员：
            <a-tag
              v-for="user in userList"
              :key="user.userCode"
              :closable="list.disabled"
              @close="close(user)">{{ user.userName }}</a-tag>
            <u-button type="primary" icon="plus" size="small" v-if="list.disabled" @click="add">添加</u-button>
          </div>
          <div class="u-fx-f1 u-line3 u-padd-l" v-if="list.id === '2'">
            <div class="u-fx-ac" v-for="el in info" :key="el.feverType">
              <div class="title">{{ el.title }}</div>
              <a-checkbox-group class="u-fx-f1" v-model="el.noticerType" :options="el.options" :disabled="!list.disabled" />
            </div>
          </div>
          <div slot="extra">
            <u-space>
              <u-button size="small" type="light" @click="modify(0, list)" v-if="!list.disabled">编辑</u-button>
              <u-button size="small" type="default" @click="modify(1, list)" v-if="list.disabled">取消</u-button>
              <u-button size="small" type="primary" @click="modify(2, list)" v-if="list.disabled">保存</u-button>
            </u-space>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="right u-type-white-bg u-mar-l u-padd">
      <div>
        <a-icon class="u-type-primary u-font-3" type="exclamation-circle" />
        <span class="u-font-3 u-mar-l10">请注意</span>
        <p class="u-mar-t">1.温度阈值设置</p>
        <p>• 超过发热温度值，系统将上报；</p>
        <p>2.校医设置</p>
        <p>• 校医人员可通过移动端查看全校人员的疫情上报数据；并可收到所有人的体温异常提醒；</p>
        <p>3.通知设置</p>
        <p>• 开启通知对象的设置后，家长将收到绑定孩子的测温提醒，班主任将收到本班学生的测温提醒，校医将收到全校人员的测温提醒。</p>
      </div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { getDataState } from '@u/libs/data-state'
const checkList = [
  {
    id: '0',
    disabled: false,
    name: '温度阈值设置'
  },
   {
    id: '1',
    disabled: false,
    name: '校医设置'
  },
   {
    id: '2',
    disabled: false,
    name: '通知设置'
  }
]
const info = [
  {
    feverType: '0',
    title: '教职工发热通知：',
    noticerType: [],
    options: [
      {
        value: '0',
        label: '本人'
      },
      {
        value: '1',
        label: '校医'
      }
    ]
  },
  {
    feverType: '1',
    title: '学生发热通知：',
    noticerType: [],
    options: [
      {
        value: '2',
        label: '家长'
      },
      {
        value: '3',
        label: '班主任'
      },
      {
        value: '1',
        label: '校医'
      }
    ]
  }
]

export default {
  name: 'SystemSet',
  components: {},
  data() {
    return {
      moment,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      getDataState,
      info,
      checkList,
      text: '122',
      activeKey: ['0', '1', '2'],
      checkedList: [],
      noData: false,
      temp: 0,
      showTag: false,
      userList: [],
      index: 0
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  async mounted() {
    this._getTmpInfo()
    this._getDocInfo()
    this._getNoticerInfo()
  },
  methods: {
    ...mapActions('home', [
      'getTmpInfo', 'getDocInfo', 'getNoticerInfo', 'updateTmp',
      'addDoc', 'unBindDoc', 'updateNoticer'
    ]),
    // 获取温度
    async _getTmpInfo() {
      const res = await this.getTmpInfo(this.schoolCode)
      this.temp = res.data ? res.data.temperatureLimit : 0
    },
     // 获取已选校医
    async _getDocInfo() {
      const res = await this.getDocInfo(this.schoolCode)
      this.userList = res.data
    },
    // 获取通知列表
    async _getNoticerInfo() {
      const res = await this.getNoticerInfo({ schoolCode: this.schoolCode })
      if (res.data.length === 0) return
      for (let i = 0; i < this.info.length; i++) {
        for (let y = 0; y < res.data.length; y++) {
          if (this.info[i].feverType === res.data[y].feverType) {
            this.info[i] = Object.assign(this.info[i], res.data[y])
          }
        }
      }
    },
    // 更新温度
    async _updateTmp() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.temp = values.temp
        }
      })
      const req = {
        schoolCode: this.schoolCode,
        temperature: this.temp
      }
      await this.updateTmp(req)
      this.$tools.message('succses', '操作成功')
      this.$tools.goNext(this._getTmpInfo)
    },
    // 校医添加保存
    async _addDoc() {
      const req = {
        schoolCode: this.schoolCode,
        users: this.userList.map(el => {
          return {
            userName: el.userName,
            userCode: el.userCode
          }
        })
      }
      await this.addDoc(req)
      this.$tools.message('succses', '操作成功')
      this.$tools.goNext(this._getDocInfo)
    },
    // 通知保存
    async _updateNoticer() {
      const info = this.info.map(el => {
        return {
          feverType: el.feverType,
          noticerType: el.noticerType,
          schoolCode: this.schoolCode,
          noticeMode: '0'
        }
      })
      await this.updateNoticer(info)
      this.$tools.message('succses', '操作成功')
      this.$tools.goNext(this._getNoticerInfo)
    },
    // 操作按钮
    modify(type, record) {
      this.checkList[parseInt(record.id)].disabled = !this.checkList[record.id].disabled
      if (type === 1) {
        record.id === '0' ? this._getTmpInfo() : record.id === '1' ? this._getDocInfo() : this._getNoticerInfo()
      } else if (type === 2) {
        record.id === '0' ? this._updateTmp() : record.id === '1' ? this._addDoc() : this._updateNoticer()
      }
    },
    // 添加校医
    add() {
      this.showTag = true
    },
    // 删除校医
    close(record) {
      this.userList = this.userList.filter(e => e.userCode !== record.userCode)
    },
    // 选择校医
    submit(values) {
      this.userList = values
      this.$refs.chooseTeacherRef.reset()
    }
  }
}
</script>
<style lang="less" scoped>
.system-set {
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .title {
      width: 110px;
    }
  }
  .right {
    width: 312px;
    color: #333;
    position: relative;
    .bottom {
      position: absolute;
      bottom: 50px;
      left: 20px;
      width: 90%;
      height: 200px;
      background: url(../assets/img/set.png);
      background-size: 100% 100%;
    }
  }
}
.ant-collapse {
  background-color: #fbfbfd;
}
.ant-form-item {
  margin-bottom: 0px;
}
</style>
