<template>
  <div class="quality-index">
    <sub-form
      ref="form1"
      @submit-form="submitForm1"
      :title="formTitle1"
      v-model="formStatus1"
      :form-data="formData1"
    ></sub-form>
    <sub-form
      ref="form2"
      @submit-form="submitForm2"
      :title="formTitle2"
      v-model="formStatus2"
      :form-data="formData2"
    ></sub-form>
    <div class="search">
      <search-form isReset @search-form="searchForm" :search-label="searchLabel">
        <div slot="left">
          <a-button icon="plus" class="add-btn" @click="addOneList('')">添加一级指标</a-button>
        </div>
      </search-form>
    </div>
    <div v-if="dataList.length > 0" class="table">
      <div class="table-item" v-for="item in dataList" :key="item.id">
        <div class="table-title">
          <div class="title-left">
            <a-icon type="caret-down" />
            <span class="title-name">{{ `${item.name}(${item.score || 0}分)` }}</span>
          </div>
          <div class="title-right">
            <a-tooltip placement="topLeft" title="编辑">
              <a-button
                size="small"
                class="edit-action-btn"
                icon="form"
                @click.stop="addOneList(item.id, item)"
              ></a-button>
            </a-tooltip>
            <a-popconfirm
              placement="left"
              okText="确定"
              cancelText="取消"
              @confirm="deleteIndexOne(item.id)"
            >
              <template slot="title">
                {{
                  item.childrenList.length > 0
                    ? '该指标下有二级指标，确定一并删除吗？'
                    : '您确定删除吗？'
                }}
              </template>
              <a-tooltip placement="topLeft" title="删除">
                <a-button size="small" class="del-action-btn" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
            <a-tooltip placement="topLeft" title="添加二级指标">
              <a-button
                size="small"
                class="add-action-btn"
                icon="plus"
                @click.stop="addTwoList(item.id)"
              ></a-button>
            </a-tooltip>
          </div>
        </div>
        <div class="table-list">
          <course-table
            :tableList="item.childrenList"
            :courseType="item.id"
            @courseSet="addTwoList"
            @deleteIndexTwo="deleteIndexTwo"
          ></course-table>
          <!-- <div v-else class="no-data"></div> -->
        </div>
      </div>
    </div>
    <NoData v-else />
  </div>
</template>

<script>
import Tools from '@/utils/tools'
import SubForm from '../../component/SubForm.vue'
import NoData from '../../component/NoData.vue'
import SearchForm from '@c/SearchForm'
import CourseTable from './components/CourseTable.vue'
import { mapState, mapActions } from 'vuex'

