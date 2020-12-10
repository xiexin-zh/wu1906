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
        <div class="rich-text u-padd-l40 u-padd-r40" v-html="detailInfo.des"></div>
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
                      <a-radio-group v-model="list.answers[0]" :disabled="disabled">
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
                      <a-checkbox-group v-model="list.answers" :disabled="disabled">
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
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-input style="width:100%" :disabled="disabled" v-model="list.answers[0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="fileList.length !== 0">
              <div>附件</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10 u-padd-r20" v-for="(list, i) in fileList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10" v-if="disabled">
                      <img class="u-mar-r10" :src="img" alt /> 附件
                      <text class="u-type-primary" @click="exportClick(list.answers[0])">下载</text>
                    </div>
                    <div class="u-mar-t10" v-else>
                      <a-upload
                        name="fileList"
                        :multiple="false"
                        :action="url"
                        :data="params"
                        :remove="value => handleRemove(value, i)"
                        @change="value => handleChange(value, i)"
                        v-if="list.show"
                      >
                        <a-button :disabled="flag"> <a-icon type="upload" />上传附件 </a-button>
                      </a-upload>
                      <div v-else>
                        <img class="u-mar-r10" :src="img" alt /> 附件
                        <span class="u-type-primary" @click="exportClick(list.answers[0])">下载</span>
                        <a-button
                          class="del-action-btn mar-l10"
                          icon="delete"
                          size="small"
                          @click="delFile(i)"
                        ></a-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="u-tx-c u-mar-t20" v-if="!disabled">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
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
  name: 'TaskPreview',
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
      docName: '',
      detailInfo: {},
      disabled: false,
      show: true,
      params: {},
      isLoad: false,
      flag: false,
      status: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.status = this.$route.query.status
    this.taskTemplateCode = this.$route.query.taskTemplateCode
    this.taskCode = this.$route.query.taskCode
    this.url = `${hostEnv.protal_api_10050}/file/upload/doc`
    this.taskId = this.$route.query.id
    this.disabled = this.$route.query.state === '0'
    this.params.schoolCode = this.userInfo.schoolCode
    this.showDetail()
  },
  methods: {
    ...mapActions('home', ['previewTask', 'previewMyTask', 'answerTask']),
    moment,
    // 获取详情 previewMyTask
    async showDetail() {
      const req = {
        query: this.taskId
      }
      const res = await this.previewMyTask(req)
      this.detailInfo = res.data
      const questions = res.data.answers.map((el, index) => {
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
          this.fileList.push({ ...el, show: false })
        }
      })
      this.docName = res.data.docName
    },
    delFile(i) {
      this.fileList[i].show = true
      this.fileList[i].docName = ''
      this.fileList[i].answers = []
      console.log('this.fileList', this.fileList)
    },
    handleRemove(info, i) {
      console.log(1243)
      this.fileList[i].show = true
    },
    handleChange(info, i) {
      this.flag = true
      if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
        this.flag = false
        if (info.file.response) {
          this.$message.error(info.file.response.message)
        }
      }
      if (info.file.status === 'done') {
        this.flag = false
        if (info.file.response.code === 200) {
          this.fileList[i].show = false
          this.fileList[i].docName = info.file.name
          this.fileList[i].docUrl = info.file.response.data[0]
          this.fileList[i].answers = [info.file.response.data[0]]
          this.$message.success(`${info.file.name} 上传成功`)
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.flag = false
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    exportClick(docUrl) {
      if (docUrl) {
        const url = `${hostEnv.protal_api_10050}/file/downLoad/doc?url=${docUrl}`
        window.open(url)
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    submitOk() {
      const req = {
        taskCode: this.taskCode,
        taskId: this.taskId,
        taskTemplateCode: this.taskTemplateCode,
        userCode: this.userInfo.userCode
      }
      const arr = this.radioList
        .concat(this.checkList)
        .concat(this.fillList)
        .concat(this.fileList)
      const answers = arr.map(el => {
        return {
          answers: el.answers,
          questionTemplateId: el.questionTemplateId,
          questionType: el.questionType
        }
      })
      const isTrue = []
      answers.forEach(element => {
        if (element.answers.length === 0) {
          isTrue.push(1)
        }
        element.answers.forEach(el => {
          if (!el) {
            isTrue.push(1)
          }
        })
      })
      if (isTrue.length > 0) {
        this.$message.warning('请填写完整题目')
        return false
      }
      req.answers = answers
      if (this.status === '5') {
        req.state = '6'
      }
      this.isLoad = true
      this.answerTask(req)
        .then(res => {
          this.isLoad = false
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.cancel()
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
<style lang="less">
.rich-text {
  width: 100%;
  max-height: 400px;
  overflow: scroll;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
