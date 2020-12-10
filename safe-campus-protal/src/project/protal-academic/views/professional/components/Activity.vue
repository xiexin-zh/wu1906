<template>
  <div class="teaching-activity">
    <sub-form
      ref="form"
      @submit-form="submitForm"
      :title="formTitle"
      v-model="formStatus"
      :form-data="formData"
      :yearCount="yearCount"
      :scoreList="scoreList"
      yearTitle="周数"
    ></sub-form>
    <div class="btn-add">
      <a-button type="primary" @click="addActivity(1)"> 添加 </a-button>
    </div>
    <div class="table">
      <table-list isBorder :table-list="dataList" :columns="columns">
        <template v-slot:actions="action">
          <a-tooltip placement="topLeft" title="编辑" v-if="action.record.showOpt">
            <a-button
              size="small"
              class="edit-action-btn"
              icon="form"
              @click.stop="addActivity(0, action.record)"
            ></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            okText="确定"
            cancelText="取消"
            @confirm="deleteList(action.record)"
            v-if="action.record.showOpt"
          >
            <template slot="title"> 您确定删除吗? </template>
            <a-tooltip placement="topLeft" title="删除">
              <a-button size="small" class="del-action-btn" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </table-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableList from '@c/TableList'
import SubForm from '../../../component/SubForm.vue'
import Tools from '@/utils/tools'

const formData = [
  {
    value: 'title',
    initValue: '',
    type: 'input',
    max: 10,
    label: '教学活动',
    placeholder: '请输入教学活动(限10字内)'
  },
  {
    value: 'timeList',
    type: 'yearPanel',
    placeholder: '',
    list: []
  }
]
export default {
  name: 'Activity',
  components: {
    TableList,
    SubForm
  },
  props: {
    yearCount: {
      type: Number,
      default: 0
    },
    programId: {
      required: true
    }
  },
  data() {
    return {
      columns: [
        {
          title: '教学活动',
          dataIndex: 'title',
          key: 'title',
          width: 150,
          align: 'center'
        },
        {
          title: '总计',
          dataIndex: 'totalNum',
          key: 'totalNum',
          width: 80,
          align: 'center'
        },
        {
          title: '操作',
          width: 100,
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      formData,
      formTitle: '',
      formStatus: false,
      dataList: [],
      scoreList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    if (this.yearCount > 0) {
      for (let i = 1; i < this.yearCount + 1; i++) {
        const obj = {
          title: `第${Tools.getLargeNumber(i)}学年`,
          children: [
            {
              title: `第${Tools.getLargeNumber(2 * i - 1)}学期`,
              dataIndex: `item${2 * i - 1}`,
              align: 'center'
            },
            {
              title: `第${Tools.getLargeNumber(2 * i)}学期`,
              dataIndex: `item${2 * i}`,
              align: 'center'
            }
          ]
        }
        this.columns.splice(i, 0, obj)
      }
    }
  },
  mounted() {
    this.getActivity()
  },
  methods: {
    ...mapActions('home', [
      'getSchemeActivity',
      'addSchemeActivity',
      'editSchemeActivity',
      'delSchemeActivity'
    ]),
    addActivity(type, record) {
      this.formTitle = type ? '添加教学活动' : '编辑教学活动'
      this.activityId = record ? record.id : ''
      this.formData[0].initValue = type ? '' : record.title
      if (record) {
        const scoreList = []
        for (let val in record.itemObj) {
          scoreList.push(record.itemObj[val])
        }
        this.scoreList = scoreList
      } else {
        const list = []
        for (let i = 0; i < this.yearCount; i++) {
          list.push(0)
        }
        this.scoreList = list
      }
      this.formStatus = true
    },
    async getActivity() {
      const res = await this.getSchemeActivity({ schemeId: this.programId })
      if (res && res.code === 200) {
        this.dataList = res.data.map((item) => {
          return {
            ...item,
            ...item.itemObj,
            showOpt: item.title === '合计' ? false : true
          }
        })
      }
    },
    async deleteList(record) {
      await this.delSchemeActivity(record.id)
      this.getActivity()
    },
    async submitForm(values) {
      const { yearTimeList, title, allCount } = values
      const numList = []
      yearTimeList.forEach((item) => {
        item.list.forEach((el) => {
          numList.push(el.count)
        })
      })
      const req = {
        schemeId: this.programId,
        title,
        numList
      }
      if (this.activityId) {
        req.id = this.activityId
      }
      const res = this.activityId
        ? await this.editSchemeActivity(req)
        : await this.addSchemeActivity(req)
      if (res && res.code === 200) {
        this.formStatus = false
        this.getActivity()
      }
    }
  }
}
</script>

<style scoped>
.teaching-activity {
  padding-right: 20px;
  box-sizing: border-box;
}
.btn-add {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
}
</style>