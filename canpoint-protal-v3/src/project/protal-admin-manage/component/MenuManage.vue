<template>
  <div class="menu u-tx-c u-fx-ver">
    <div class="layout-padd-l u-mar-r10 u-fx-f1">
      <ul class="menu-type u-scroll-y" :style="{ maxHeight: maxHeight + 'px' }">
        <li
          :class="[{ 'u-tips-color u-type-info-light-bg': currentIndex === index }, 'u-fx-ac u-bd-b']"
          @click="chooseLevel(level, index)"
          v-for="(level, index) in levelList"
          :key="level.id"
        >
          <div class="menu-name">{{ level.menuName }}</div>
          <div v-if="currentIndex === index">
            <u-button type="link" @click="editLevel(true, '编辑菜单分类', level)">编辑</u-button>
            <u-button type="link" delete @click="delLevel(level)">删除</u-button>
          </div>
        </li>
      </ul>
      <ul class="menu-type">
        <li class="add-menu u-mar-t20">
          <u-button type="light" icon="plus" @click="editLevel(false, '添加菜单分类')">新增分类</u-button>
        </li>
      </ul>
    </div>
    <u-submit-form ref="form" :title="formTitle" :formData="formData.levelFormData" v-model="formStatus" @submit="submit"/>
  </div>
</template>

<script>
import formData from '../submit-columns/menus'
import { mapActions } from 'vuex'
export default {
  name: 'MenuManage',
  props: {
    menuCategory: { // 菜单分类编码(1-校端 2-局端 3-运营端 4-教职工 5-家长)
      type: String || Number,
      default: 1,
      required: true
    },
    plateformType: { // 终端类型（1-pc端，2-小程序端，3-公众号端）
      type: String || Number,
      default: '1',
      required: true
    }
  },
  data() {
    return {
      maxHeight: document.body.clientHeight - 250,
      formTitle: '',
      formStatus: false,
      formData,
      levelList: [],
      currentIndex: 0
    }
  },
  watch: {
    menuCategory: {
      handler(n, o) {
        this.levelAllList()
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('home', ['addMenu', 'updateMenu', 'removeMenu', 'getOneMenuList']),
    // 查询分类列表
    async levelAllList(tag = false) {
      const res = await this.getOneMenuList({
        menuCategory: this.menuCategory,
        plateformType: this.plateformType
      })
      this.levelList = res.data
      if (tag) return
      if (this.levelList.length === 0) {
        this.$emit('choose', false)
        this.menuList = []
      } else {
        this.currentIndex = 0
        this.$emit('choose', this.levelList[0])
      }
    },
    // 切换分类
    chooseLevel(item, index) {
      this.currentIndex = index
      this.$emit('choose', item)
    },
    // 编辑分类
    editLevel(tag, title, item = {}) {
      this.isEdit = tag
      this.formTitle = title
      if (this.isEdit) {
        this.actionFun = 'updateMenu'
        this.formData.levelFormData = this.$tools.fillForm(formData.levelFormData, item)
        this.id = item.id
      } else {
        this.actionFun = 'addMenu'
        this.formData.levelFormData = this.$tools.fillForm(formData.levelFormData, {})
      }
      this.formStatus = true
    },
    // 删除分类
    async delLevel(item) {
      try {
        await this.removeMenu(item.id)
        this.$message.success('删除成功')
        this.$tools.goNext(() => {
          this.levelAllList()
        })
      } catch (err) {}
    },
    // 报存提交分类信息
    async submit(values) {
      if (this.isEdit) values.id = this.id
      try {
        await this[this.actionFun]({
          menuCategory: this.menuCategory,
          menuType: '1',
          ...values,
          plateformType: this.plateformType
        })
        this.$message.success('操作成功')
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          this.levelAllList(true)
          this.$tools.goNext(() => {
            if (this.isEdit) {
              const index = this.levelList.findIndex(val => val.id === this.id)
              this.chooseLevel(this.levelList[index], index)
            } else {
              this.chooseLevel(this.levelList[this.levelList.length - 1], this.levelList.length - 1)
            }
          })
        })
      } catch (err) {
        this.$refs.form.error()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  width: 220px;
  .menu-type {
    li {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      .menu-name{
        width: 120px;
      }
    }
    .add-menu {
      height: 35px;
      line-height: 35px;
      border-bottom: none;
    }
  }
}
</style>
