<template>
  <a-row
    :style="{ padding: padding + 'px' }"
    class="u-pagination"
    type="flex"
    align="middle"
    :justify="justify"
  >
    <span class="page-total">一共{{ total }}条</span>
    <a-pagination
      :pageSize.sync="value.size"
      :total="total"
      size="value.size"
      :current="value.page"
      :page-size-options="pageSizeOptions"
      showSizeChanger
      :showQuickJumper="jumper"
      @change="changePage"
      @showSizeChange="changePage"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span>{{ props.value }}条/页</span>
      </template>
    </a-pagination>
  </a-row>
</template>

<script>
export default {
  name: 'UPagination',
  props: {
    // 分页间距
    padding: {
      type: Number,
      default: 20
    },
    // 是否显示跳转页面
    jumper: {
      type: Boolean,
      default: true
    },
    // 分页总条数
    total: {
      type: Number,
      default: 0
    },
    // 水平位置布局 默认局右
    // start：居左 center：居中
    justify: {
      type: String,
      default: 'end'
    },
    // 分页参数 默认page: 1, size: 20
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
      pageSizeOptions: ['10', '20', '40', '100', '200', '500'],
      pageList: this.value
    }
  },
  mounted() {},
  methods: {
    changePage(page, size) {
      this.$emit('input', {
        page,
        size
      })
      this.$emit('change', {
        page,
        size
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-pagination-item-active a {
  color: #fff !important;
  background-color: @u-type-primary !important;
}
.u-pagination {
  .page-total {
    font-size: 12px;
    margin-right: 10px;
    letter-spacing: 1px;
    color: @u-type-primary;
  }
}
</style>
