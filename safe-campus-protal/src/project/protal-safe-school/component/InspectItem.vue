<template>
  <a-modal
    title="选择检查事项"
    v-model="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="1200px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
  >
    <a-radio-group default-value="a" button-style="solid" v-model="checkType" @change="change">
      <a-radio-button
        v-for="(list,index) in radioList"
        :key="index"
        :value="index"> {{ list }} </a-radio-button>
    </a-radio-group>
    <div class="tree-box">
      <a-tree
        v-if="orgData.length > 0"
        :treeData="orgData"
        showLine
        checkable
        v-model="checkedKeys"
      >
      </a-tree>
    </div>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'InspectItem',
  components: {
  },
  data() {
    return {
      noData: false,
      orgData: [],
      code: '',
      visible: false,
      isLoad: false,
      checkType: 0,
      radioList: [],
      allTreeData: [],
      checkedKeys: []
    }
  },
  props: {
    type: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getItemTree']),
    async showList () {
      const res = await this.getItemTree()
      const data = res.data
      this.radioList = data.map(el => {
        return el.itemName
      })
      const orgData = this.newOrgData(res.data[0].children)
      this.orgData = orgData
      this.allTreeData = data
    },
    // 深层递归
    newOrgData (data) {
      data.forEach(item => {
        item.children = item.children || null
        item.title = item.itemName
        item.key = item.id + '=' + item.itemName
        if (item.children && item.children.length > 0) {
          this.newOrgData(item.children)
        }
      })
      return data
    },
    change(e) {
      const index = e.target.value
      this.orgData = this.newOrgData(this.allTreeData[index].children)
    },
    addSubmit() {
      const data = this.checkedKeys.map(el => {
        return {
          key: el.split('=')[0],
          contents: el.split('=')[1],
          checkType: this.type
        }
      })
      this.visible = false
      this.$emit('chooseTree', data)
    }
  }
}
</script>

<style lang="less" scoped>
.tree-box {
  margin-top: 10px;
  max-height: 700px;
  overflow: scroll;
}
</style>
