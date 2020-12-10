<template>
  <div class="view-statistics page-layout  bg-fff qui-fx-ver">
    <div class="content pos-box">
      <div class="title u-fx-ac-jc u-mar-t40 u-bold u-font-1 u-mar-b40">{{ taskName }}</div>
      <div class="qui-fx-ac u-mar-t10  u-mar-l20 u-mar-b10" v-if="taskType !== '1'">
        <div>{{ taskType === '2' ? '周' : '月' }}计划：</div>
        <a-select v-model="dateNum" @change="getDetails" style="width: 200px">
          <a-select-option v-for="list in planList" :key="`${list.year}-${list.dateNum}`">{{ list.year }}-{{ list.dateNum }}{{ taskType === '2' ? '周' : '月' }}</a-select-option>
        </a-select>
      </div>
      <div class="a-collapse-box u-padd-20">
        <a-collapse @change="changeActivekey" v-model="activeKey">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel
            class="u-mar-b20"
            :key="list.id+''"
            v-for="(list,index) in dataLists"
          >
            <div slot="header" @click="openList(list.id,index)">
              Q{{ index+1 }}({{ list.questionType | questionType }}){{ list.title }}
            </div>
            <div class="list-box  u-mar-20 " v-if="list.questionType==='1'">
              <div class="list-cont u-fx-ac-jc" v-if="list.statisticsAnswersDtoList">
                <pre-echarts
                  :id="list.id+''"
                  :legendData="list.content"
                  v-if="list.statisticsAnswersDtoList.length>0"
                  :dataList="list.statisticsAnswersDtoList"></pre-echarts>
                <a-empty v-else :image="simpleImage"/>
              </div>
              <div class="list-cont u-mar-t20">
                <table border="0" class="u-bd-1px" width="100%" cellspacing:="0">
                  <tr class="u-type-primary-light-bg">
                    <th class="u-padd-10 u-bd-r u-bd-b" width="60%" >选项</th>
                    <th class="u-padd-10 u-bd-r u-bd-b" >计数</th>
                    <th class="u-padd-10 u-bd-b ">占比</th>
                  </tr>
                  <tr v-for="(item,i) in list.statisticsAnswersDtoList" :key="i">
                    <td class="u-padd-10 u-bd-r u-bd-b " width="60%">{{ item.answer }}</td>
                    <td class="u-padd-10 u-bd-r u-bd-b " >{{ item.count }}人</td>
                    <td class="u-padd-10  u-bd-b ">{{ item.rate }}</td>
                  </tr>
                  <tr>
                    <td class="u-padd-10 " :colspan="3">答题人数：{{ list.answerSum }}</td>
                  </tr>
                </table>
              </div>
              <div class="list-cont u-mar-t20" v-if="list.statisticsAnswersByUserDtoList">
                <a-table
                  :rowKey="(record, index) => index"
                  :columns="columns"
                  :pagination="false"
                  :data-source="list.statisticsAnswersByUserDtoList.records"
                  bordered>
                </a-table>
                <a-pagination
                  class="u-fx-je u-mar-t10"
                  @change="value => handleChange(value, list.id,index)"
                  simple
                  :default-current="1"
                  :total="list.statisticsAnswersByUserDtoList.total" />
              </div>
            </div>
            <div class="list-box  u-mar-20 " v-if="list.questionType==='2'">
              <div class="list-cont u-fx-ac-jc" v-if="list.statisticsAnswersDtoList">
                <bar-echarts
                  :id="list.id+''"
                  v-if="list.statisticsAnswersDtoList.length>0"
                  :legendData="list.content"
                  :multipleData="list.statisticsAnswersDtoList">
                </bar-echarts>
                <a-empty v-else :image="simpleImage" />
              </div>
              <div class="list-cont u-mar-t20">
                <table border="0" class="u-bd-1px" width="100%" cellspacing:="0">
                  <tr class="u-type-primary-light-bg">
                    <th class="u-padd-10 u-bd-r u-bd-b" width="60%" >选项</th>
                    <th class="u-padd-10 u-bd-r u-bd-b" >计数</th>
                    <th class="u-padd-10 u-bd-b ">占比</th>
                  </tr>
                  <tr v-for="(item,i) in list.statisticsAnswersDtoList" :key="i">
                    <td class="u-padd-10 u-bd-r u-bd-b " width="60%">{{ item.answer }}</td>
                    <td class="u-padd-10 u-bd-r u-bd-b " >{{ item.count }}人</td>
                    <td class="u-padd-10  u-bd-b ">{{ item.rate }}</td>
                  </tr>
                  <tr>
                    <td class="u-padd-10 " :colspan="3">答题人数：{{ list.answerSum }}</td>
                  </tr>
                </table>
              </div>
              <div class="list-cont u-mar-t20" v-if="list.statisticsAnswersByUserDtoList">
                <a-table
                  :rowKey="(record, index) => index"
                  :columns="columns"
                  :pagination="false"
                  :data-source="list.statisticsAnswersByUserDtoList.records"
                  bordered>
                </a-table>
                <a-pagination
                  class="u-fx-je u-mar-t10"
                  @change="value => handleChange(value, list.id,index)"
                  simple
                  :default-current="1"
                  :total="list.statisticsAnswersByUserDtoList.total" />
              </div>
            </div>
            <div class="list-box  u-mar-20 " v-if="list.questionType==='3'">
              <div class="list-cont u-mar-t20" v-if="list.statisticsAnswersByUserDtoList">
                <a-table
                  :rowKey="(record, index) => index"
                  :pagination="false"
                  :columns="columns"
                  :data-source="list.statisticsAnswersByUserDtoList.records"
                  bordered>
                </a-table>
                <a-pagination
                  class="u-fx-je u-mar-t10"
                  @change="value => handleChange(value, list.id,index)"
                  simple
                  :default-current="1"
                  :total="list.statisticsAnswersByUserDtoList.total" />
              </div>
            </div>
            <div class="list-box  u-mar-20 " v-if="list.questionType==='4'">
              <div class="list-cont u-mar-t20" v-if="list.statisticsAnswersByUserDtoList">
                <a-table
                  :rowKey="(record, index) => index"
                  :columns="columnsUrl"
                  :pagination="false"
                  :data-source="list.statisticsAnswersByUserDtoList.records"
                  bordered>
                  <template slot="answer" slot-scope="record">
                    <span v-if="record.answer" class="u-type-primary" @click="downloadImg(record.answer)">下载</span>
                  </template>
                </a-table>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PreEcharts from './PreEcharts'
