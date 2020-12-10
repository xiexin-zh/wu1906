<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="940px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
  >
    <a-form :form="form">
      <a-form-item label="方案名称：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          v-decorator="[
            'name',
            {
              initialValue: appForm.name,
              rules: [{ required: true, message: '请填写方案名称' }]
            }
          ]"
          placeholder="请填写方案名称"
        />
      </a-form-item>
      <a-form-item label="方案说明：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input v-decorator="['remark', { initialValue: appForm.remark }]" placeholder="请填写方案说明" />
      </a-form-item>
      <a-form-item label="方案设置：" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div class="qui-fx-ac mar-t5 mar-b10">
          <a-button icon="plus" class="add-btn" @click="add(0)">添加</a-button>
          <a-button icon="download" class="play-action-btn" @click="download">模板下载</a-button>
          <a-button class="file" icon="upload"
            >导入
            <input type="file" ref="importFile" @change="handleChange" accept=".xls, .xlsx" />
          </a-button>
        </div>
        <div class="project-box">
          <div v-for="list in project" :key="list.key">
            <div class="qui-fx">
              <div class="tip">*</div>
              检查项名称：<a-input style="width:20%" v-model="list.name"></a-input>
              <div class="add-index mar-l10" @click="add(1, list)">添加指标</div>
              <div class="del-index mar-l10" @click="delJcx(list)">删除</div>
            </div>
            <div v-for="item in list.indexDtoList" :key="item.key">
              <div class="qui-fx">
                <div class="tip">*</div>
                指标内容：<a-input style="width:30%" v-model="item.name"></a-input>
                <div class="tip mar-l10">*</div>
                <div>指标分值：</div>
                <a-input-number style="width:30%" v-model="item.score"></a-input-number>
                <div class="del-index mar-l10" @click="del(list, item)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="授权查看人" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div>
          <template v-for="tag in teacherList">
            <a-tag :key="tag.userCode" :closable="true" :afterClose="() => userClose(tag)">
              {{ tag.userName }}
            </a-tag>
          </template>
          <a-tag @click="addTag" style="background: #fff; borderStyle: dashed;"> <a-icon type="plus" />添加 </a-tag>
        </div>
      </a-form-item>
    </a-form>
    <choose-user
      ref="chooseUser"
      is-check
      v-if="userTag"
      v-model="userTag"
      @submit="chooseUser"
      title="添加授权查看人员"
    >
    </choose-user>
  </a-modal>
</template>

