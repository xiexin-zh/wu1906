<template>
  <div class="page-layout qui-fx-ver">
    <search-form is-reset @search-form="searchForm" :search-label="searchLabel">
      <div slot="left">
        <a-button type="primary" icon="plus" @click="addApp(0)">新增区域</a-button>
        <a-button icon="delete" class="del-btn mar-l10" @click="dels">批量删除</a-button>
      </div>
    </search-form>
    <table-list
      is-check
      :page-list="pageList"
      :columns="columns"
      :table-list="userList"
      v-model="chooseList"
      @clickRow="clickRow"
      @selectAll="selectAll">
      <template v-slot:actions="action">
        <a-tooltip placement="topLeft" title="编辑">
          <a-button size="small" class="edit-action-btn" icon="form" @click.stop="addApp(1,action)"></a-button>
        </a-tooltip>
        <a-popconfirm placement="left" okText="确定" cancelText="取消" @confirm="del(action)">
          <template slot="title"> 确定删除该巡检区域吗? </template>
          <a-tooltip placement="topLeft" title="删除">
            <a-button size="small" class="del-action-btn" icon="delete"></a-button>
          </a-tooltip>
        </a-popconfirm>
      </template>
      <template v-slot:other1="other1">
        <img class="ewm" :src="img" alt="" @click.stop="ewmClick(other1.record)">
      </template>
    </table-list>
    <page-num v-model="pageList" :total="total" @change-page="showList"></page-num>
    <a-modal
      :visible="visible"
      :footer="null"
      centered
      @cancel="visible = false"
      :bodyStyle="bodyStyle"
      width="360px"
      :closable="false"
      :destroyOnClose="true"
    >
      <div class="erm-box qui-fx-ver">
        <div class="logo">  <img :src="logo" alt=""> </div>
        <div class="qr-code" id="qrCode" ref="qrCodeDiv"></div>
        <div class="area"> 巡检点：{{ area }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchForm from '@c/SearchForm'
import TableList from '@c/TableList'
import PageNum from '@c/PageNum'
import $tools from '@u/tools'
import img from '../../assets/img/ewm.png'
import logo from '../../assets/img/logo.png'
import QRCode from 'qrcodejs2'
const columns = [
  {
    title: '序号',
    scopedSlots: {
      customRender: 'index'
    },
    width: '10%'
  },
  {
    title: '区域名称',
    dataIndex: 'name',
    width: '15'
  },
  {
    title: '已关联巡查任务类型',
    dataIndex: 'taskTyps',
    width: '15%',
    customRender: text => {
      const arr = []
      if (text.indexOf('1') > -1) {
        arr.push('日常巡查')
      }
      if (text.indexOf('2') > -1) {
        arr.push('设备巡查')
      }
      if (text.indexOf('3') > -1) {
        arr.push('安全护导')
      }
      return arr.length > 0 ? arr.join(',') : '暂无关联'
    }
  },
  {
    title: '二维码照片',
    dataIndex: 'logoUrl',
    width: '15%',
    scopedSlots: {
      customRender: 'other1'
    }
  },
  {
    title: '二维码类型',
    dataIndex: 'qrcodeType',
    width: '12%',
    customRender: text => {
      if (text === '1') {
        return '静态二维码'
      } else {
        return '动态二维码'
      }
    }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    width: '15%',
    customRender: text => {
      return $tools.getDate(text)
    }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
const searchLabel = [
  {
    value: 'name',
    type: 'input',
    label: '区域名称',
    placeholder: '请输入名称'
  }
]
export default {
  name: 'InspectArea',
  components: {
    TableList,
    PageNum,
    SearchForm
  },
  data() {
    return {
      img,
      logo,
      bodyStyle: {
        padding: 0
      },
      visible: false,
      searchLabel,
      columns,
      total: 0,
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      userList: [],
      form: this.$form.createForm(this),
      areaList: [],
      disabled: false,
      chooseList: [],
      area: ''
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    this.showList()
  },
  methods: {
    ...mapActions('home', ['getInspectList', 'delInspect', 'delInspects']),
    async showList() {
      this.searchList.schoolCode = this.userInfo.schoolCode
      this.searchList = Object.assign(this.searchList, this.pageList)
      const res = await this.getInspectList(this.searchList)
      this.userList = res.data.records
      this.total = res.data.total
    },
    searchForm(values) {
      this.searchList = Object.assign(this.searchList, values)
      this.pageList.page = 1
      this.pageList.size = 20
      this.showList()
    },
    ewmClick(record) {
      this.visible = true
      this.area = record.name
      setTimeout(() => {
        const ewm = new QRCode(this.$refs.qrCodeDiv, {
          // text: `${this.userInfo.schoolCode}&${record.code}?${record.name}`,
          text: `${this.userInfo.schoolCode}&${this.userInfo.userCode}?${record.name}`,
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L// 容错率，L/M/H
        })
      }, 1)
    },
    async addApp(type, record) {
      this.$router.push({
        path: '/inspectArea/areaAdd',
        query: {
          id: record ? record.record.id : ''
        }
      })
    },
    del(record) {
      this.delInspect(record.record.id).then(res => {
        this.$message.success('操作成功')
        this.$tools.goNext(() => {
          this.showList()
          this.chooseList = []
        })
      })
    },
    dels() {
      if (this.chooseList.length === 0) {
        this.$message.warning('请选择要删除的巡检区域')
        return false
      }
      this.$tools.delTip('确定删除选中的巡检区域吗？', () => {
        this.delInspects(this.chooseList).then(res => {
          this.$message.success('操作成功')
          this.$tools.goNext(() => {
            this.showList()
          })
        })
      })
    },
    selectAll(item, type) {
      if (type) {
        this.totalList = this.totalList.concat(item)
      } else {
        item.forEach(item => {
          const index = this.totalList.findIndex(list => {
            return list.id === item.id
          })
          this.totalList.splice(index, 1)
        })
      }
    },
    // 监听选中或取消
    clickRow(item, type) {
      if (type) {
        if (this.isCheck) {
          this.totalList.push(item)
        } else {
          this.totalList = [item]
        }
      } else {
        const index = this.totalList.findIndex(list => list.id === item.id)
        this.totalList.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ewm {
  width: 23px;
  height: 23px;
  cursor: pointer;
}
.erm-box {
  background: url('../../assets/img/ewm-bg.png') no-repeat;
  background-size: 100% 100%;
  text-align: center;
  padding: 10px 0;
  div {
    margin: 15px 0;
  }
  .logo {
    width: 100%;
    height: 38px;
    img {
      height: 100%;
    }
  }
  .qr-code {
    margin: auto;
    background-color: #fff;
    padding: 15px;
    border-radius: 8px;
  }
  .area {
    color: #fff;
    font-size: 18px;
  }
}
</style>
