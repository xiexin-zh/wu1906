<template>
  <div class="add-special-item page-layout bg-fff qui-fx-ver">
    <a-form :form="form">
      <a-form-item v-bind="formItemLayout" label="任务名称" required>
        <a-input
          placeholder="请输入任务名称"
          v-decorator="[
            'name',
            { initialValue: address, rules: [{max: 20,required: true, message: '请输入机构名称限20字,支持中英文数字' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item label="检查时间：" v-bind="formItemLayout">
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @change="onChange"
          @ok="onOk"
          v-decorator="['range', { rules: [{ required: true, message: '请输入输入时间范围' }] }]"
        />
      </a-form-item>
      <a-form-item label="专项指标：" v-bind="formItemLayout" required>
        <a-input
          @click="showSpecific()"
          placeholder="专项指标"
          v-decorator="[
            'specificIndicators',
            { initialValue: specificIndicators, rules: [ {required: true, message: '请选择专项指标' } ]}
          ]"
        />

      </a-form-item>
      <a-form-item label="督查小组：" v-bind="formItemLayout" required>
        <a-input
          @click="showSupervision()"
          placeholder="督查小组"
          v-decorator="[
            'supervisionTeam',
            { initialValue: supervisionTeam, rules: [ {required: true, message: '请选择督查小组' } ]}
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" :style="{ textAlign: 'center' }">
        <a-button @click="cancel">取消</a-button>
        <a-button class="mar-l10" type="primary" @click="submitOk" :disabled="isLoad">确定</a-button>
      </a-form-item>
    </a-form>
    <!-- 选择专项指标 -->
    <choose-check
      :userData="itemAll"
      :selectLeft="selectItem"
      ref="itemAll"
      v-if="true"
      @submit="setItem"
      title="选择专项指标"
      ranname="name"
    >
    </choose-check>
    <!-- 选择督查小组 -->
    <choose-tree
      :userData="specificAll"
      :selectLeft="selectSpecific"
      ref="supervisio"
      @submit="setSupervisio"
      title="选择督查小组"
      ranname="name"
    >
    </choose-tree>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UploadMulti from '@c/UploadMulti'
// import xiaozuData from './dubanxiaozu.json'
export default {
  name: 'AddSpecialItem',
  components: {
    UploadMulti,
    ChooseCheck: () => import('../../component/ChooseCheck'),
    ChooseTree: () => import('../../component/ChooseTree')
  },
  data() {
    this.beginTime = ''
    this.endTime = ''
    this.groupList = []
    return {
      form: this.$form.createForm(this),
      itemAll: [], // 专项指标
      selectItem: [],
      specificAll: [], // 督查小组
      selectSpecific: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      // xiaozuData,
      isLoad: false,
      address: '',
      supervisionTeam: '',
      specificIndicators: '',

      count: 0
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted() {
    await this._getItemAll()
    await this._getTreeGroup()
  },
  methods: {
    ...mapActions('home', ['getItemAll', 'addSpecialTask', 'getGroup', 'getSchoolFlights', 'getTreeGroup']),
    // 获取专项指标基础数据
    async _getItemAll() {
      const res = await this.getItemAll(this.userInfo.schoolCode)
      // this.itemAll = JSON.parse(JSON.stringify(res.data).replace(/name/g, 'name'))
      this.itemAll = res.data
    },
    // 获取督办小组基础数据
    async _getTreeGroup() {
      const req = {
        eduCode: this.userInfo.schoolCode // 机构编码
      }
      const res = await this.getTreeGroup(req)
      this.specificAll = this.initSpecificAll(res.data)
      // return res.data[0].memberList && res.data[0].memberList.map(v => v.eduCode)
    },
    // 格式化督办小组数据
    initSpecificAll(data) {
      data.forEach(item => {
        // 树组件指定属性名
        item.leve = '1'
        item.title = item.streetName
        item.children = item.superviseGroupDtoList
        item.key = item.streetCode
        item.superviseGroupDtoList.forEach((v, index) => {
          v.leve = '2'
          v.key = `${v.leaderCode}`
          v.children = []
          v.title = v.groupName
          // 后台用的属性名
          v.teamLeaderCode = v.leaderCode
          v.teamLeaderName = v.leaderName
          v.schoolDTOList = v.memberList.map(res => {
            return {
              schoolCode: res.eduCode,
              schoolName: res.eduName
            }
          })
        })
      })
      return data
    },
    onChange(value, dateString) {
      this.beginTime = dateString[0]
      this.endTime = dateString[1]
    },
    async showSpecific(type) {
      this.$refs.itemAll.$refs.modal.visible = true
    },
    setItem(data) {
      this.selectItem = data.map(v => v.id)
      // appForm.specificIndicators: data.map(item => item.name) + ''
      this.form.setFieldsValue({
        specificIndicators: data.map(item => item.name) + ''
      })
      // this.appForm.specificIndicators = data.map(item => item.name) + ''
    },
    async showSupervision() {
      this.$refs.supervisio.$refs.modal.visible = true
    },
    setSupervisio(data) {
      // 展示数据
      this.form.setFieldsValue({
        supervisionTeam: data.map(v => v.title) + ''
      })
      this.groupList = data.map(res => {
        const { teamLeaderCode, teamLeaderName, schoolDTOList, streetCode, streetName } = res
        return {
          teamLeaderCode: teamLeaderCode,
          teamLeaderName: teamLeaderName,
          schoolDTOList: schoolDTOList,
          streetCode: streetCode,
          streetName: streetName
        }
      })
    },
    // 提交
    submitOk(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        this.isLoad = false
        if (!error) {
          const req = {
           	beginTime: this.beginTime,
            endTime: this.endTime,
            groupList: this.groupList, // 督查小组未知
            itemIdList: this.selectItem,
            name: values.name,
            schoolCode: this.userInfo.schoolCode
          }
          this.isLoad = true
          this.addSpecialTask(req)
            .then(res => {
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$router.go(-1)
              })
            })
            .catch(res => {
              this.isLoad = false
            })
        }
      })
    },
    onOk(value) {
    },
    cancel() {
      this.$router.go(-1)
    }

  }
}
</script>
<style lang="less" scoped>
.add-special-item {
  padding: 20px;
}
</style>
