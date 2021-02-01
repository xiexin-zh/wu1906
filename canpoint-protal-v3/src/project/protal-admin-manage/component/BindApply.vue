<template>
  <u-drawer
    @confirm="onDefine"
    title="绑定应用"
    v-model="status"
    :width="600"
  >
    <u-alert show-icon message="点击选中应用模块，再次点击则取消，可同时选中多个模块" closable type="warning"></u-alert>
    <div class="u-mar-t">
      <a-input-search placeholder="请输入应用名称" style="width: 100%" @search="onSearch" />
      <u-empty v-if="applyList.length === 0" description="暂无应用~"> </u-empty>
      <div
        :class="['app-check u-fx-ac-jc', { 'app-choose': item.check }]"
        v-for="(item, index) in applyList"
        :key="item.id"
        style="borderRadius:4px;"
        @click="appClick(index)"
      >
        <img class="right-img" :src="item.appLogo" alt />
        <div class="title u-te">{{ item.appName }}</div>
      </div>
    </div>
  </u-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'BindDrawer',
  components: {
  },
  props: {
    schoolInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    plateformType: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    bindList: {
      type: Array,
      default: () => {
        return {}
      }
    }
  },
  watch: {},
  data() {
    return {
      applyList: [],
      searchValue: '',
      chooseValue: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  mounted() {
    this.applyGetList()
  },
  methods: {
    ...mapActions('home', ['allAppList', 'schoolBindApp']),
    // 应用库列表
    async applyGetList(plateformType, category) {
      const req = {
        appName: this.appName,
        plateformType: this.plateformType,
        appCategoryCode: this.category
      }
      const res = await this.allAppList(req)
      const data = res.data.map(el => {
        return {
          ...el,
          check: false
        }
      })
      const result = this.bindList.map(el => {
        return el.id
      })
      this.applyList = data.filter(el => {
        return result.indexOf(el.id) === -1
      })
    },
    onSearch(value) {
      this.appName = value
      this.applyGetList()
    },
    appClick(index) {
      this.applyList[index].check = !this.applyList[index].check
      this.appFilter()
    },
    appFilter() {
      this.chooseList = this.applyList.filter(el => {
        return el.check
      })
    },
    onDefine() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要绑定的应用')
        return
      }
      const appIdList = this.chooseList.map(el => {
        return el.id
      })
      const req = {
        schoolCode: this.schoolInfo.schoolCode,
        appIdList: appIdList
      }
      this.schoolBindApp(req).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.$emit('update')
        })
      })
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.app-check {
  width: 22.5%;
  height: 125px;
  margin: 25px 0 5px 2%;
  font-size: 14px;
  float: left;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  -webkit-box-shadow: 2px 2px 4px #eee;
  box-shadow: 2px 2px 4px #eee;
  background-color: rgba(77, 76, 172, 0.6);
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  .title {
    margin-top: 10px;
    overflow: hidden;
  }
  .right-img {
    width: 62px;
    height: 62px;
    display: block;
  }
}
.app-choose {
  // background: url('../../assets/img/choose-blue.png') no-repeat right top;
  background-size: 25px 25px;
  background-color: #4d4cac;
  border: 2px #4d4cac solid;
}
</style>
