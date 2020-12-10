<template>
  <div id="tableList" class="qui-fx-f1" style="overflow: hidden">
    <a-table
      style="height: 400px"
      :scroll="{y: this.$tools.setScroll('tableList') - scrollH}"
      :customRow="customRow"
      :pagination="false"
      :rowKey="(record) => record.id"
      :rowSelection="selectObj"
      :columns="columns"
      :dataSource="tableList"
    >
      <template
        v-if="isIndex"
        slot="index"
        slot-scope="text, record, index"
      >{{ index | getPageIndex(pageList) }}</template>
      <template slot="photoPic" slot-scope="text">
        <a-popover placement="left" v-if="isZoom">
          <template slot="content">
            <img :src="text" style="max-width: 200px; max-height: 220px; display: block;" alt />
          </template>
          <img
            :src="text"
            :style="{width: `${width}px`, height: `${height}px`, display: 'block'}"
            alt
          />
        </a-popover>
        <img
          v-if="!isZoom"
          :src="text"
          :style="{width: `${width}px`, height: `${height}px`, display: 'block'}"
          alt
        />
      </template>
      <template slot="snapPic" slot-scope="text">
        <a-popover placement="left" v-if="isZoom">
          <template slot="content">
            <img :src="text" style="max-width: 200px; max-height: 220px; display: block;" alt />
          </template>
          <img
            :src="text"
            :style="{width: `${width}px`, height: `${height}px`, display: 'block'}"
            alt
          />
        </a-popover>
        <img
          v-if="!isZoom"
          :src="text"
          :style="{width: `${width}px`, height: `${height}px`, display: 'block'}"
          alt
        />
      </template>
      <template slot="action" slot-scope="text, record">
        <slot name="actions" :record="record"></slot>
      </template>
      <template slot="stucollect" slot-scope="text, record">
        <slot name="stucollects" :record="record"></slot>
      </template>
      <template slot="teacollect" slot-scope="text, record">
        <slot name="teacollects" :record="record"></slot>
      </template>
      <template slot="num" slot-scope="text" >
        <div class="table-total-num" @click="numDetail(text)">{{ text.number === null ? 0 : text.number}}</div>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    width: {
      type: Number,
      default: 60
    },
    height: {
      type: Number,
      default: 60
    },
    scrollH: {
      type: Number,
      default: 0
    },
    isZoom: {
      type: Boolean,
      default: false
    },
    isIndex: {
      type: Boolean,
      default: true
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableList: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageList: {
      type: Object,
      default: () => {
        return {
          page: 1,
          size: 200
        }
      }
    },
    // 选中项
    value: {
      type: Array,
      default: () => {
        return []
      }
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
        onChange: this.onSelectChange
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    onSelectAll(type, selectedRows, changeRows) {
      const data = changeRows.map(item => {
        return {
          id: item.id,
          name: item.userName
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
              this.selectedRowKeys = [record.id]
              this.$emit('clickRow', { id: record.id, name: record.userName }, true)
            } else if (this.isCheck) {
              const index = this.selectedRowKeys.indexOf(record.id)
              if (index > -1) {
                this.selectedRowKeys.splice(index, 1)
                this.$emit('clickRow', { id: record.id, name: record.userName }, false)
              } else {
                this.$emit('clickRow', { id: record.id, name: record.userName }, true)
                this.selectedRowKeys.push(record.id)
              }
            }
          }
        }
      }
    },
    // 点击单选框
    selectChange(record) {
      if (this.isRadio) this.selectedRowKeys = [record.id]
    },
    // 点击复选框
    onSelectChange(record) {
      if (this.isCheck) this.selectedRowKeys = record
    },
    numDetail(record) {
      this.$emit('clickNum', record)
    }
  }
}
</script>

<style lang="less" scoped>
.table-total-num {
    display: inline-block;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    padding: 0 10px;
    line-height: 20px;
    font-size: 12px;
    height: 22px;
    border-radius: 4px;
    color: #1890ff;
    cursor: pointer;
}
</style>