<script>
import hostEnv from '@config/host-env'
import XLSX from 'xlsx'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import ChooseUser from '@c/ChooseUser'
export default {
  name: 'AddScore',
  components: {
    ChooseUser
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userTag: false,
      studentTag: false,
      remark: '',
      value: 1,
      radioStyle: {
        display: 'block',
        height: '45px',
        lineHeight: '45px'
      },
      searchForm: {
        page: 1,
        start: 0,
        size: 20
      },
      zbCount: 0,
      name: '',
      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {},
      cycle: 'D',
      scoreId: '',
      teacherList: [],
      project: [],
      disabled: false,
      regex: false,
      headers: {
        authorization: 'authorization-text'
      },
      defaultFileList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  methods: {
    ...mapActions('home', ['addStuCategory']),
    moment,
    download() {
      var url = `${hostEnv.protal_api_11012}/category/excel/downTemplateFile`
      window.open(url)
    },
    addTag() {
      this.userTag = true
      setTimeout(() => {
        this.$refs.chooseUser.chooseList = this.teacherList.map(el => {
          return el.userId ? el.userId : el.id
        })
        this.$refs.chooseUser.totalList = this.teacherList.map(el => {
          return {
            ...el,
            detailId: el.id,
            id: el.userId ? el.userId : el.id
          }
        })
      }, 100)
    },
    // 添加指标和内容
    add(type, record) {
      if (type) {
        let length = record.indexDtoList.length
        this.project.filter((el, index) => {
          if (el.key === record.key) {
            const newData = {
              key: length
            }
            this.project[index].indexDtoList = [...this.project[index].indexDtoList, newData]
            length = length + 1
          }
        })
      } else {
        const { zbCount, project } = this
        const newData = {
          key: zbCount,
          indexDtoList: []
        }
        this.project = [...project, newData]
        this.zbCount = zbCount + 1
      }
    },
    // 删除指标
    del(list, item) {
      this.project.filter(el => {
        if (el.id === list.id) {
          el.indexDtoList = el.indexDtoList.filter(i => i !== item)
        }
      })
    },
    // 删除检查项
    delJcx(list) {
      this.project = this.project.filter(i => i !== list)
    },
    // 授权查看人删除
    userClose(removedTag) {
      this.teacherList = this.teacherList.filter(tag => tag !== removedTag)
    },
    // 授权查看人选择
    chooseUser(teacherList) {
      this.teacherList = teacherList
      this.$refs.chooseUser.reset()
    },
    regexForm() {
      this.project.map(el => {
        if (el.indexDtoList.length === 0 || !el.name) {
          this.regex = true
        } else {
          this.regex = false
        }
        el.indexDtoList.map(item => {
          if (!item.name || !item.score) {
            this.regex = true
          } else {
            this.regex = false
          }
        })
      })
    },
    handleChange(e) {
      // 表格导入
      const files = e.target.files
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
          const afterData = []
          const tempArr = []
          for (let i = 0; i < ws.length; i++) {
            if (tempArr.indexOf(ws[i]['检查项名称']) === -1) {
              afterData.push({
                name: ws[i]['检查项名称'],
                检查项名称: ws[i]['检查项名称'],
                key: this.project.length + afterData.length,
                indexDtoList: [{ name: ws[i]['指标名称'], score: ws[i]['指标分值'], key: afterData.length }]
              })
              tempArr.push(ws[i]['检查项名称'])
            } else {
              for (let j = 0; j < afterData.length; j++) {
                if (afterData[j]['检查项名称'] === ws[i]['检查项名称']) {
                  afterData[j].indexDtoList.push({
                    name: ws[i]['指标名称'],
                    score: ws[i]['指标分值'],
                    key: afterData.length
                  })
                  break
                }
              }
            }
          }
          this.project = this.project.concat(afterData)
          this.zbCount = this.project.length
          this.$refs.importFile.value = null
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    // 提交
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.regexForm()
        this.isLoad = false
        if (!error) {
          if (this.project.length === 0) {
            this.$message.warning('请添加方案设置项')
          }
          if (this.teacherList.length === 0) {
            this.$message.warning('请添加授权查看人')
          }
          values.id = this.title === '编辑评分方案' ? this.scoreId : ''
          values.state = '1'
          values.type = '1'
          values.schoolCode = this.userInfo.schoolCode
          values.cycle = this.cycle
          values.eduUserDtoList = this.teacherList.map(el => {
            return {
              userCode: el.userCode,
              userId: el.userId ? el.userId : el.id,
              userName: el.userName,
              id: el.detailId ? el.detailId : undefined
            }
          })
          if (this.regex) {
            this.$message.warning('请填写完整的方案设置')
            this.isLoad = false
            return false
          } else {
            values.eduItemsDtos = this.project
          }
          if (this.title === '新增评分方案') {
            values.eduItemsDtos.map((el, index) => {
              el.id = ''
              el.indexDtoList.map((item, i) => {
                item.id = ''
              })
            })
          }
          this.isLoad = true
          this.addStuCategory(values)
            .then(res => {
              this.addVisible = false
              this.isLoad = false
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            })
            .catch(res => {
              this.isLoad = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.project-box {
  max-height: 500px;
  overflow-y: scroll;
  .add-index {
    color: @main-color;
    cursor: pointer;
  }
  .del-index {
    color: @tip-color;
    cursor: pointer;
  }
  .tip {
    color: #f5222d;
    font-weight: bold;
    margin-right: 5px;
  }
  .select-ml {
    margin-left: 23px;
  }
}
.ant-calendar-picker {
  width: 100% !important;
}
.file {
  position: relative;
  display: inline-block;
  background: #67dabf;
  padding: 4px 12px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  text-indent: 0;
}
.file input {
  position: absolute;
  font-size: 30px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}
.mar-t5 {
  margin-top: 5px;
}
</style>
