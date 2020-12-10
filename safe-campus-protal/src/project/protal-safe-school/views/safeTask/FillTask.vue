<template>
  <div class="fill page-layout">
    <div class="pos-box content">
      <div class="qui-fx-ver">
        <div class="qui-fx-f1">
          <div class="bg-fff u-padd-10 u-padd-l20">
            <div class="fill-top">
              <div class="fill-head task">任务内容</div>
            </div>
            <div>
              <div class="title">{{ detailInfo.taskName }}</div>
              <div class="qui-fx-jc u-mar-t10">
                <div class="qui-fx-ver">
                  <div>发布人：{{ detailInfo.publisherName }}</div>
                  <div>任务开始时间：{{ detailInfo.beginTime | gmtToDate('date') }}</div>
                </div>
                <div class="qui-fx-ver u-mar-l20">
                  <div>发布时间：{{ detailInfo.publisherTime | gmtToDate }}</div>
                  <div>任务结束时间：{{ detailInfo.endTime | gmtToDate('date') }}</div>
                </div>
              </div>
              <div class="rich-text u-padd-l40 u-padd-r40" v-html="detailInfo.des"></div>
              <div class="fill-describe u-mar-t10 u-padd-l10 u-padd-r10">{{ detailInfo.reason }}</div>
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
          </div>
          <div class="u-mar-t10 bg-fff u-padd-10 u-padd-l20">
            <div class="fill-top">
              <div class="fill-head report">要求上报内容</div>
            </div>
            <div class="u-mar" v-if="radioList.length !== 0">
              <div>单选题</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in radioList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-radio-group v-model="list.answer">
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
                <div class="qui-fx u-mar-t10 u-padd-r20" v-for="(list, i) in fillList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-f1 qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-input style="width:100%" placeholder="请填写答案" v-model="list.answer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="u-mar" v-if="fileList.length !== 0">
              <div>附件</div>
              <div class="subject u-mar-t10 u-padd-l20 u-padd-t10 u-padd-b10">
                <div class="qui-fx u-mar-t10" v-for="(list, i) in fileList" :key="i">
                  <div class="qui-fx-ver">题目是：</div>
                  <div class="qui-fx-ver u-mar-l20">
                    <div>{{ list.title }}</div>
                    <div class="u-mar-t10">
                      <a-upload
                        name="fileList"
                        :multiple="false"
                        :action="url"
                        :data="params"
                        :remove="value => handleRemove(value, i)"
                        @change="value => handleChange(value, i)"
                        v-if="list.show"
                      >
                        <a-button> <a-icon type="upload" />上传附件 </a-button>
                      </a-upload>
                      <div v-if="!list.show">
                        {{ list.docName }}
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
          <div class="u-tx-c u-mar-t20">
            <a-button @click="cancel">取消</a-button>
            <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
import img from '../../assets/img/wenjian.png'
export default {
  name: 'FillTask',
  components: {
    UploadMulti
  },
  data() {
    return {
      img,
      params: {},
      isLoad: false,
      detailInfo: {},
      radioList: [],
      checkList: [],
      fillList: [],
      fileList: [],
      url: '',
      show: true,
      state: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.url = `${hostEnv.protal_api_10050}/file/upload/doc`
    this.params.schoolCode = this.userInfo.schoolCode
    this.taskId = this.$route.query.id
    this.taskCode = this.$route.query.taskCode
    this.taskTemplateCode = this.$route.query.taskTemplateCode
    this.state = this.$route.query.status
    if (this.taskId) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['myTaskDetail', 'answerTask']),
    async showDetail() {
      const res = await this.myTaskDetail({ id: this.taskId })
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
          this.fileList.push({ ...el, show: true })
        }
      })
    },
    handleRemove(info, i) {
      this.fileList[i].show = true
    },
    handleChange(info, i) {
      if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
        if (info.file.response) {
          this.$message.error(info.file.response.message)
        }
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this.fileList[i].show = false
          this.fileList[i].docName = info.file.name
          this.fileList[i].docUrl = info.file.response.data[0]
          this.fileList[i].answer = [info.file.response.data[0]]
          this.$message.success(`${info.file.name} 上传成功`)
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    delFile(i) {
      this.fileList[i].show = true
      this.fileList[i].docName = ''
      this.fileList[i].answers = []
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
          answers: Array.isArray(el.answer) ? el.answer : [el.answer],
          questionTemplateId: el.questionTemplateId,
          questionType: el.questionType
        }
      })
      const isTrue = []
      answers.forEach(element => {
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
      req.state =
        this.state === '1' || this.state === '2' ? '2' : this.state === '5' || this.state === '6' ? '6' : this.state
      req.answers = answers
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
.fill {
  background-color: #f4f7fc;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
  }
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
  }
  .title {
    height: 35px;
    font-size: 18px;
    text-align: center;
    margin: 20px 10px 0 10px;
    border-bottom: 1px solid #4d4cac;
  }
}
.tip {
  text-align: center;
  color: #4d4cac;
  font-size: 20px;
}
.fill-describe {
  text-indent: 2em;
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
.task {
  width: 70px;
}
.report {
  width: 100px;
}
.subject {
  background-color: #fafafa;
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
