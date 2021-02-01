<template>
  <a-modal
    :title="title"
    v-model="addVisible"
    :destroyOnClose="true"
    :maskClosable="false"
    width="1400px"
    @ok="addSubmit"
    :okButtonProps="{ props: { disabled: isLoad } }"
    :cancel-button-props="{ props: { disabled: isView } }"
  >
    <a-form :form="form">
      <a-form-item label="看板名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-input
          :max-length="10"
          v-decorator="[
            'name',
            {
              initialValue: appForm.name,
              rules: [{ required: true, message: '请填写看板名称' }]
            }
          ]"
          placeholder="请填写看板名称"
        />
      </a-form-item>
      <a-form-item label="选择设备" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" required>
        <div class="u-fx-ver">
          <u-alert
            message="从所有门禁设备中选择设备添加到本看板，则本看板的识别记录来源于已选择设备。"
            type="warning"
          ></u-alert>
          <div class="u-mar-t20">
            <a-transfer
              :titles="['门禁设备列表', '已选择设备列表']"
              :data-source="deviceList"
              :target-keys="targetKeys"
              @change="onChange"
              :show-select-all="false"
            >
              <template
                slot="children"
                slot-scope="{
                  props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
                  on: { itemSelectAll, itemSelect }
                }"
              >
                <a-table
                  :rowKey="(record) => record.key"
                  :row-selection="getRowSelection({ selectedKeys, itemSelectAll, itemSelect })"
                  :columns="direction === 'left' ? leftTableColumns : rightTableColumns"
                  :data-source="filteredItems"
                  size="small"
                  :style="{ pointerEvents: listDisabled ? 'none' : null }"
                  :custom-row="
                    ({ key, disabled: itemDisabled }) => ({
                      on: {
                        click: () => {
                          if (itemDisabled || listDisabled) return
                          itemSelect(key, !selectedKeys.includes(key))
                        }
                      }
                    })
                  "
                >
                  <template slot="index" slot-scope="text, record, index">
                    {{ index | getPageIndex(pageList) }}
                  </template>
                  <template slot="slotOne" slot-scope="text, record">
                    <u-type type="deviceType">{{ getDataState('deviceType', record.deviceType) }}</u-type>
                  </template>
                  <template slot="slotTwo" slot-scope="text, record">
                    <u-type>{{ getDataState('inOrOut', record.inOrOut) }}</u-type>
                  </template>
                  <!-- <template slot="actions" slot-scope="text, record">
                    <u-button type="link" delete @click="_delControl(record.id)">删除</u-button>
                  </template> -->
                </a-table>
              </template>
            </a-transfer>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import difference from 'lodash/difference'
import { getDataState } from '@u/libs/data-state'
import { leftTableColumns, rightTableColumns } from '../table-columns/controlTab'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'AddView',
  components: {},
  props: {
    title: {
      type: String,
      default: '添加看板'
    }
  },
  data() {
    return {
      getDataState,
      leftTableColumns,
      rightTableColumns,
      targetKeys: [],
      deviceList: [],
      pageList: {
        page: 1,
        size: 99999
      },
      isLoad: false,
      addVisible: false,
      form: this.$form.createForm(this),
      appForm: {
        name: '',
        id: ''
      },
      isView: false,
      labelList: [],
      value: [],
      getList: []
    }
  },
  computed: {
    ...mapState('home', ['schoolCode', 'loginInfo'])
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
  mounted() {
    this._getDoorDeviceList()
  },
  methods: {
    ...mapActions('home', ['addBoard', 'getDoorDeviceList']),
    async _getDoorDeviceList() {
      const res = await this.getDoorDeviceList({
        schoolCode: this.schoolCode,
        pageNum: this.pageList.page,
        pageSize: this.pageList.size
      })
      this.deviceList = res.data.list.map((ele) => {
        return {
          ...ele,
          title: ele.deviceName,
          key: ele.deviceSn
        }
      })
    },
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    _delControl(id) {},
    addSubmit(e) {
      e.preventDefault()
      this.form.validateFields((error, values) => {
        if (!error) {
          if (this.targetKeys.length === 0) {
            this.$message.warning('请选择绑定设备!')
            return
          }
          this.isLoad = true
          const req = {
            boradName: values.name,
            deviceSns: this.targetKeys,
            schoolCode: this.schoolCode,
            schoolName: this.loginInfo.schoolName,
            id: this.appForm.id === '' ? undefined : this.appForm.id
          }
          this.addBoard(req)
            .then((res) => {
              this.addVisible = false
              this.isLoad = false
              this.$message.success('操作成功')
              this.$tools.goNext(() => {
                this.$emit('update')
              })
            })
            .catch((res) => {
              this.isLoad = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
