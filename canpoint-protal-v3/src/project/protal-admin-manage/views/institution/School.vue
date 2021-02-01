<template>
  <div class="school page-layout u-fx-ver u-type-white-bg">
    <u-space direction="vertical" class="layout-padd">
      <u-search-form :search-label="searchColumns.school" @search="search">
        <div slot="left">
          <u-space>
            <u-button icon="plus" @click="change" type="primary">添加学校</u-button>
          </u-space>
        </div>
      </u-search-form>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        is-zoom
        :page-list="pageList"
        :columns="tableColumns.school"
        :table-list="schoolList"
        v-model="chooseList"
      >
        <template v-slot:actions="action">
          <u-button type="link" @click="goDetial('/institution/schDetail', action)">详情</u-button>
          <u-button type="link" @click="change(1, action)">编辑</u-button>
          <!-- <u-button type="link" delete @click="del">删除</u-button> -->
        </template>
        <template v-slot:slotOne="slotOne">
          <div class="u-fx-ac">
            <img v-if="slotOne.record.appQrCode" :src="slotOne.record.appQrCode" style="width: 35px; height: 35px;" />
            <a-upload
              name="file"
              :multiple="false"
              :showUploadList="false"
              :before-upload="(value)=> beforeUpload(slotOne, value)">
              <a-icon type="upload" class="u-type-primary-dark u-mar-l10"/>
            </a-upload>
          </div>
        </template>
      </u-table>
    </div>
    <u-pagination justify="end" v-model="pageList" :total="total" @change="_getSchool"></u-pagination>
    <add-school ref="addSchool" :title="title" @update="_getSchool" :disabled="disabled"></add-school>
  </div>
</template>

<script>
import tableColumns from '../../table-columns/tableColumns.js'
import searchColumns from '../../search-columns/searchColumns.js'
import { mapActions, mapState } from 'vuex'
import AddSchool from '../../component/AddSchool.vue'
export default {
  name: 'School',
  components: {
    AddSchool
  },
  data() {
    return {
      searchColumns,
      tableColumns,
      schoolList: [],
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      total: 0,
      title: '添加',
      disabled: false,
      imgList: [],
      fileList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this._getSchool()
  },
  methods: {
    ...mapActions('home', ['getSchool', 'delSchool', 'getProvinces', 'updateQrcode']),
    async _getSchool() {
      this.searchList.schoolCode = this.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getSchool(this.searchList)
      this.schoolList = res.data.records
      this.total = res.data.total
    },
    change(type, record) {
      if (type) {
        this.title = '编辑'
        this.disabled = true
      } else {
        this.title = '新增'
        this.disabled = false
      }
      this.$refs.addSchool._schoolDetail(type, type ? record.record.schoolCode : '')
      this.$refs.addSchool.status = true
    },
    search(values) {
      console.log(values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.searchList.provinceCode = values.areaList[0]
      this.searchList.cityCode = values.areaList[1]
      this.searchList.areaCode = values.areaList[2]
      this.searchList = Object.assign(this.searchList, values)
      this._getSchool()
    },
    goPath() {
      this.$router.push('/childOne/detial/info')
    },
    resetBtn() {
      this.form.resetFields()
      this.searchBtn()
    },
    searchBtn(e) {
      if (e) e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.value && values.value.length > 0) {
            values.areaCode = values.value[values.value.length - 1]
          }
          this.pageList = Object.assign(this.pageList, values)
          this._getSchool()
        }
      })
    },
    goDetial(path, record) {
      console.log('record', record)
      this.$router.push({
        path: path,
        query: {
          id: record.record.schoolCode,
          name: record.record.schoolName,
          type: 'sch'
        }
      })
    },
    // 图片上传
    beforeUpload(record, file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isImg) {
        this.$message.error('请上传jpg、png格式的图片')
        return false
      }
      const fileType = file.name.split('.')[1]
      this.$tools.ossUpload(this.schoolCode, file, fileType, res => {
        if (!res) {
          return
        }
        if (res.code === 200) {
          this._updateQrcode(res.data.url, record.record.schoolCode)
        } else {
          this.$message.error(res.data)
        }
      })
      return false
    },
    async _updateQrcode(url, code) {
      const req = {
        appQrCode: url,
        schoolCode: code
      }
      await this.updateQrcode(req)
      this.$message.success('操作成功')
      this.$tools.goNext(() => {
        this._getSchool()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
