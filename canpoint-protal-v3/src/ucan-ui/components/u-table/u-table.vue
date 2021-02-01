<template>
  <div class="u-fx-f1 u-type-white-bg">
    <div
      id="tableList"
      :style="{
        overflow: overFlow ? 'auto' : 'hidden',
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%'
      }"
    >
      <a-table
        :scroll="{ y: scrollH || setScroll('tableList') }"
        :customRow="customRow"
        :pagination="paginationObj"
        :rowKey="(record) => record._id || record.id"
        :rowSelection="selectObj"
        :columns="columns"
        :dataSource="tableList"
      >
        <template v-if="isIndex" slot="index" slot-scope="text, record, index">
          {{ index | getPageIndex(pageList) }}
        </template>
        <template slot="photoPic" slot-scope="text">
          <a-popover placement="left" v-if="isZoom">
            <template slot="content">
              <img :src="text || autoUserImg" style="max-width: 400px; max-height: 400px; display: block" alt />
            </template>
            <img
              :src="text || autoUserImg"
              :style="{ width: `${width}px`, height: `${height}px`, display: 'block' }"
              alt
            />
          </a-popover>
          <img
            v-if="!isZoom"
            :src="text || autoUserImg"
            :style="{ width: `${width}px`, height: `${height}px`, display: 'block' }"
            alt
          />
        </template>
        <template slot="snapPic" slot-scope="text">
          <a-popover placement="left" v-if="isZoom">
            <template slot="content">
              <img :src="text || autoUserImg" style="max-width: 400px; max-height: 400px; display: block" alt />
            </template>
            <img
              :src="text || autoUserImg"
              :style="{ width: `${width}px`, height: `${height}px`, display: 'block' }"
              alt
            />
          </a-popover>
          <img
            v-if="!isZoom"
            :src="text || autoUserImg"
            :style="{ width: `${width}px`, height: `${height}px`, display: 'block' }"
            alt
          />
        </template>
        <template slot="customTitle">
          <slot name="customTitle"></slot>
        </template>
        <template slot="slotOne" slot-scope="text, record">
          <slot name="slotOne" :record="record"></slot>
        </template>
        <template slot="slotTwo" slot-scope="text, record">
          <slot name="slotTwo" :record="record"></slot>
        </template>
        <template slot="slotThree" slot-scope="text, record">
          <slot name="slotThree" :record="record"></slot>
        </template>
        <template slot="slotFour" slot-scope="text, record">
          <slot name="slotFour" :record="record"></slot>
        </template>
        <template slot="slotFive" slot-scope="text, record">
          <slot name="slotFive" :record="record"></slot>
        </template>
        <template slot="actions" slot-scope="text, record">
          <slot name="actions" :record="record"></slot>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import autoUserImg from '@a/img/snap-user.png'
export default {
  name: 'UTable',
  props: {
    // 表格列表数据
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格分页数据, 用来处理表格索引
    pageList: {
      type: Object,
      default: () => {
        return {
          page: 1,
          size: 20
        }
      }
    },
    // 当表格有单选和多选时选中的值
    // 已每条数据的唯一标识id作为值
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格标题配置数据
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 数据过多是否隐藏
    overFlow: {
      type: Boolean,
      default: false
    },
    // 图片宽度
    width: {
      type: [Number || String],
      default: 40
    },
    // 图片高度
    height: {
      type: [Number || String],
      default: 40
    },
    // 图片是否有查看大图效果
    isZoom: {
      type: Boolean,
      default: false
    },
    // 表格默认滚动高度
    scrollH: {
      type: Number,
      required: false,
      default: 0
    },
    // 是在显示表格列表索引
    isIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示单选框
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否显示多选框
    isCheck: {
      type: Boolean,
      default: false
    },
    // 前端数据分页
    pagination: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    // 获取表格索引
    getPageIndex: (val, obj) => {
      if (JSON.stringify(obj) === '{}') {
        return val + 1
      } else {
        return (obj.page - 1) * obj.size + val + 1
      }
    }
  },
  computed: {
    typeForm() {
      if (this.isRadio) {
        return 'radio'
      } else if (this.isCheck) {
        return 'checkbox'
      } else {
        return 'checkbox'
      }
    },
    selectedRowKeys: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    selectObj() {
      if (!this.isRadio && !this.isCheck) return null
      return {
        type: this.typeForm,
        onSelectAll: this.onSelectAll,
        selectedRowKeys: this.selectedRowKeys,
        onSelect: this.selectChange,
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.disabled
          }
        })
      }
    }
  },
  data() {
    return {
      autoUserImg,
      paginationObj: false
    }
  },
  created() {
    if (this.pagination) {
      this.paginationObj = {
        total: 0,
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '100'],
        showTotal: (total) => `共有 ${total} 条数据`
      }
    }
  },
  methods: {
    // table滚动高度
    setScroll(id) {
      if (document.getElementById(id)) {
        return document.getElementById(id).offsetHeight - 40
      }
    },
    onSelectAll(type, selectedRows, changeRows) {
      const data = changeRows.map((item) => {
        return {
          id: item.id,
          userName: item.userName,
          ...item
        }
      })
      this.$emit('selectAll', data, type)
    },
    // 点击单行表格
    customRow(record, index) {
      return {
        on: {
          click: () => {
            if (this.isRadio) {
              this.selectedRowKeys = [record._id || record.id]
              this.$emit('clickRow', record, true)
            } else if (this.isCheck) {
              const index = this.selectedRowKeys.indexOf(record._id || record.id)
              if (index > -1) {
                this.selectedRowKeys.splice(index, 1)
                this.$emit('clickRow', record, false)
              } else {
                this.$emit('clickRow', record, true)
                this.selectedRowKeys.push(record._id || record.id)
              }
            }
          }
        }
      }
    },
    // 点击单选框
    selectChange(record, type) {
      if (this.isRadio) {
        this.selectedRowKeys = [record._id || record.id]
      } else {
        const index = this.selectedRowKeys.indexOf(record._id || record.id)
        if (index > -1) {
          this.selectedRowKeys.splice(index, 1)
        } else {
          this.selectedRowKeys.push(record._id || record.id)
        }
      }
      this.$emit('clickRow', record, type)
    },
    // 点击复选框
    onSelectChange(record) {
      if (this.isCheck) this.selectedRowKeys = record
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  border-bottom: 1px #f5f5f5 solid !important;
}
/deep/ .ant-table-thead > tr > th {
  border-bottom: 1px #eee solid !important;
}
/deep/ .ant-table-row:hover {
  background-color: #f5f5f5 !important;
}
</style>
