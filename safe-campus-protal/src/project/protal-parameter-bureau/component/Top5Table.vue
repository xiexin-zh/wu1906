<template>
  <!-- 排行前5表格 -->
  <div class="table" >
    <a-table
      class="tableBox"
      :rowKey="(record, index) => index"
      :columns="columns"
      :pagination="false"
      :data-source="data"
      :rowClassName="setRowClassName"
      bordered>
      <template slot="index" slot-scope="text, record, index">{{
        index+1
      }}</template>
    </a-table>
  </div>
</template>
<script>
export default {
  name: 'Top5Table',
  props: {
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    checkTableIndex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  },
  methods: {
    setRowClassName (record, index) {
      if (index === this.checkTableIndex) {
        return 'activeRowcolor'
      }
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.table{
  width: 100%;
  height: 100%;
  @{deep} .ant-table-thead > tr >th{
    background: #C9CEEEFF !important;
  }
  @{deep} .activeRowcolor{
    background: #eff0f9 !important;
  }
}
</style>
