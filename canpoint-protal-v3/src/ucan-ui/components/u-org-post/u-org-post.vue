<template>
  <div class="u-org-post">
    <div class="u-fx-jc layout-padd">
      <u-radio v-model="currentVal" :item-list="tabList"></u-radio>
    </div>
    <u-org-tree v-if="currentVal === '1'" @select="selectTree" :school="school"></u-org-tree>
    <div v-else>
      <u-empty v-if="noData" description="什么也没有~"></u-empty>
      <ul class="post u-tx-c u-line3 u-padd-l u-padd-r">
        <li
          :class="{ act: current === index }"
          v-for="(list,index) in postList"
          :key="list.id"
          @click="selectPost(list,index)"
        >{{ list.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ajax from '@u/libs/ajax-serve'
export default {
  name: 'UOrgPost',
  data() {
    return {
      tabList: [
        {
          label: '部门',
          value: '1'
        },
        {
          label: '职务',
          value: '2'
        }
      ],
      currentVal: '1',
      postList: [],
      noData: false,
      current: 0
    }
  },
  props: {
    // 判断是局端(edu)还是校端
    type: {
      type: String,
      default: ''
    },
    // 学校code
    school: {
      type: String,
      default: ''
    }
  },
  watch: {
    // title的变化
    currentVal(n, o) {
      if (n === '2') {
        this.current = 0
        this.getAllPostList()
      }
    }
  },
  methods: {
    // 获取职务列表
    async getAllPostList() {
      const res = await $ajax.get({
        url: '/protal_v3_11101/canpointStation/allList',
        params: {
          schoolCode: this.school
        }
      })
      this.postList = res.data
      this.noData = res.data.length === 0
      const selectObj = {
        code: res.data.length > 0 ? res.data[0].code : '',
        key: res.data.length > 0 ? res.data[0].code : '',
        title: res.data.length > 0 ? res.data[0].name : '',
        type: '2'
      }
      this.$emit('select', selectObj)
    },
    // 组织选择 type = '1'
    selectTree(value) {
      value.type = '1'
      this.$emit('select', value)
    },
    // 职务选择 type: '2'
    selectPost(value, index) {
      this.current = index
      const selectObj = {
        code: value.code,
        key: value.code,
        title: value.name,
        type: '2'
      }
      this.$emit('select', selectObj)
    }
  }
}
</script>

<style lang="less" scoed>
.u-org-post {
  width: 220px;
  overflow-y: auto;
  .post {
    cursor: pointer;
    color: #474747;
    .act {
      background-color: #b5e9ff;
    }
  }
}
</style>
