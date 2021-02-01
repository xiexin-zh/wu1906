<template>
  <div class="subject-list page-layout u-fx-ver">
    <u-space direction="vertical">
      <div class="layout-padd u-type-white-bg">
        <u-search-form :search-label="searchLabel" @search="search">
          <div slot="left">
            <u-space>
              <u-button icon="plus" @click="addSubject(0)" type="primary">
                添加课程
              </u-button>
            </u-space>
          </div>
          <div slot="right"></div>
        </u-search-form>
      </div>
    </u-space>
    <div class="u-fx u-fx-f1">
      <u-table
        is-zoom
        :page-list="pageList"
        :columns="columns"
        :table-list="subjectList"
        v-model="chooseList"
      >
        <template v-slot:slotTwo="slotTwo">
          <span>{{ slotTwo.record.courseTeacher }}</span>
          <a-button
            class="add-user-btn"
            icon="plus"
            type="primary"
            @click.stop="addUser(slotTwo.record)"
          >
          </a-button>
        </template>
        <template v-slot:slotOne="slotOne">
          <span :title="slotOne.record.mark">
            {{
              slotOne.record.mark && slotOne.record.mark.length > 50
                ? slotOne.record.mark.substr(0, 50) + '...'
                : slotOne.record.mark
            }}
          </span>
        </template>
        <template v-slot:actions="actions">
          <u-button type="link" @click="addSubject(1, actions.record)">
            编辑
          </u-button>
          <u-button type="link" delete @click="deleteSubject(actions.record)">
            删除
          </u-button>
        </template>
      </u-table>
    </div>
    <div class="u-type-white-bg">
      <u-pagination
        justify="end"
        v-model="pageList"
        :total="total"
        @change="getList"
      ></u-pagination>
    </div>
    <u-submit-form
      ref="form"
      :title="formTitle"
      :formData="formData"
      v-model="formStatus"
      @submit="submit"
    />
    <u-choose-teacher
      is-check
      ref="chooseTeacherRef"
      :title="chooseTitle"
      :schoolCode="schoolCode"
      v-model="chooseStatus"
      :bindList="bindList"
      @submit="submitChoose"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import columns from '../../table-columns/course'
import searchLabel from '../../search-columns/course'
import formData from '../../submit-columns/course'

export default {
  name: 'Subject',
  components: {},
  data() {
    return {
      formTitle: '',
      formStatus: false,
      formData,
      chooseTitle: '选择老师',
      chooseStatus: false,
      bindList: [],
      searchLabel,
      subjectList: [],
      columns,
      chooseList: [],
      pageList: { page: 1, size: 20 },
      total: 0,
      searchObj: {}
    }
  },
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions('home', ['getAppBySchool']),
    // 获取数据列表
    async getList() {
      this.subjectList = [
        {
          id: '1',
          subjectName: '软件测试',
          courseTeacher: 0,
          mark: '系统预设'
        }
      ]
      this.total = 1
    },
    // 列表搜索
    search(values) {
      this.searchObj = values
      this.getList()
    },
    // 添加/编辑课程  0-添加 1-编辑
    addSubject(type, record) {
      this.formTitle = type ? '编辑课程' : '添加课程'
      // this.formData = type ? this.$tools.fillForm(formData, record) : formData
      this.formStatus = true
    },
    // 添加课程-提交
    submit(values) {
      this.$refs.form.reset()
    },
    // 删除课程
    deleteSubject(record) {},
    // 选择老师
    addUser() {
      this.chooseStatus = true
    },
    // 选择老师确认
    submitChoose() {}
  }
}
</script>
<style lang="less" scoped>
.add-user-btn {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  border-radius: 50%;
}
</style>