const searchLabel = [
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'oneLevelId',
    type: 'select',
    label: '一级指标'
  },
  {
    list: [
      {
        key: '',
        val: '全部'
      }
    ],
    value: 'twoLevelId',
    type: 'select',
    label: '二级指标'
  }
]
const formData1 = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '一级指标名称',
    max: 10,
    placeholder: '请输入一级指标名称(限10字内)'
  }
]
const formData2 = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '二级指标名称',
    max: 10,
    placeholder: '请输入二级指标名称(限10字内)'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '评审标准',
    max: 100,
    placeholder: '请输入评审标准(限100字内)'
  },
  {
    value: 'score',
    initValue: '',
    type: 'number',
    label: '分值',
    min: 0,
    placeholder: '请输入分值'
  }
]
export default {
  name: 'QualityIndex',
  components: {
    CourseTable,
    SubForm,
    SearchForm,
    NoData
  },
  data() {
    return {
      formData1,
      formTitle1: '',
      formStatus1: false,
      formData2,
      formTitle2: '',
      formStatus2: false,
      searchLabel,
      dataList: [],
      searchObj: {},
      parentId: '',
      childId: '',
      levelOneList: [],
      levelTwoList: [],
      isEditLevelOne: false,
      isEditLevelTwo: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created() {
    this.searchLabel[0].selectChange = this.changeLevelOne
  },
  mounted() {
    this.showList('all')
  },
  methods: {
    ...mapActions('home', ['getEduIndexList', 'addEduIndex', 'editEduIndex', 'delEduIndex']),
    changeLevelOne(id) {
      const list = this.levelOneList.filter((item) => {
        return item.id === id
      })
      this.searchLabel[1].list = list[0].childrenList || []
      this.levelTwoList = list[0].childrenList || []
    },
    searchForm(values) {
      const oneList = this.levelOneList.filter((item) => item.id === values.oneLevelId)
      const twoList = this.levelTwoList.filter((item) => item.id === values.twoLevelId)
      this.searchObj = {
        oneLevelName: oneList.length === 0 ? '' : oneList[0].name,
        twoLevelName: twoList.length === 0 ? '' : twoList[0].name
      }
      this.showList()
    },
    async showList(all) {
      const req = {
        ...this.searchObj,
        schoolCode: this.userInfo.schoolCode
      }
      if (all) {
        delete req.oneLevelName
        delete req.twoLevelName
      }
      const res = await this.getEduIndexList(req)
      this.dataList = res.data
      if (all) {
        const list = res.data.map((item) => {
          return {
            ...item,
            key: item.id,
            val: item.name,
            childrenList: item.childrenList.map((el) => {
              return {
                ...el,
                key: el.id,
                val: el.name
              }
            })
          }
        })
        this.levelOneList = list
        this.searchLabel[0].list = list
      }
    },
    // 添加编辑一级指标
    addOneList(id, record) {
      if (!!id) {
        this.formData1 = this.$tools.fillForm(formData1, record)
      } else {
        this.formData1 = formData1
      }
      this.isEditLevelOne = !!id
      this.parentId = id
      this.formTitle1 = id ? '编辑一级指标' : '添加一级指标'
      this.formStatus1 = true
    },
    // 添加编辑二级指标
    addTwoList(parentId, id, record) {
      if (!!id) {
        this.formData2 = this.$tools.fillForm(formData2, record)
      } else {
        this.formData2 = formData2
      }
      this.isEditLevelTwo = !!id
      this.parentId = parentId
      this.childId = id
      this.formTitle2 = id ? '编辑指标细则' : '添加指标细则'
      this.formStatus2 = true
    },
    async submitForm1(values) {
      const req = {
        name: values.name,
        quotaLevel: 1,
        schoolCode: this.userInfo.schoolCode
      }
      const reqEdit = {
        name: values.name,
        id: this.parentId
      }
      const res = this.isEditLevelOne
        ? await this.editEduIndex(reqEdit)
        : await this.addEduIndex(req)
      if (res && res.code === 200) {
        this.showList('all')
        this.formStatus1 = false
      }
    },
    async deleteIndexOne(id) {
      await this.delEduIndex(id)
      this.showList('all')
    },
    async deleteIndexTwo(id) {
      await this.delEduIndex(id)
      this.showList('all')
    },
    async submitForm2(values) {
      if (values.score < 0) {
        this.$message.warning('分值必须大于0')
        return
      }
      const req = {
        name: values.name,
        parentId: this.parentId,
        quotaLevel: 2,
        remark: values.remark,
        score: values.score
      }
      const reqEdit = {
        id: this.childId,
        name: values.name,
        remark: values.remark,
        score: values.score
      }
      const res = this.isEditLevelTwo
        ? await this.editEduIndex(reqEdit)
        : await this.addEduIndex(req)
      if (res && res.code === 200) {
        this.showList('all')
        this.formStatus2 = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.quality-index {
  height: calc(100vh - 65px);
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.table {
  flex: 1;
  overflow-y: auto;
}
.table-item {
  border: solid 1px #ccc;
  border-bottom: none;
  .table-title {
    height: 40px;
    background-color: #f5f5f5f5;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;

    .title-left {
      display: flex;
      align-items: center;

      .title-name {
        width: 100px;
      }
      .title-hour {
        margin-right: 40px;
      }
    }
    .title-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .table-list {
    padding: 20px;
    box-sizing: border-box;

    .no-data {
      height: 50px;
    }
  }
}
.table-item:last-child {
  border-bottom: 1px solid #ccc;
}
</style>