import BarEcharts from './BarEcharts'
import NoData from '@c/NoData'
import { Empty } from 'ant-design-vue'
const columns = [
  {
    title: '学校',
    width: '20%',
    dataIndex: 'schoolName',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '回答人',
    width: '20%',
    dataIndex: 'completeUserName'
  },
  {
    title: '选项',
    width: '60%',
    dataIndex: 'answer'
  }
]
const columnsUrl = [
  {
    title: '学校',
    width: '20%',
    dataIndex: 'schoolName',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '回答人',
    width: '20%',
    dataIndex: 'completeUserName'
  },
  {
    title: '选项',
    width: '60%',
    // dataIndex: 'answer',
    scopedSlots: { customRender: 'answer' }
  }
]
export default {
  name: 'TaskStatistics',
  components: {
    NoData,
    PreEcharts,
    BarEcharts
  },
  data() {
    return {
      activeKey: [],
      dateNum: '',
      planList: [],
      columnsUrl,
      taskName: this.$route.query.name,
      taskType: this.$route.query.taskType,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      form: this.$form.createForm(this),
      columns,
      dataLists: [],
      dangerDetail: [] // 隐患明细table
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    this.taskCode = this.$route.query.code
    this.publishDate = this.$route.query.publishDate
    if (this.taskType !== '1') {
      await this._planList()
    }
    await this.getDetails()
  },
  methods: {
    ...mapActions('home', ['answerTaskDetail', 'answersTaskStatistics', 'userTaskStatistics', 'planLists']),
    async getDetails() {
      const res = await this.answerTaskDetail({ taskCode: this.taskCode })
      this.dataLists = res.data
      this.activeKey.push(res.data[0].id)
      this.getAnswers(res.data[0].id, 0)
      this.getUser(res.data[0].id, 0, 1)
    },
    async _planList() {
      const req = {
        taskCode: this.taskCode
      }
      const res = await this.planLists(req)
      this.planList = res.data
      this.dateNum = `${res.data[0].year}-${res.data[0].dateNum}`
    },
    openList(id, index) {
      if (this.dataLists[index].statisticsAnswersDtoList) return
      this.getAnswers(id, index)
      this.getUser(id, index, 1)
    },
    // 获取答案
    async getAnswers(id, index) {
      const req = {
        dateNum: this.dateNum.split('-')[1],
        page: 1,
        questionId: id,
        size: 50,
        taskTemplateCode: this.taskCode,
        year: this.dateNum.split('-')[0]
      }
      const res1 = await this.answersTaskStatistics(req)
      const { statisticsAnswersDtoList, answerSum } = res1.data
      this.$set(this.dataLists[index], 'statisticsAnswersDtoList', statisticsAnswersDtoList)
      this.$set(this.dataLists[index], 'answerSum', answerSum)
    },
    // 获取用户
    async getUser(id, index, page) {
      const req = {
        dateNum: this.dateNum.split('-')[1],
        page: page,
        questionId: id,
        size: 3,
        taskTemplateCode: this.taskCode,
        year: this.dateNum.split('-')[0]
      }
      const res2 = await this.userTaskStatistics(req)
      const { statisticsAnswersByUserDtoList } = res2.data
      this.$set(this.dataLists[index], 'statisticsAnswersByUserDtoList', statisticsAnswersByUserDtoList)
    },
    // 下载附件
    downloadImg(url) {
      window.location.href = url
      if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(url)) {
      } else {
      }
      // const link = document.createElement('a')
      // link.style.display = 'none'
      // link.href = url
      // document.body.appendChild(link)
      // link.click()
    },
    // 翻页
    handleChange(value, id, index) {
      this.getUser(id, index, value)
    },
    changeActivekey(key) {
    },
    cancel() {
      this.$router.go(-1)
    }

  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.view-statistics {
  // padding: 20px;
  box-sizing: content-box;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;

    .a-collapse-box{
      @{deep} .ant-collapse > .ant-collapse-item > .ant-collapse-header{
        background: #ecf5ff !important;
         background: #6882da !important;
            color: #fff;
      }
      .list-box{
          .list-cont{
            //修改表头文字、背景颜色
            @{deep} .ant-table-thead > tr >th{
            background: #ecf5ff !important;
          }
        }
      }
    }
  }
}

</style>
