<template>
  <div class="del-tag" @click="delTag(tagInfo.id)">{{ tagInfo.name }}</div>
</template>

<script>
export default {
  name: 'DeleteTag',
  props: {
    tagInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    delTag(id) {
      this.$tools.delTip('是否删除此项?', () => {
        this.$emit('delTag', id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.del-tag {
  cursor: pointer;
  color: #6882da;
  background: #ddd url('./img/del.png') no-repeat bottom right;
  background-size: 20px 20px;
  padding: 6px 18px;
  &:hover {
    background-color: #999;
    color: #fff;
  }
}
</style>
