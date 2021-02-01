<template>
  <div class="u-fx-f1" id="tableList">
    <submit-form
      ref="form"
      @submit-form="submitForm"
      :title="title"
      v-model="formStatus"
      :form-data="formData"
    >
      <div slot="upload">
        <upload-multi :length="1" v-model="fileList" :fileInfo="fileInfo"></upload-multi>
      </div>
    </submit-form>
    <a-button
      style="margin-top: 10px; margin-left: 5px;"
      @click="addMenu(1, '新增菜单分类', { id: '', parentId: '' })"
      icon="plus"
      class="add-btn"
    >新增菜单分类</a-button>
    <a-table
      style="background-color: #fff; margin-top: 20px; height: 400px;"
      :scroll="{ y: this.$tools.setScroll('tableList') - 50 }"
      :rowKey="record => record.id"
      :pagination="false"
      :columns="columns"
      :dataSource="menuList"
      @expand="expandTree"
    >
      <template slot="showUrl" slot-scope="text, record">
        <div class="table-total-num" v-if="record.isPlatform && !record.parentId">平台</div>
        <span v-if="text">{{ text }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <a-switch v-if="!record.children" :defaultChecked="text"></a-switch>
      </template>
      <template slot="actions" slot-scope="text, record, index">
        <a-tooltip placement="topLeft" title="新增菜单" v-if="!record.parentId">
          <a-button
            size="small"
            class="add-action-btn"
            icon="plus"
            @click="addMenu(2, '新增菜单', record, index, false)"
          ></a-button>
        </a-tooltip>
        <a-tooltip placement="topLeft" title="编辑菜单">
          <a-button
            size="small"
            class="edit-action-btn"
            icon="form"
            @click="addMenu(2, '编辑菜单', record, index, true)"
          ></a-button>
        </a-tooltip>
        <a-popconfirm
          placement="left"
          okText="确定"
          cancelText="取消"
          @confirm="delMenu(record, index)"
        >
          <template slot="title">您确定删除吗?</template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import $ajax from '@u/libs/ajax-serve'
import hostEnv from '@config/host-env'
import SubmitForm from './SubmitForm'
import UploadMulti from '@c/UploadMulti'
import { Switch, Tooltip } from 'ant-design-vue'
export { default as FormOutline } from '@ant-design/icons/lib/outline/FormOutline'
export { default as DeleteOutline } from '@ant-design/icons/lib/outline/DeleteOutline'
const formData = [
  {
    value: 'menuName',
    initValue: '',
    type: 'input',
    label: '名称',
    max: 8,
    placeholder: '请输入名称, 最大长度不能超过8个字符'
  },
  {
    value: 'isPlatform',
    initValue: 0,
    list: [
      {
        key: 0,
        val: '否'
      },
      {
        key: 1,
        val: '是'
      }
    ],
    type: 'radio',
    label: '平台应用',
    placeholder: '请选择是否为平台应用'
  },
  {
    value: 'linkUrl',
    initValue: '',
    type: 'input',
    label: '路径',
    placeholder: '请输入菜单路径'
  },
  {
    type: 'upload',
    label: '菜单图标'
  },
  {
    value: 'remark',
    initValue: '',
    type: 'input',
    label: '备注',
    required: false,
    placeholder: '请输入备注'
  }
]
const columns = [
  {
    title: '菜单分类/名称',
    dataIndex: 'menuName',
    width: '15%'
  },
  {
    title: '菜单类型/路径',
    dataIndex: 'linkUrl',
    width: '30%',
    scopedSlots: {
      customRender: 'showUrl'
    }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '20%'
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      const d = new Date(text)
      return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
        '-' +
        (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
      )
    }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: { customRender: 'actions' }
  }
]
export default {
  name: 'MenuManage',
  components: {
    ASwitch: Switch,
    ATooltip: Tooltip,
    SubmitForm,
    UploadMulti
  },
  props: {
    plateformType: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      title: '菜单',
      menuList: [],
      columns,
      formData: formData,
      formStatus: false,
      fileList: [],
      fileInfo: {
        tip: '上传图标',
        h: 120, // 高度
        w: 120 // 宽度
      }
    }
  },
  async mounted() {
    this.getMenuList(1, '')
  },
  methods: {
    /**
     * @description 菜单列表展示
     * @params { menuType: '类型' }, { parentId: '父级id' }
     */
    async getMenuList(menuType, parentId) {
      const res = await $ajax.post({
        url: `${hostEnv.zx_protal}/menu/manage/node/list`,
        params: {
          menuType,
          parentId,
          plateformType: this.plateformType
        }
      })
      if (menuType === 1) {
        this.menuList = res.data
          .map(item => {
            return {
              ...item,
              children: []
            }
          })
          .sort((a, b) => {
            return b.isPlatform - a.isPlatform
          })
      } else {
        this.menuList.find(item => {
          return item.id === parentId
        }).children = res.data
      }
    },
    /**
     * @description 点击展开图标
     */
    expandTree(expanded, record) {
      if (expanded) this.getMenuList(2, record.id)
    },
    /**
     * @description 新增系统和菜单
     * @params { type: '菜单类型' },{ title: '弹出层标题' },{ record: '当前项列表' },{ index: '系统索引' }, { tag: '是否编辑'}
     */
    addMenu(type, title, record, index, tag) {
      this.id = record.id // 存储当前菜单id
      this.parentId = record.parentId // 存储父级id
      this.menuType = type // 存储菜单类型
      this.menuIndex = index // 存储当前点击系统索引，方便直接添加菜单
      this.isEdit = tag
      this.formStatus = true
      this.title = title
      this.fileList = []
      // 编辑
      if (tag) {
        if (type === 1 || !record.parentId) {
          this.formData = this.$tools.fillForm([formData[0], formData[1], formData[4]], record)
          this.formData[1].disabled = true
        } else {
          if (record.icon) {
            this.fileList = [
              {
                id: Math.floor(Math.random() * 10000),
                url: record.icon
              }
            ]
          }
          this.formData = this.$tools.fillForm([formData[0], formData[2], formData[3], formData[4]], record)
        }
      } else {
        if (type === 1) {
          this.formData = [formData[0], formData[1], formData[4]]
          if (this.plateformType === '1') {
            this.formData[1].disabled = true
          }
        } else {
          this.isPlatform = record.isPlatform
          this.formData = [formData[0], formData[2], formData[3], formData[4]]
        }
      }
    },
    async submitForm(values) {
      if (this.menuType === 2) {
        if (this.fileList.length === 0) {
          this.$message.warning('请上传图标')
          this.$refs.form.error()
          return
        }
        values.icon = this.fileList[0].url
      }
      const { menuName, icon = '', linkUrl, remark, isPlatform = 0 } = values
      try {
        // 编辑
        if (this.isEdit) {
          const params = {
            id: this.id,
            menuName,
            linkUrl,
            icon,
            isPlatform,
            parentId: this.parentId,
            plateformType: this.plateformType,
            createTime: new Date().getTime(),
            remark
          }
          await $ajax.post({
            url: `${hostEnv.zx_protal}/menu/manage/update`,
            params
          })
          if (this.parentId) {
            this.menuList.find(item => {
              return item.id === this.parentId
            }).children[this.menuIndex] = params
          } else {
            this.menuList[this.menuIndex].menuName = params.menuName
            this.menuList[this.menuIndex].remark = params.remark
          }
        } else {
          await $ajax.post({
            url: `${hostEnv.zx_protal}/menu/manage/add`,
            params: {
              menuName,
              icon,
              isPlatform: isPlatform,
              linkUrl,
              menuType: this.menuType,
              parentId: this.id,
              plateformType: this.plateformType,
              remark
            }
          })
          if (this.menuType === 1) {
            this.getMenuList(1, '')
          } else {
            this.menuList[this.menuIndex].children.push({
              id: Math.floor(Math.random() * 10000),
              menuName,
              linkUrl,
              remark,
              parentId: this.id,
              createTime: new Date().getTime()
            })
          }
        }
        this.$message.success('操作成功')
        this.$refs.form.reset()
      } catch (err) {
        this.$refs.form.error()
        this.$message.warning('操作失败')
      }
    },
    async delMenu(record, index) {
      await $ajax.get({
        url: `${hostEnv.zx_protal}/menu/manage/delete/${record.id}`
      })
      if (record.parentId) {
        this.menuList
          .find(item => {
            return item.id === record.parentId
          })
          .children.splice(index, 1)
      } else {
        this.menuList.splice(index, 1)
      }
      this.$message.success('删除成功')
    }
  }
}
</script>
