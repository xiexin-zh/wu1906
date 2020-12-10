<template>
  <div class="system-template page-layout u-type-white-bg u-fx-ver">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload">
        <img :src="templateUrl" v-if="templateUrl" class="cover" alt />
        <a href="javascript:;" class="a-upload mr10">
          <input @change="chooseFile($event, 'pic')" type="file" name="myFiles" id />上传模板图片
        </a>
      </div>
    </submit-form>
    <a-tabs v-model="currentKey" @change="changeType">
      <a-tab-pane :key="index" :tab="tab.title" v-for="(tab, index) in typeList"></a-tab-pane>
      <a-button
        v-if="currentKey !== 0"
        @click="_editTemplate(false, '新增模板')"
        icon="plus"
        type="primary"
        class="u-mar-r10"
        slot="tabBarExtraContent"
      >新增模板</a-button>
    </a-tabs>
    <div class="u-fx-1 u-auto">
      <div class="template-show">
        <div>
          <no-data msg="暂未添加模板~" v-if="templateList.length === 0"></no-data>
        </div>
        <div class="template-list" v-for="(template, index) in templateList" :key="index">
          <div class="u-fx-ac u-fx-jsb title">
            <div class="name u-bold u-font-2">{{ template.templateTitle }}</div>
            <div>
              <a-tag color="blue" @click="_editTemplate(true, '编辑模板', template)">编辑</a-tag>
              <a-popconfirm
                placement="left"
                okText="确定"
                cancelText="取消"
                @confirm="delTem(template.id)"
              >
                <template slot="title">您确定删除吗?</template>
                <a-tooltip placement="topLeft" title="删除">
                  <a-tag color="red">删除</a-tag>
                </a-tooltip>
              </a-popconfirm>
              <a-button
                v-if="template.topStatus !== 1"
                type="primary"
                @click="goTop(template, 1)"
                size="small"
              >推荐</a-button>
              <a-button
                v-if="template.topStatus === 1"
                type="primary"
                @click="goTop(template, 2)"
                size="small"
              >取消推荐</a-button>
            </div>
          </div>
          <div class="pic">
            <img :src="template.templateUrl" alt />
          </div>
          <div>
            <textarea readonly class="content" v-model="template.templateBody"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NoData from '@c/NoData'
import SubmitForm from '@c/SubmitForm'
const formData = [
  {
    value: 'templateTitle',
    initValue: '',
    type: 'input',
    label: '模块名称',
    max: 30, // 最大长度
    placeholder: '请输入模块名称'
  },
  {
    value: 'templateBody',
    initValue: '',
    type: 'textarea',
    label: '模块内容',
    placeholder: '请输入模板内容'
  },
  {
    type: 'upload',
    label: '上传图片'
  }
]
export default {
  name: 'SystemTemplate',
  components: { SubmitForm, NoData },
  data() {
    return {
      isTop: false,
      title: '',
      formData,
      formStatus: false,
      currentKey: 0,
      typeList: [
        {
          type: 0,
          title: '推荐模板'
        },
        {
          type: 1,
          title: '温馨提示'
        },
        {
          type: 2,
          title: '班级通知'
        },
        {
          type: 3,
          title: '预防通知'
        },
        {
          type: 4,
          title: '节假日'
        }
      ],
      templateUrl: '',
      templateList: []
    }
  },
  mounted() {
    this._getTemplateList()
  },
  methods: {
    ...mapActions('home', ['getTemplateList', 'delTemplate', 'modifyTemplate', 'addTemplate']),
    // 上传图片
    chooseFile(event) {
      const file = event.target.files[0]
      const fileType = event.target.files[0].name.split('.')[1]
      this.$tools.ossUpload('CANPOINT', file, fileType, res => {
        console.log(res)
        this.templateUrl = res.data.url
      })
    },
    changeType() {
      this._getTemplateList()
    },
    goTop(records, type) {
      this.isEdit = true
      this.id = records.id
      this.templateCode = records.templateCode
      this.templateUrl = records.templateUrl
      this.topStatus = type
      this.actionFun = 'modifyTemplate'
      this.submitForm(records)
    },
    async _getTemplateList() {
      const res = await this.getTemplateList({
        ownerCode: '',
        pageNum: 1,
        pageSize: 30,
        schoolCode: 'CANPOINT',
        templateTitle: '',
        templateType: this.currentKey || '',
        topStatus: this.currentKey === 0 ? 1 : ''
      })
      this.templateList = res.data.records
    },
    _editTemplate(tag, title, records) {
      this.formStatus = true
      this.title = title
      this.isEdit = tag
      if (tag) {
        this.id = records.id
        this.templateCode = records.templateCode
        this.templateUrl = records.templateUrl
        this.topStatus = records.topStatus
        this.actionFun = 'modifyTemplate'
        this.formData = this.$tools.fillForm(formData, records)
      } else {
        this.id = ''
        this.templateCode = ''
        this.templateUrl = ''
        this.topStatus = 2
        this.actionFun = 'addTemplate'
        this.formData = formData
      }
    },
    async submitForm(values) {
      console.log(values)
      if (!this.templateUrl) {
        this.$message.warning('请上传封面图片')
        return
      }
      const params = {
        annexInfoDTOS: [],
        createTime: this.$tools.getDate(new Date().getTime()),
        id: '',
        templateCode: '',
        ownerCode: '',
        schoolCode: 'CANPOINT',
        templateBody: values.templateBody,
        templateTitle: values.templateTitle,
        templateUrl: this.templateUrl,
        templateType: this.currentKey,
        topStatus: this.topStatus
      }
      if (this.isEdit) {
        params.id = this.id
        params.templateCode = this.templateCode
      }
      try {
        await this[this.actionFun](params)
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$refs.form.reset()
          this._getTemplateList()
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    async delTem(id) {
      try {
        await this.delTemplate(id)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this._getTemplateList()
        })
      } catch (err) {}
    }
  }
}
</script>
<style lang="less" scoped>
.cover {
  width: 300px;
  height: 150px;
  display: block;
  margin: 20px 0;
}
.a-upload {
  padding: 4px 10px;
  /*height: 34px;*/
  line-height: 28px;
  position: relative;
  cursor: pointer;
  color: #fff;
  background-color: #286090;
  border-color: #204d74;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
}
.a-upload input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
.a-upload:hover {
  color: #ffffff;
  background: #337ab7;
  border-color: #204d74;
  text-decoration: none;
}
.system-template {
  .template-list {
    border: 2px #f5f5f5 solid;
    box-shadow: 0 0 4px #eee;
    width: 23%;
    margin-left: 1.6%;
    float: left;
    .title {
      padding: 0 10px;
      height: 40px;
    }
    .pic {
      width: 100%;
      height: 150px;
      background-color: @u-bg-color;
      img {
        width: 100%;
        height: 150px;
        display: block;
      }
    }
    .content {
      overflow: hidden;
      border: none;
      width: 100%;
      height: 250px;
      color: @u-content-color;
      line-height: 24px;
      padding: 10px;
    }
  }
}
</style>
