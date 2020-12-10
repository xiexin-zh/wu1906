<template>
  <a-modal width="800px" :title="title" v-model="visible" :footer="null" @cancel="visible = false">
    <div class="qui-fx-ver">
      <div class="top bg-fff u-padd-10 u-padd-l20">
        <div class="u-tx-c">{{ detailInfo.taskName }}</div>
        <div class="qui-fx-jc u-mar-t10">
          <div class="qui-fx-ver">
            <div>发布人：{{ detailInfo.userName }}</div>
            <div class="u-mar-t10">任务开始时间：{{ detailInfo.beginTime | gmtToDate }}</div>
          </div>
          <div class="qui-fx-ver u-mar-l20">
            <div>发布时间：{{ detailInfo.completeTime | gmtToDate }}</div>
            <div class="u-mar-t10">任务结束时间：{{ detailInfo.endTime | gmtToDate }}</div>
          </div>
        </div>
      </div>
      <div class="u-mar-t10 bg-fff u-padd-10 u-padd-l20">
        <div class="qui-fx">
          <no-data
            msg="暂无题目~"
            v-if="
              radioList &&
                checkList &&
                fillList &&
                fileList &&
                radioList.length === 0 &&
                checkList.length === 0 &&
                fillList.length === 0 &&
                fileList.length === 0
            "
          ></no-data>
          <div class="qui-fx-f1" v-else>
            <div class="u-mar" v-if="radioList.length !== 0">
              <div>单选题</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in radioList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-radio-group v-model="list.answer[0]">
                        <a-radio v-for="(element, index) in list.content" :value="element" :key="index">{{
                          element
                        }}</a-radio>
                      </a-radio-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="checkList.length !== 0">
              <div>多选题</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in checkList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-checkbox-group v-model="list.answer">
                        <a-checkbox v-for="(element, index) in list.content" :value="element" :key="index">{{
                          element
                        }}</a-checkbox>
                      </a-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="fillList.length !== 0">
              <div>填空题</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in fillList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-ver u-mar-l20">
                    <div class="u-mar-b10">{{ list.title }}</div>
                    <a-input v-model="list.answer[0]" />
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="fileList.length !== 0">
              <div>附件</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in fileList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <img class="u-mar-r10" :src="img" alt /> 附件
                      <span class="u-type-primary" @click="exportClick(list.answer[0])">下载</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-deal">
          <div class="detail-title">
            <div class="title u-mar-b20">处理流程</div>
          </div>
          <a-timeline class="time-line">
            <a-timeline-item v-for="(item, index) in processes" :key="index">
              <div class="qui-fx">
                <div class="time-left">{{ item.content }}</div>
                <div class="qui-fx-f1">{{ item.createTime | gmtToDate }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import NoData from '@c/NoData'
import moment from 'moment'
import img from '../assets/img/wenjian.png'
export default {
  name: 'TaskStatus',
  components: {
    NoData
  },
  data() {
    return {
      img,
      radioList: [],
      checkList: [],
      fillList: [],
      fileList: [],
      taskCode: '',
      params: {},
      docUrl: '',
      show: true,
      flag: false,
      detailInfo: {},
      visible: false,
      processes: {},
      title: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['reportTaskDetail']),
    moment,
    // 获取详情
    async showDetail(record) {
      const req = {
        schoolCode: record.schoolCode,
        taskCode: record.taskCode
      }
      const res = await this.reportTaskDetail(req)
      this.detailInfo = res.data
      let questions = []
      this.radioList = []
      this.checkList = []
      this.fillList = []
      this.fileList = []
      questions = res.data.outUserAnswersDtoList.map((el, index) => {
        return {
          ...el,
          key: index,
          pointList: el.content
            ? el.content.map((item, i) => {
                return {
                  key: i,
                  content: item
                }
              })
            : []
        }
      })
      questions.map(el => {
        if (el.questionType === '1') {
          this.radioList.push(el)
        } else if (el.questionType === '2') {
          this.checkList.push(el)
        } else if (el.questionType === '3') {
          this.fillList.push(el)
        } else {
          this.fileList.push(el)
        }
      })
      this.processes = res.data.outSafeTaskProcessDtoList
    },
    exportClick(docUrl) {
      if (docUrl) {
        const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${docUrl}`
        window.open(url)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  // height: calc(100% - 10px);
  // overflow-y: scroll;
  .fill-top {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #4d4cac;
    border-bottom: 1px solid #ccc;
    .fill-head {
      text-align: center;
      border-bottom: 3px solid #4d4cac;
    }
    .task {
      width: 70px;
    }
    .report {
      width: 100px;
    }
  }
  .ant-calendar-picker {
    width: 100% !important;
  }
}
.top {
  border-bottom: 1px solid #ccc;
}
.subject {
  background-color: #fafafa;
}
</style>
