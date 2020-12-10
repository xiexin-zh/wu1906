<template>
  <div
    class="person-info"
    @mouseover="setDialog(true)"
    @mouseleave="setDialog(false)"
    @click.stop=""
    v-if="value"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    <a-row type="flex">
      <a-col>
        <div class="person-info-img">
          <img :src="person.photoSrc" alt="" style="width:100%;height:100%;" />
        </div>
      </a-col>
      <a-col style="flex: 1; margin-left: 15px;">
        <div>
          <p>姓名：{{ person.userName }}</p>
          <p>性别：{{ person.gender == '1' ? '男' : person.gender == '2' ? '女' : '未知' }}</p>
          <p v-if="person.userType.indexOf('8') !== -1">班级：{{ (schoolType === '8' || schoolType === '9') ? `${person.schoolYearId}级-${person.gradeName}-${person.className}` : `${person.gradeName}-${person.className}` }}</p>
          <p v-if="person.userType.indexOf('4') !== -1">工号：{{ person.studentNo }}</p>
          <p v-if="person.userType.indexOf('4') !== -1">身份：教职工</p>
        </div>
      </a-col>
    </a-row>
    <div v-if="person.userType.indexOf('8') !== -1">学号：{{ person.studentNo }}</div>
    <a-row type="flex" style="margin-top: 10px;" v-if="person.userType.indexOf('8') !== -1">
      <a-col>班主任：{{ person.teacherName ? person.teacherName : '暂无' }}</a-col>
      <a-col style="margin-left: 6px">联系电话：{{ person.teacherPhone ? person.teacherPhone : '暂无' }}</a-col>
    </a-row>
    <a-row
      type="flex"
      style="margin-top: 10px;"
      v-if="person.userType.indexOf('8') !== -1"
      v-for="list in person.parentsList"
      :key="list.parentsPhone"
    >
      <a-col>{{ list.relation | getParentType }}：{{ list.parentsName }}</a-col>
      <a-col style="margin-left: 6px">联系电话：{{ list.parentsPhone }}</a-col>
    </a-row>
    <a-row
      type="flex"
      style="margin-top: 10px;"
      v-if="person.userType.indexOf('8') !== -1 && person.parentsList && person.parentsList.length === 0"
    >
      <p>家长 ：暂无 &nbsp;&nbsp; 联系电话：暂无</p>
    </a-row>
    <a-row v-if="(person.userType.indexOf('4') !== -1 && show) || person.userType.indexOf('8') !== -1">
      <slot></slot>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'PersonInfo',
  props: {
    person: {
      type: Object,
      default: function() {
        return {}
      }
    },
    value: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: function() {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },
  data() {
    return {
      schoolType: JSON.parse(window.sessionStorage.getItem('loginInfo')).schoolType
    }
  },
  filters: {
    getParentType(type) {
      if (type === '1') {
        return '爸爸'
      } else if (type === '2') {
        return '妈妈'
      } else if (type === '3') {
        return '爷爷'
      } else if (type === '4') {
        return '奶奶'
      } else {
        return '家长'
      }
    }
  },
  methods: {
    setDialog: function(tag) {
      this.$emit('input', tag)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.person-info {
  border: 1px @main-color solid;
  padding: 15px;
  position: fixed;
  z-index: 99;
  border-radius: 4px;
  width: 313px;
  // height: 280px;
  background: @main-color;
  color: #fff;
  .person-info-img {
    border-radius: 3px;
    overflow: hidden;
    width: 100px;
    height: 125px;
    background-color: #fff;
  }
}
</style>
