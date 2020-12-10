<template>
  <div class="page-layout qui-fx-ver">
    <div class="content pos-box">
      <div class="bg-fff">
        <div class="fill-top u-mar-b20">
          <div class="u-mar-l40">风险管理小组</div>
        </div>
        <div>
          <a-form :form="form">
            <a-form-item label="组长" v-bind="formItemLayout" required>
              <div>
                <template v-for="tag in leaderList">
                  <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag, 'leaderList')">
                    {{ tag.userName }}
                  </a-tag>
                </template>
                <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag('leaderList')">
                  <a-icon type="plus" />添加
                </a-tag>
              </div>
            </a-form-item>
            <a-form-item label="副组长" v-bind="formItemLayout" required>
              <div>
                <template v-for="tag in viceLeaderList">
                  <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag, 'viceLeaderList')">
                    {{ tag.userName }}
                  </a-tag>
                </template>
                <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag('viceLeaderList')">
                  <a-icon type="plus" />添加
                </a-tag>
              </div>
            </a-form-item>
            <a-form-item label="组员" v-bind="formItemLayout" required>
              <div>
                <template v-for="tag in memberList">
                  <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag, 'memberList')">
                    {{ tag.userName }}
                  </a-tag>
                </template>
                <a-tag style="background: #fff; borderStyle: dashed;" @click="addTag('memberList')">
                  <a-icon type="plus" />添加
                </a-tag>
              </div>
            </a-form-item>
            <a-form-item label="应急值班电话：" v-bind="formItemLayout">
              <a-input
                style="width:80%;"
                v-decorator="[
                  'emergencyPhone',
                  {
                    initialValue: emergencyPhone,
                    rules: [{ pattern: phone, required: true, message: '请输入正确的电话号码' }]
                  }
                ]"
                placeholder="请输入电话"
              />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
              <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">保存</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <div class="bg-fff">
        <div class="fill-top u-mar-b20">
          <div class="u-mar-l40">风险管理方案</div>
        </div>
        <div class="qui-fx u-mar-l40">
          <div>文件模板：</div>
          <div>
            <div
              class="qui-fx-jsb u-mar-b10 u-type-primary u-font-01"
              v-for="(list, i) in docList"
              :key="i"
              @click="exportClick(list.url)"
            >
              <span> {{ list.val }} </span>
              <span class="u-mar-l40">下载</span>
            </div>
          </div>
        </div>
        <div class="qui-fx u-mar-l40 u-mar-t10">
          <div>工作任务：</div>
          <div>
            <a-upload
              name="fileList"
              :multiple="true"
              :action="url"
              :data="params"
              :headers="headers"
              :withCredentials="true"
              :showUploadList="false"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <a-button icon="plus" class="add-btn"> 文件上传 </a-button>
            </a-upload>
            <div class="qui-fx down u-mar-t20" v-for="(item, index) in fileList" :key="index">
              <img :src="img" />
              <div class="u-mar-l20 qui-fx-ver u-font-01">
                <div>{{ item.fileName }}</div>
                <div class="qui-fx u-type-primary">
                  <div @click="exportClick(item.fileUrl)">下载</div>
                  <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(item)">
                    <template slot="title"> 确认删除该文件？ </template>
                    <a-tooltip placement="topLeft" title="删除">
                      <div class="u-mar-l20">删除</div>
                    </a-tooltip>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <choose-post
      ref="choosePost"
      is-check
      :teacherList="
        active === 'viceLeaderList'
          ? viceLeaderList
          : active === 'leaderList'
          ? leaderList
          : active === 'memberList'
          ? memberList
          : []
      "
      v-if="userTag"
      v-model="userTag"
      @submit="choosePost"
      title="添加成员"
    ></choose-post>
  </div>
</template>

