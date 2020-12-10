<template>
  <div class="danger-detail page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="detail-info">
        <div class="detail-title">
          <div class="title">审核任务</div>
        </div>
        <div class="info">
          <div class="qui-tx-c">{{ detailInfo.taskName }}</div>
          <div class="qui-fx-jsb u-mar-t10 u-mar-b10">
            <div>检查对象：{{ detailInfo.schoolName }}</div>
            <div>{{ detailInfo.state === '1' ? '未开始检查' : detailInfo.checkTime }}</div>
          </div>
          <div>
            <a-collapse v-model="activeKey" expand-icon-position="right" @change="changeActivekey">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <a-collapse-panel :key="`'${index+1}'`" :header="list.name" :style="customStyle" v-for="(list,index) in detailInfo.itemList">
                <div class="collapse-title qui-fx-jsb">
                  <div>检查标准</div>
                  <div class="qui-fx">
                    <div class="collapse-state u-mar-l10" v-if="!(detailInfo.state === '1' && type === '3')">自查结果</div>
                    <div class="collapse-state u-mar-l10" v-if="detailInfo.state === '3' || detailInfo.state === '4' || type === '2'">审核结果</div>
                    <div class="collapse-state u-mar-l10" v-if="detailInfo.state === '4'">督查结果</div>
                  </div>
                </div>
                <div class="collapse-content qui-fx-jsb" v-for="item in list.standardList" :key="item.id">
                  <div>
                    <div> {{ item.itemName }} </div>
                    <div v-if="!item.selfResult || !item.examineResult">
                      <span v-for="el in item.dangerList" :key="el.dangerCode" @click="goDetail(el)">
                        ({{ el.userName }}上报隐患：
                        <span style="color:#fa3534">{{ el.dangerCode }})</span>
                      </span>
                    </div>
                  </div>
                  <div class="qui-fx">
                    <div class="collapse-state u-mar-l10 u-mar-r10" v-if="!(detailInfo.state === '1' && type === '3')">
                      <a-switch size="small" :disabled="type !== '1'" v-model="item.selfResult"/>
                      <span class="u-mar-l10">{{ item.selfResult ? '符合' : '不符合' }}</span>
                      <div class="add" v-if="(!item.selfResult || !item.examineResult) && type === '1'" @click="add(item)">上报隐患</div>
                    </div>
                    <div class="collapse-state u-mar-l10" v-if="detailInfo.state === '3' || detailInfo.state === '4' || type === '2'" >
                      <a-switch size="small" :disabled="type !== '2'" v-model="item.examineResult"/>
                      <div class="add" v-if="(type === '1' && !item.selfResult )|| (type === '2' && !item.examineResult)" @click="add(item)">上报隐患</div>
                    </div>
                    <div class="collapse-state u-mar-l10" v-if="detailInfo.state === '4'">
                      <a-switch size="small" disabled v-model="item.inspectionResult"/>
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </div>
      <div class="detail-deal">
        <div class="detail-title">
          <div class="title">处理流程</div>
        </div>
        <a-timeline class="time-line" v-if="detailInfo.processList && detailInfo.processList.length > 0">
          <a-timeline-item v-for="(item,index) in detailInfo.processList" :key="index">
            <div class="qui-fx">
              <div class="time-left">{{ item.content }}</div>
              <div class="qui-fx-f1">{{ item.time | gmtToDate }}</div>
            </div>
          </a-timeline-item>
        </a-timeline>
        <no-data v-else msg="未检查，暂无处理流程记录~"></no-data>
      </div>
      <div class="qui-tx-c u-mar-t" v-if="type !== '3'">
        <a-button type="primary" @click="submitOk" :disabled="isLoad">审核</a-button>
      </div>
    </div>
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload">
        <upload-multi :length="9" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
  </div>
</template>

