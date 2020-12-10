<template>
  <div class="school-year page-layout qui-fx-ver">
    <div class="qui-fx-jsb">
      <div class="tit">
        <p class="qui-fx qui-fx-ac">当前学年学期</p>
      </div>
      <div class="btn" style="margin-right: 5px; margin-top: -5px;">
        <a-button v-if="!settag" @click.stop="settag=true" type="primary">设置</a-button>
        <div v-else>
          <a-button class="mar-r10" @click.stop="settag=false" type="primary" ghost>取消</a-button>
          <a-button @click.stop="save" type="primary">保存</a-button>
        </div>
      </div>
    </div>
    <div class="top">
      <div class="grade qui-fx-ver">
        <div class="set qui-fx mar-b10">
          <span class="qui-fx-ac mar-r10">学年:</span>
          <span v-if="!settag">{{ defaultYear }}学年</span>
          <a-select v-else v-model="defaultYear" @change="yearChange" :disabled="yearChangeDisab" style="width: 200px">
            <a-select-option v-for="item in yearList" :key="item.key" :value="item.value">
              {{ item.value }}学年
            </a-select-option>
          </a-select>
        </div>
        <div class="set qui-fx mar-b10">
          <span class="qui-fx-ac mar-r10">学期:</span>
          <span v-if="!settag">{{ term }}</span>
          <a-select
            v-else
            placeholder="请选择"
            defaultValue="0"
            @change="termChange"
            style="width: 200px"
            :disabled="termChangeDisab"
            v-model="term">
            <a-select-option value="上学期">
              上学期
            </a-select-option>
            <a-select-option value="下学期">
              下学期
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="tips qui-fx ">
        <p>小提示：</p>
        <div class="qui-fx-ver">
          <span class="mar-b10">1、仅学校管理员可以设置学年学期，一年时间内只能操作2次。如误操作无法修改请联系平台管理员。</span>
          <span>2、如学校管理员忘记设置，平台会在每年春节当天、9月1日自动调整学年学期。</span>
        </div>
      </div>
    </div>
    <div class="tit ">
      <p class="qui-fx qui-fx-ac">设置记录</p>
    </div>
    <div class="content qui-fx-ver qui-fx-f1">
      <table-list
        :columns="columns"
        :table-list="parentsList">
      </table-list>
      <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import Tools from '@u/tools'

const columns = [
  {
    title: '序号',
    width: '10%',
    scopedSlots: {
      customRender: 'index'
    }
  },
  {
    title: '设置学年',
    dataIndex: 'schoolYear',
    width: '10%'
  },
  {
    title: '设置学期',
    dataIndex: 'semester',
    width: '10%'
  },
  {
    title: '设置时间',
    dataIndex: 'createTime',
    width: '10%',
    customRender: (text) => {
      return Tools.getDate(text).substring(0, 10)
    }
  },

  {
    title: '操作人',
    dataIndex: 'optName',
    width: '10%'
  },
  {
    title: '手机号',
    dataIndex: 'optNum',
    width: '10%'
  }
]
export default {
  name: 'SchoolYear',
  components: {
    TableList,
    PageNum
  },
  data () {
    return {
      columns,
      parentsList: [],
      selectedParent: '',
      defaultYear: '',
      term: '',
      year: '',
      yearChangeDisab: false,
      termChangeDisab: false,
      settag: false,
      yearList: [],
      schoolYearId: '',
      termhasChange: false,
      yearhasChange: false,
      pageList: {
        page: 1,
        size: 20
      },
      total: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created () {
    this.year = new Date().getFullYear()
    console.log(this.year)
  },
  mounted () {
    this.showList()
  },
  methods: {
    ...mapActions('home', [
      'getSchoolYear', 'addSchoolYear'
    ]),
    async showList () {
      this.yearList = []
      const req = {
        ...this.pageList,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (!res.data) {
        return
      }
      this.parentsList = res.data.list
      this.total = res.data.total
      if (res.data.list.length === 0) {
        if (new Date().getMonth() + 1 < 9) {
          this.defaultYear = (Number(this.year) - 1) + '-' + this.year
          this.term = '上学期'
        } else {
          this.defaultYear = this.year + '-' + (Number(this.year) + 1)
          this.term = '下学期'
        }
        const req = {
          ...this.userInfo,
          schoolYear: this.defaultYear,
          semester: this.term
        }
        await this.addSchoolYear(req)
        this.$message.success('初始化学年设置成功')
        this.$tools.goNext(() => {
          this.showList()
        })
        return
      }
      const arr = res.data.list.filter(ele => { return ele.valid === '1' })
      this.defaultYear = arr[0].schoolYear
      this.term = arr[0].semester
      this.schoolYearId = arr[0].id
      this.yearList.push({
        id: arr[0].id,
        key: arr[0].schoolYear,
        value: arr[0].schoolYear
      },
      {
        key: (Number(arr[0].schoolYear.split('-')[0]) + 1) + '-' + (Number(arr[0].schoolYear.split('-')[1]) + 1),
        value: (Number(arr[0].schoolYear.split('-')[0]) + 1) + '-' + (Number(arr[0].schoolYear.split('-')[1]) + 1)
      })
      console.log(Number(arr[0].schoolYear.split('-')[1]))
      if (Number(arr[0].schoolYear.split('-')[1]) > this.year) {
        this.termChangeDisab = this.term === '下学期'
        this.yearChangeDisab = true
        return
      }
      this.termChangeDisab = this.term !== '上学期'
      this.yearChangeDisab = this.term === '上学期'
    },
    yearChange (value, selected) {
      this.yearhasChang = !this.yearhasChang
      this.term = this.yearhasChang ? '上学期' : '下学期'
    },
    termChange (value) {
      this.termhasChange = !this.termhasChange
    },
    set () {
      this.settag = true
    },
    async save () {
      if (!this.termhasChange && !this.yearhasChang) {
        this.settag = false
        return
      }
      const req = {
        ...this.userInfo,
        id: this.termhasChange ? this.schoolYearId : null,
        schoolYear: this.defaultYear,
        semester: this.term
      }
      await this.addSchoolYear(req)
      this.$message.success('设置成功')
      this.termhasChange = false
      this.yearhasChang = false
      this.$tools.goNext(() => {
        this.showList()
        this.settag = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.school-year{
  height:100%;
  padding-top: 20px;
  .tit{
    margin-bottom: 20px;
    p {
      border-left: 3px solid @main-color;
      padding-left: 10px;
      font-weight: bold;
      margin: 0 0 0 5px;
      line-height: 16px;
      height: 16px;
      font-size: 16px;
    }
  }
  .grade{
    span{
      height: 33px;
      line-height: 33px;
    }
  }
  .tips{
    font-size: 12px;
    color:#A0A2A8;
  }
   .top{
    background: #fff;
    border:1px solid @bor-color;
    border-left: #fff;
    border-right: #fff;
    padding: 20px;
    margin-bottom: 20px;
    font-weight: bold;
    .set{
      height: 33px;
      overflow: hidden;
    }
    .info{
      margin-bottom: 20px;
      span{
        margin-right: 50px;
      }
    }
    .phone{
      margin-bottom: 20px;
      img{
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 4px;
      }
    }
  }
  .content{
    background: #fff;
  }
}
</style>
