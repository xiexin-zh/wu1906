<template>
  <a-modal
    :destroyOnClose="true"
    v-model="status"
    width="1100px"
    title="学校安全工作报告总结"
    :footer="null"
    :confirmLoading="confirmLoading"
    @cancel="close"
  >
    <div class="qui-fx-ver statistic">
      <div class="red-title u-padd-l30" style="color:red">
        报告单位：{{ data.schoolName }}&nbsp;&nbsp;&nbsp;&nbsp;报告时间：{{ data.reportTime }}
      </div>
      <p class="p1 u-mar-t10 u-padd-l30">
        为切实做好学校安全工作，确保师生安全，维护学校正常的教育教学秩序，给全体师生提供一个安全的工作、学习、生活环境。学校安全工作领导小组安全隐患进行全方位的排查，加强安全巡查，积极开展安全演练工作。现安全工作情况报告如下所示。
      </p>
      <div class="list1 ">
        <div class="title1 u-bold">一、安全巡检</div>
        <p class="u-padd-l30">
          通过安全巡查，及时发现了学校的安全隐患并及时进行了整改，排除了隐患，对全体师生的生命、财产安全和学校正常的教育教学秩序提供了有力保障。
        </p>
        <div class="u-padd-l30">已巡查次数：{{ data.patrol.done }}次</div>
        <div class="u-padd-l30">未巡查次数：{{ data.patrol.notDone }}次</div>
        <div class="u-padd-l30">巡查率：{{ data.patrol.rate }}%</div>
      </div>
      <div class="list2 u-mar-t10">
        <div class="title1 u-bold">二、安全隐患</div>
        <p class="u-padd-l30">
          学校建立建全安全隐患排查治理台账。实行学校安全隐患报告制度，将存在的安全隐患如实报区教育行政部门备案，市局直属各学校将安全隐患报市教育局学校安全管理处备案。
        </p>
        <div class="u-padd-l30">隐患总数：{{ data.danger.all }}条</div>
        <div class="u-padd-l30">已整改：{{ data.danger.done }}条</div>
        <div class="u-padd-l30">整改中：{{ data.danger.doing }}条</div>
        <div class="u-padd-l30">逾期未整改：{{ data.danger.delay }}条</div>
        <div class="u-padd-l30">整改率：{{ data.danger.rate }}%</div>
      </div>
      <div class="list3 u-mar-t10">
        <div class="title1 u-bold">三、安全演练</div>
        <p class="u-padd-l30">
          为使师生掌握一定的安全知识和逃生本领，提高自救、自护能力，从容应对突发事件的发生。最大限度地保护广大师生的人身安全，提高全校师生应急防护与逃生自救能力，强化安全意识，积累实战经验，切实做好学校的安全工作，构建平安校园，在全体师生的共同配合下，进行演练。
        </p>
        <a-table
          bordered
          class="u-padd-l30"
          style="width:70%"
          :columns="[
            {
              title: '序号',
              dataIndex: 'index',
              scopedSlots: { customRender: 'index' }
            },
            {
              title: '演练日期',
              dataIndex: 'date'
            },
            {
              title: '演练时间',
              dataIndex: 'time'
            },
            {
              title: '演练项目',
              dataIndex: 'item'
            },
            {
              title: '参与人员',
              dataIndex: 'participant'
            }
          ]"
          :data-source="data.rehearsalList"
          size="small"
        >
          <template slot="index" slot-scope="text, record, index">{{ index + 1 }}</template>
        </a-table>
      </div>
      <div class="list4 u-mar-t10">
        <div class="title1 u-bold">四、安全事故</div>
        <p class="u-padd-l30">
          学校发生事故后及时向上级单位、政府有关部门报告，并妥善保护事故现场及有关证据。必要时向相关单位和人员通报。成立事故善后工作组及事故调查组，明确其职责与权限，进行事故善后处置及调查，并配合上级部门的事故调查。提出整改措施和处理建议，编制事故调查报告。
        </p>
        <a-table
          bordered
          class="u-padd-l30"
          style="width:70%"
          :columns="[
            {
              title: '序号',
              dataIndex: 'index',
              scopedSlots: { customRender: 'index' }
            },
            {
              title: '时间',
              dataIndex: 'date'
            },
            {
              title: '事故陈述',
              dataIndex: 'details'
            },
            {
              title: '事故处理过程',
              dataIndex: 'disposeInfo'
            },
            {
              title: '事故处理结果',
              dataIndex: 'finishInfo'
            }
          ]"
          :data-source="data.accidentList"
          size="small"
        >
          <template slot="index" slot-scope="text, record, index">{{ index + 1 }}</template>
        </a-table>
      </div>
      <div class="list5 u-mar-t10">
        <div class="title1 u-bold">五、值班上报</div>
        <p class="u-padd-l30">
          为了进一步管理好学校老师的值班工作，确保学校安全稳定，值班上报管理工作严明领导带班值守的工作纪律，要求值班人员坚守工作岗位，定期汇总上报信息，上报巡查值班轨迹，做到无情况定期报，有情况随时报。
        </p>
        <a-table
          bordered
          class="u-padd-l30"
          style="width:70%"
          :columns="[
            {
              title: '序号',
              dataIndex: 'index',
              scopedSlots: { customRender: 'index' }
            },
            {
              title: '上报时间',
              dataIndex: 'time'
            },
            {
              title: '值班人员',
              dataIndex: 'dutyName'
            },
            {
              title: '带班领导',
              dataIndex: 'leaderName'
            },
            {
              title: '值班状态',
              dataIndex: 'status'
            }
          ]"
          :data-source="data.dutyList"
          size="small"
        >
          <template slot="index" slot-scope="text, record, index">{{ index + 1 }}</template>
        </a-table>
      </div>
    </div>
  </a-modal>
</template>
<script>
import PageNum from '@c/PageNum'
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SearchForm from '@c/SearchForm'
export default {
  name: 'PreviewReport',
  components: {
    TableList,
    SearchForm,
    PageNum
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      detail: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo']),
    status: {
      get() {
        // return true
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  watch: {},
  async created() {},
  methods: {
    ...mapActions('home', ['schExportData']),
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    close() {
      this.$emit('closeModal')
    },
    error() {
      this.confirmLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
// .content {
//   height: calc(100% - 10px);
//   overflow-y: scroll;
//  }
</style>
