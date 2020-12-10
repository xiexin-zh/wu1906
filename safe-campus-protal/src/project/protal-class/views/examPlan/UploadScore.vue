<template>
  <a-modal
    width="1000px"
    title="录入成绩"
    @ok="handleOk"
    @cancel="status = false"
    v-model="status"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <div class="upload-title u-fx-jsb u-fx-ac">
      <div>导入成绩文件（本地考试信息：高一一班高考模拟考试）</div>
      <div>
        <a-button type="primary" @click="downTem">模板下载</a-button>
      </div>
    </div>
    <div class="u-mar-t">
      <a href="javascript:;" class="file">
        导入文件
        <input @change="changeFile" type="file" name id />
      </a>
    </div>
    <div class="upload-title u-mar-t">导入信息（带*为必填项）</div>
    <div class="u-mar-t">
      <ul class="u-fx upload-info u-tx-c">
        <li class="u-fx-f1" v-for="(data, index) in dataList" :key="index">
          <div>{{ data.title }}</div>
          <div v-if="selectList.length > 0">
            <a-select v-model="data.value" style="width: 120px">
              <a-select-option :value="item" v-for="(item, _ind) in selectList" :key="_ind">{{ item }}</a-select-option>
            </a-select>
          </div>
        </li>
        <li class="u-fx-f1">
          <div>操作</div>
          <div v-if="selectList.length > 0">
            <a-button type="primary" @click="importScoreFile">导入信息</a-button>
          </div>
        </li>
      </ul>
    </div>
    <div class="upload-title u-mar-t u-mar-b u-fx-ac u-fx-jsb">
      <div>导入结果</div>
      <div>
        <span>成功：{{ successNum }}</span>
        <span class="u-padd-l u-type-error">失败：{{ failureNum }}</span>
      </div>
    </div>
    <table-list :columns="columns" :table-list="userList"></table-list>
  </a-modal>
</template>

<script>
import axios from 'axios'
import hostEnv from '@config/host-env'
import TableList from '@c/TableList'
import { mapActions } from 'vuex'
import XLSX from 'xlsx'
const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '20%'
  },
  {
    title: '学号',
    dataIndex: 'workNo',
    width: '20%'
  },
  {
    title: '结果',
    dataIndex: 'result',
    width: '20%'
  },
  {
    title: '原因',
    dataIndex: 'reason',
    width: '30%'
  }
]
export default {
  name: 'ShowDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    subjectName: {
      type: Array,
      default: () => {
        return []
      }
    },
    planId: {
      type: Number,
      default: 0
    }
  },
  components: {
    TableList
  },
  computed: {
    status: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      successNum: 0,
      failureNum: 0,
      columns,
      loading: false,
      userList: [],
      selectList: [],
      dataList: [
        {
          title: '班级',
          value: ''
        },
        {
          title: '姓名',
          value: ''
        },
        {
          title: '学号',
          value: ''
        }
      ]
    }
  },
  mounted() {
    const subjectName = this.subjectName.map(item => {
      return {
        title: item,
        value: ''
      }
    })
    this.dataList = this.dataList.concat(subjectName)
  },
  methods: {
    ...mapActions('home', ['addImportSetting']),
    handleOk() {
      this.status = false
      this.$emit('submit')
    },
    /**
     * @description 下载模块
     */
    downTem() {
      window.location.href = `${hostEnv.protal_api_11013}/test/score/downloadScoreTemplate?planId=${this.planId}`
    },
    /**
     * @description 选择excle文件
     */
    changeFile(e) {
      const _self = this
      this.uploadFile = e.target.files[0]
      var files = e.target.files
      var fileReader = new FileReader()
      fileReader.onload = function(ev) {
        try {
          const data = ev.target.result
          var workbook = XLSX.read(data, {
            type: 'binary'
          })
          var persons = []
        } catch (e) {
          console.log('文件类型不正确')
          return
        }
        var fromTo = ''
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            fromTo = workbook.Sheets[sheet]['!ref']
            persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          }
        }
        _self.selectList = Object.keys(persons[0])
      }
      // 以二进制方式打开文件
      fileReader.readAsBinaryString(files[0])
    },
    /**
     * @description 提交成绩
     */
    async importScoreFile() {
      const obj = {}
      const params = JSON.parse(JSON.stringify(this.dataList))
      params.splice(3, 0, {
        title: 'planId',
        value: this.planId
      })
      params.forEach(item => {
        obj[item.title] = item.value
      })
      await this.addImportSetting(obj)
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      axios({
        method: 'post',
        url: `${hostEnv.protal_api_11013}/test/score/importScore?planId=${this.planId}`,
        data: formData
      })
        .then(res => {
          if (res.data.code === 200) {
            this.userList = res.data.data.datelist
            this.successNum = res.data.data.successNum
            this.failureNum = res.data.data.failureNum
          } else {
            this.$message.warning('导入成绩失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.warning('导入失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.upload-title {
  border-left: 3px @u-type-primary solid;
  height: 20px;
  line-height: 20px;
  padding-left: 10px;
}
.upload-info {
  & > li {
    line-height: 44px;
    border: 1px @u-border-color solid;
    border-right: none;
    &:last-child {
      border-right: 1px @u-border-color solid;
    }
    div:first-child {
      background-color: #f5f5f5;
      border-bottom: 1px @u-border-color solid;
    }
  }
}
.file {
  position: relative;
  display: inline-block;
  background: #d0eeff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1e88c7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
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
</style>