<script>
import SubmitForm from '@c/SubmitForm'
import UploadMulti from '@c/UploadMulti'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
const formData = [
  {
    value: 'description',
    initValue: '',
    type: 'input',
    label: '隐患描述',
    placeholder: '请输入隐患描述'
  },
  {
    value: 'address',
    initValue: '',
    type: 'input',
    label: '隐患位置',
    placeholder: '请输入隐患位置'
  },
  {
    type: 'upload',
    label: '隐患图片上传'
  },
  {
    value: 'leaderCode',
    initValue: [],
    list: [],
    type: 'select',
    label: '负责人',
    placeholder: '请选择负责人'
  }
]
export default {
  name: 'SpecialDetail',
  components: {
    SubmitForm,
    UploadMulti,
    NoData
  },
  data() {
    return {
      formData,
      detailInfo: [],
      detailImg: [],
      processes: [],
      activeKey: ["'1'"],
      isLoad: false,
      state: '',
      type: '',
      formStatus: false,
      title: '上报隐患',
      fileInfo: {
        tip: '上传图片',
        h: 120, // 高度
        w: 120 // 宽度
      },
      fileList: [],
      itemInfo: {},
      customStyle:
        'background: #9698d6;margin-bottom: 24px;border: 0;overflow: hidden'
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.state = this.$route.query.state
    this.type = this.$route.query.type
    this.detailId = this.$route.query.id
    this.showDetail()
    this.getUserList()
  },
  methods: {
    ...mapActions('home', ['addInspect', 'addSpeDanger', 'specialTaskDetail', 'updateInspect', 'getGroupDetail', 'modifySpecial']),
    changeActivekey(key) {
      console.log(key)
    },
    async showDetail() {
      const res = await this.specialTaskDetail(this.detailId)
      const data = res.data
      this.detailInfo = data
      this.detailInfo.itemList = this.detailInfo.itemList.map(el => {
        return {
          ...el,
          standardList: el.standardList.map(item => {
            return {
              ...item,
              examineResult: item.examineResult !== '0',
              inspectionResult: item.inspectionResult !== '0',
              selfResult: item.selfResult !== '0'
            }
          })
        }
      })
    },
    async getUserList() {
      const res = await this.getGroupDetail({ schoolCode: this.userInfo.schoolCode })
      this.userList = res.data.leaders
      this.formData[3].list = res.data.leaders.map(el => {
        return {
          ...el,
          val: el.name,
          key: el.code
        }
      })
    },
    async submitForm(values) {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传图片')
        this.$refs.form.error()
        return
      }
      this.userList.map(el => {
        if (el.code === values.leaderCode) {
          values.leaderName = el.name
        }
      })
      try {
        values.specialResultId = this.itemId
        values.reporterCode = this.userInfo.userCode
        values.reporterName = this.userInfo.userName
        values.schoolCode = this.userInfo.schoolCode
        values.reporterPhotoUrl = this.userInfo.logoUrl
        values.photoUrl = this.fileList.map(el => el.url)
        const res = await this.addSpeDanger(values)
        this.$refs.form.reset()
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.detailInfo.itemList = this.detailInfo.itemList.map(el => {
            el.standardList.map(item => {
              if (item === this.itemInfo) {
                item.dangerList.push({ dangerCode: res.data.code, userName: res.data.reportName, id: res.data.id })
              }
            })
            return el
          })
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    add(record) {
      this.formData[0].initValue = record.itemName
      this.itemId = record.id
      this.itemInfo = record
      this.formStatus = true
    },
    goDetail(record) {
      if (this.type === '3') {
        this.$router.push({
          path: '/dangerFind/dangerDetail',
          query: {
            id: record.dangerCode
          }
        })
      }
    },
    // 提交
    submitOk(value) {
      this.isLoad = true
      const resultList = []
      this.detailInfo.itemList.map(el => {
        el.standardList.map(item => {
          if (this.type === '1') {
            resultList.push({ id: item.id, result: item.selfResult ? '1' : '0' })
          } else {
            resultList.push({ id: item.id, result: item.examineResult ? '1' : '0' })
          }
        })
      })
      const req = {
        resultList: resultList,
        submitType: this.type,
        taskId: this.detailInfo.taskId,
        userCode: this.userInfo.userCode,
        userName: this.userInfo.userName
      }
      this.modifySpecial(req)
        .then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.$router.go(-1)
          })
        })
        .catch(res => {
          this.isLoad = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.danger-detail {
  background-color: #f0f2f5;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .detail-info {
      padding-top: 20px;
      background-color: #fff;
      .info {
        padding: 20px 40px;
        .info-box {
          border-top: 1px solid #9698d6;
          height: 55px;
          line-height: 53px;
          width: 50%;
          float: left;
          &:nth-child(2n) {
            border-right: 1px solid #9698d6;
          }
        }
        .img-content {
          margin-top: 220px;
        }
        .info-title {
          width: 150px;
          background-color: #f5f5fb;
          border-right: 1px solid #9698d6;
          border-left: 1px solid #9698d6;
          text-align: right;
          padding: 0 5px;
          color: #575758;
        }
        .info-content {
          padding: 0 10px;
          color: #333;
          width: 100%;
          overflow-x: scroll;
          img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
          }
        }
        .img-box {
          border: 1px solid #9698d6;
          height: 80px;
          line-height: 70px;
          border-bottom: none;
          &:last-child {
            border-bottom: 1px solid #9698d6;
          }
          .info-title {
            &:last-child {
              border-bottom: 1px solid #9698d6 !important;
            }
          }
        }
      }
    }
    .detail-title {
      height: 35px;
      border-bottom: 1px solid #ddd;
      .title {
        margin-left: 40px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          height: 20px;
          width: 5px;
          background-color: #4D4CAC;
          left: -20px;
        }
      }
    }
    .detail-deal {
      margin-top: 20px;
      padding: 20px 0;
      background-color: #fff;
      .time-line {
        margin: 30px 0 0 20px;
        .time-left {
          width: 360px;
        }
      }
    }
    .collapse-title {
      height: 40px;
      line-height: 40px;
      background: #f5f5fb;
      padding: 0 20px;
    }
    .collapse-content {
      padding: 10px 20px;
      border-bottom: 1px solid #ccc;
    }
    .collapse-state {
      width: 80px;
      text-align: center;
    }
    .add{
      color: #9698d6;
      font-size: 12px;
      margin-top: 5px;
      cursor: pointer;
    }
  }
}
</style>
