<template>
  <a-row
    class="pagination-com"
    :style="{ marginTop: marTop + 'px', marginBottom: marBot + 'px' }"
    type="flex"
    justify="end"
    align="middle"
  >
    <span class="page-total">一共{{ total }}条</span>
    <a-pagination
      :pageSizeOptions="pageSizeOptions"
      :pageSize.sync="value.size"
      :total="total"
      :current="value.page"
      :size="size"
      :showSizeChanger="changer"
      :showQuickJumper="jumper"
      @change="changePage"
      @showSizeChange="changeSize"
    />
  </a-row>
</template>

<script>
export default {
  name: 'PageNum',
  props: {
    size: {
      type: String,
      default: ''
    },
    jumper: {
      type: Boolean,
      default: true
    },
    changer: {
      type: Boolean,
      default: true
    },
    marTop: {
      type: Number,
      default: 30
    },
    marBot: {
      type: Number,
      default: 30
    },
    total: {
      type: Number,
      default: 0
    },
    value: {
      type: Object,
      default: () => {
        return {
          page: 1,
          size: 20
        }
      }
    }
  },
  data() {
    return {
      pageList: this.value,
      pageSizeOptions: ['10', '20', '30', '40', '100', '200']
    }
  },
  mounted() {},
  methods: {
    changePage(page, size) {
      this.$emit('input', {
        page,
        size
      })
      this.$emit('change-page')
    },
    changeSize(page, size) {
      this.$emit('input', {
        page,
        size
      })
      this.$emit('change-page')
    }
  }
}
</script>

<style lang="less" scoped>
.pagination-com {
  padding-right: 10px;
  .page-total {
    margin-right: 10px;
  }
}
</style>
