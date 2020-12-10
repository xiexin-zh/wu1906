<template>
  <Modal title="查看任务详情" :width="1000" ref="modal" @ok="close">
    <div class="content">
      <div class="detail-info u-bd-1px">
        <div class="detail-title u-mar-t10">
          <div class="title">审核任务</div>
        </div>
        <div class="info">
          <div class="qui-tx-c">{{ detailInfo.taskName }}</div>
          <div class="qui-fx-jsb u-mar-t10 u-mar-b10">
            <div>检查对象：{{ detailInfo.schoolName }}</div>
            <div>{{ detailInfo.state === '1' ? '未开始检查' : detailInfo.checkTime }}</div>
          </div>
          <div>
            <a-collapse v-model="activeKey" expand-icon-position="right">
              <template #expandIcon="props">
                <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
              </template>
              <!-- 检查项信息列表 -->
              <a-collapse-panel :key="`'${index+1}'`" :header="list.name" :style="customStyle" v-for="(list,index) in detailInfo.itemList">
                <div class="collapse-title qui-fx-jsb">
                  <div>检查标准</div>
                  <div class="qui-fx">
                    <div class="collapse-state u-mar-l10" v-if="!(detailInfo.state === '1' )">自查结果</div>
                    <div
                      class="collapse-state u-mar-l10"
                      v-if="(detailInfo.state === '2'&& teamLeaderCode==userCode)|| detailInfo.state === '3' || detailInfo.state === '4'">
                      审核结果
                    </div>
                    <div
                      class="collapse-state u-mar-l10"
                      v-if="(detailInfo.state === '3'&& supervisionCode) || detailInfo.state === '4'">督查结果</div>
                  </div>
                </div>
                <!-- 指示信息列表 -->
                <div class="collapse-content qui-fx-jsb" v-for="item in list.standardList" :key="item.id">
                  <div>
                    <div> {{ item.itemName }} </div>
                    <div v-if="!item.selfResult || !item.examineResult">
                      <!-- 隐患列表 -->
                      <span v-for="el in item.dangerList" :key="el.dangerCode" @click="goDetail(el)">
                        ({{ el.userName }}上报隐患：
                        <span style="color:#fa3534">{{ el.dangerCode }})</span>
                      </span>
                    </div>
                  </div>
                  <div class="qui-fx">
                    <!-- 自查结果 -->
                    <div class="collapse-state u-mar-l10 u-mar-r10" v-if="detailInfo.state !== '1'">
                      <a-switch size="small" :disabled="true" v-model="item.selfResult"/>
                    </div>
                    <!-- 审核结果 -->
                    <div
                      class="collapse-state u-mar-l10"
                      v-if="(detailInfo.state === '2'&& teamLeaderCode==userCode)|| detailInfo.state === '3' || detailInfo.state === '4'" >
                      <a-switch size="small" :disabled="!(detailInfo.state === '2'&& teamLeaderCode==userCode)" v-model="item.examineResult"/>
                    </div>
                    <!-- 督查结果 -->
                    <div
                      class="collapse-state u-mar-l10"
                      v-if="(detailInfo.state === '3'&& supervisionCode) || detailInfo.state === '4'">
                      <a-switch size="small" :disabled="!(detailInfo.state === '3'&& teamLeaderCode==userCode)" v-model="item.inspectionResult"/>
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </div>

      <div class="detail-deal  u-bd-1px">
        <div class="detail-title ">
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
      <div class="qui-tx-c u-mar-t" >
        <a-button
          type="primary"
          v-if="detailInfo.state==='2'&&teamLeaderCode==userCode"
          @click="submitOk('2')"
          :disabled="isLoad">
          审核
        </a-button>
        <a-button
          type="primary"
          v-if="detailInfo.state==='3'&&supervisionCode"
          @click="submitOk('3')"
          :disabled="isLoad">
          督查
        </a-button>
      </div>
    </div>
    <!-- <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload">
        <upload-multi :length="9" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form> -->
  </Modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import Modal from '../../component/Modal'
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
    value: 'leaderName',
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
    Modal,
    NoData
  },
  data() {
    this.id = ''
    return {
      teamLeaderCode: '', // 小组长Code
      // supervisionCode: 'QPJYJ1', // 是否是督察员
      formData,
      detailInfo: [],
      processes: [],
      activeKey: ['1'],
      isLoad: false,
      type: '',
      customStyle: 'background: #9698d6;margin-bottom: 24px;border: 0;overflow: hidden'
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    userCode: {
      get() {
        return this.userInfo.userCode
      },
      set() {
        this.$emit('input', false)
      }
    },
    supervisionCode() {
      const a = this.userInfo.postList.some(v => v.postCode === 'J14x1qwxj8izet')
      return a
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['specialTaskDetail', 'updateInspect', 'modifySpecial']),
    getsupervisionCode() {
      const a = this.userInfo.postList.some(v => v.postCode === 'J14x1qwxj8izet')
      return a
    },
    moment,
    async showDetail(id) {
      this.id = id
      const res = await this.specialTaskDetail(id)
      this.detailInfo = res.data
      this.teamLeaderCode = res.data.teamLeaderCode
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
    close() {
      this.$refs.modal.close()
    },
    // 提交
    submitOk(type) {
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
        submitType: type,
        taskId: this.detailInfo.taskId,
        userCode: this.userInfo.userCode,
        userName: this.userInfo.userName
      }
      this.modifySpecial(req)
        .then(res => {
          this.isLoad = false
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.$refs.modal.visible = false
            this.$parent.showList()
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

  .content {
    // height: calc(100% - 10px);
    // overflow-y: scroll;
    .detail-info {
      // padding-top: 20px;
      // min-height: 500px;
      // overflow-y: scroll;
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
      width: 60px;
      text-align: center;
    }
  }
</style>
