<template>
  <div class="page-layout qui-fx-ver">
    <div class="content pos-box">
      <div class="top bg-fff u-padd-10 u-padd-l20">
        <div class="fill-top u-mar-b20">
          <div class="fill-head task">任务内容</div>
        </div>
        <div class="u-tx-c">{{ detailInfo.taskName }}</div>
        <div class="qui-fx-jc u-mar-t10">
          <div class="qui-fx-ver">
            <div>发布人：{{ detailInfo.publisherName }}</div>
            <div class="u-mar-t10">任务开始时间：{{ detailInfo.startDate | gmtToDate('date') }}</div>
          </div>
          <div class="qui-fx-ver u-mar-l20">
            <div>发布时间：{{ detailInfo.publisherDate | gmtToDate }}</div>
            <div class="u-mar-t10">任务结束时间：{{ detailInfo.endDate | gmtToDate('date') }}</div>
          </div>
        </div>
        <div class="u-padd-l40 u-padd-r40" v-html="detailInfo.des"></div>
        <div class="u-mar-t20">
          <div class="upload u-mar-l20 u-mar-r20 u-mar-b10">
            <div class="upload-title">附件上传</div>
          </div>
          <div class="u-mar-l20">
            <img class="u-mar-r10" :src="img" alt />
            {{ detailInfo.docName }}
            <span class="u-type-primary" @click="exportClick(detailInfo.docUrl)">下载</span>
          </div>
        </div>
      </div>
      <div class="u-mar-t10 bg-fff u-padd-10 u-padd-l20">
        <div class="fill-top">
          <div class="fill-head report">要求上报内容</div>
        </div>
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
                      <a-radio-group>
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
                      <a-checkbox-group>
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
                    <div>{{ list.title }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="fileList.length !== 0">
              <div>附件</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in fileList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx u-mar-l20">
                    <div>{{ list.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import hostEnv from '@config/host-env'
import NoData from '@c/NoData'
import moment from 'moment'
import img from '../../assets/img/wenjian.png'
export default {
  name: 'TaskDetail',
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
      form: this.$form.createForm(this),
      times: [],
      url: '',
      docUrl: '',
      show: true,
      flag: false,
      docName: '',
      detailInfo: {}
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.taskId = this.$route.query.id
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['previewTask']),
    moment,
    // 获取详情
    async showDetail() {
      const req = {
        query: this.taskId
      }
      const res = await this.previewTask(req)
      this.detailInfo = res.data
      const questions = res.data.questions.map((el, index) => {
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
            : undefined
        }
      })
      questions.map(el => {
        if (el.questionType === '1') {
          this.radioList.push(el)
          this.radioCount = this.radioList.length
        } else if (el.questionType === '2') {
          this.checkList.push(el)
          this.checkCount = this.checkList.length
        } else if (el.questionType === '3') {
          this.fillList.push(el)
          this.fillCount = this.fillList.length
        } else {
          this.fileList.push(el)
          this.fileCount = this.fileList.length
        }
      })
      this.docName = 'res.data.docName'
      this.show = !res.data.docUrl
      this.flag = !res.data.docUrl
    },
    handleChange() {},
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
  height: calc(100% - 10px);
  overflow-y: scroll;
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
.upload {
  height: 25px;
  border-bottom: 1px solid #4d4cac;
  .upload-title {
    margin-left: 15px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 5px;
      background-color: #4d4cac;
      left: -15px;
      top: 3px;
    }
  }
}
img {
  width: 30px;
  height: 30px;
}
</style>