<script>
import hostEnv from '@config/host-env'
import { mapState, mapActions } from 'vuex'
import img from '../assets/img/wenjian.png'
import ChoosePost from '@c/choose/ChoosePost'
export default {
  name: 'RiskGroup',
  components: {
    ChoosePost
  },
  data() {
    return {
      img,
      headers: {
        authorization: 'authorization-text'
      },
      form: this.$form.createForm(this),
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      },
      detailInfo: {},
      isLoad: false,
      emergencyPhone: '',
      docList: [
        {
          val: '学校风险辨识管控制度.doc',
          url:
            'https://canpoint-file.oss-cn-beijing.aliyuncs.com/prevent/%E5%AD%A6%E6%A0%A1%E9%A3%8E%E9%99%A9%E8%BE%A8%E8%AF%86%E7%AE%A1%E6%8E%A7%E5%88%B6%E5%BA%A6.docx'
        },
        {
          val: '学校双重预防体安全生产责任制.doc',
          url:
            'https://canpoint-file.oss-cn-beijing.aliyuncs.com/prevent/%E5%AD%A6%E6%A0%A1%E5%8F%8C%E9%87%8D%E9%A2%84%E9%98%B2%E4%BD%93%E7%B3%BB%E5%AE%89%E5%85%A8%E7%94%9F%E4%BA%A7%E8%B4%A3%E4%BB%BB%E5%88%B6.docx'
        },
        {
          val: '学校隐患排查治理制度.doc',
          url:
            'https://canpoint-file.oss-cn-beijing.aliyuncs.com/prevent/%E5%AD%A6%E6%A0%A1%E9%9A%90%E6%82%A3%E6%8E%92%E6%9F%A5%E6%B2%BB%E7%90%86%E5%88%B6%E5%BA%A6.docx'
        }
      ],
      userTag: false,
      active: '',
      leaderList: [],
      viceLeaderList: [],
      memberList: [],
      fileList: [],
      url: '',
      params: {},
      phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.url = `${hostEnv.protal_api_10050}/file/upload/doc`
    this.params.schoolCode = this.userInfo.schoolCode
    this.showDetail()
    this._riskFileList()
  },
  methods: {
    ...mapActions('home', ['riskGroupList', 'saveRiskGroup', 'riskFileList', 'addRiskFile', 'delRiskFile']),
    async showDetail() {
      const res = await this.riskGroupList(this.userInfo.schoolCode)
      this.leaderList = this.filterData(0, res.data.leaderList)
      this.viceLeaderList = this.filterData(0, res.data.viceLeaderList)
      this.memberList = this.filterData(0, res.data.memberList)
      this.emergencyPhone = res.data.emergencyPhone
    },
    async _riskFileList(info) {
      const result = await this.riskFileList(this.userInfo.schoolCode)
      this.fileList = result.data
    },
    addTag(type) {
      this.active = type
      this.userTag = true
    },
    choosePost(list) {
      this[this.active] = list
      this.$refs.choosePost.reset()
    },
    userClose(removedTag, string) {
      this[string] = this[string].filter(tag => tag !== removedTag)
    },
    async _addRiskFile(info) {
      const req = {
        fileName: info.file.name,
        fileUrl: info.file.response.data[0],
        schoolCode: this.userInfo.schoolCode
      }
      this.addRiskFile(req).then(res => {
        this.$message.success(`${info.file.name} 上传成功`)
        this.$tools.goNext(() => {
          this.isLoad = false
          this._riskFileList()
        })
      })
    },
    beforeUpload(file) {
      console.log(file)
      const isDoc =
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
      const isPdf = file.type === 'application/pdf'
      const isXlsx =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isDoc && !isPdf && !isXlsx) {
        this.$message.error('请上传格式的文件(doc/docx/pdf/xlsx/xls)')
        return false
      }
    },
    handleChange(info) {
      if (info.file.status !== 'uploading' && info.file.status !== 'removed') {
        if (info.file.response) {
          this.$message.error(info.file.response.message)
        }
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          this._addRiskFile(info)
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败`)
      }
    },
    async del(record) {
      await this.delRiskFile(record.id)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._riskFileList()
      })
    },
    exportClick(url) {
      window.open(url)
    },
    filterData(type, data) {
      const newData = data.map(el => {
        if (type) {
          return {
            code: el.userCode,
            name: el.userName
          }
        } else {
          return {
            userCode: el.code,
            userName: el.name
          }
        }
      })
      return newData
    },
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.leaderList.length === 0 || this.viceLeaderList.length === 0 || this.memberList.length === 0) {
            this.$message.warning('请选择人员')
            return
          }
          values.schoolCode = this.userInfo.schoolCode
          values.leaderList = this.filterData(1, this.leaderList)
          values.viceLeaderList = this.filterData(1, this.viceLeaderList)
          values.memberList = this.filterData(1, this.memberList)
          this.saveRiskGroup(values)
            .then(() => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.isLoad = false
                this.showDetail()
              })
            })
            .catch(() => {
              this.isLoad = false
            })
        }
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
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: 18px;
      width: 3px;
      background-color: #4d4cac;
      left: 25px;
      bottom: 15px;
    }
  }
  img {
    width: 25px;
    height: 32px;
  }
  .down {
    height: 40px;
  }
}
</style>
