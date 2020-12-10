<template>
  <div class="site page-layout qui-fx-ver">
    <sub-form ref="addForm" @submit-form="addSubmitForm" :title="title" v-model="addFormStatus" :form-data="formData">
    </sub-form>
    <sub-form ref="editForm" @submit-form="editSubmitForm" :title="title" v-model="editFormStatus" :form-data="formData">
    </sub-form>
    <no-data msg="添加场地后，您可以开始管理场地范围。" v-if="siteList.length===0">
      <div slot="btn">
        <a-button type="primary" @click="addSite(0)"> <a-icon type="plus" />添加场地</a-button>
      </div>
    </no-data>
    <div class="qui-fx-ver" v-else>
      <div class="content qui-fx-jsa">
        <div class="mod">
          <div class="top qui-fx-jc">
            <img :src="siteImg" alt="">
            <span class="qui-fx-ac">场地管理</span>
          </div>
          <div class="list" :style="{height:height+'px'}">
            <ul>
              <li class="qui-fx-jc" v-for="(item,i) in siteList" :key="i" @click="clickSite(0,item)" :class="{active:choosedSite === item.id}">
                <span class="qui-te">{{ item.name }}</span>
                <span class="qui-te">{{ item.category | getSiteCategory() }}</span>
                <span class="qui-te">{{ item.personCount }}</span>
                <img :src="editImg" alt="" @click.stop="addSite(1,item)">
                <img :src="deleteImg" alt="" @click.stop="deleteList(item.id)">
              </li>
            </ul>
          </div>
          <div class="qui-fx-jc mar-b20">
            <a-button type="primary" @click="addSite(0)"> <a-icon type="plus" />添加场地</a-button>
          </div>
        </div>
        <div class="mod">
          <div class="top qui-fx-jc">
            <img :src="floorImg" alt="">
            <span class="qui-fx-ac">楼层管理</span>
          </div>
          <div class="list" :style="{height:height+'px'}">
            <no-data msg="暂无数据" v-if="floorList.length===0">
            </no-data>
            <ul v-else>
              <li class="qui-fx-jsa" v-for="(item,i) in floorList" :key="i" @click="clickSite(1,item)" :class="{active:choosedFloor === item.id}">
                <span class="qui-te">{{ item.name }}楼</span>
                <span class="qui-te">{{ item.category | getSiteCategory() }}</span>
                <span class="qui-te">{{ item.personCount }}</span>
                <img :src="editImg" alt="" @click.stop="addSite(3,item)">
                <img :src="deleteImg" alt="" @click.stop="deleteList(item.id)">
              </li>
            </ul>
          </div>
          <div class="qui-fx-jc mar-b20">
            <a-button type="primary" @click="addSite(2)"> <a-icon type="plus" />添加楼层</a-button>
          </div>
        </div>
        <div class="mod">
          <div class="top qui-fx-jc">
            <img :src="roomImg" alt="">
            <span class="qui-fx-ac">房间管理</span>
          </div>
          <div class="list" :style="{height:height+'px'}">
            <no-data msg="暂无数据" v-if="roomList.length===0">
            </no-data>
            <ul v-else>
              <li class="qui-fx-jsa" v-for="(item,i) in roomList" :key="i">
                <span class="qui-te">{{ item.name }}</span>
                <span class="qui-te">{{ item.category | getSiteCategory() }}</span>
                <span class="qui-te">{{ item.personCount }}</span>
                <img :src="editImg" alt="" @click.stop="addSite(5,item)">
                <img :src="deleteImg" alt="" @click.stop="deleteList(item.id)">
              </li>
            </ul>
          </div>
          <div class="qui-fx-jc mar-b20">
            <a-button type="primary" @click="addSite(4)"> <a-icon type="plus" />添加房间</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import siteImg from '../../assets/img/database/site/site.png'
import floorImg from '../../assets/img/database/site/floor.png'
import roomImg from '../../assets/img/database/site/room.png'
import editImg from '../../assets/img/database/site/edit.png'
import deleteImg from '../../assets/img/database/site/delete.png'
import { mapState, mapActions } from 'vuex'
import SubForm from '../components/SubForm'
import NoData from '@c/NoData'

const siteFormData = [
  {
    value: 'name',
    initValue: '',
    type: 'input',
    label: '场地名称',
    placeholder: '请输入场地名称'
  },
  {
    value: 'category',
    initValue: [],
    list: [
      {
        key: 100,
        val: '教室'
      },
      {
        key: 101,
        val: '宿舍'
      },
      {
        key: 102,
        val: '食堂'
      },
      {
        key: 103,
        val: '出入口'
      },
      {
        key: 104,
        val: '其它'
      }
    ],
    type: 'radio',
    label: '类型',
    placeholder: '请选择类型'
  },
  {
    value: 'personCount',
    initValue: '',
    type: 'number',
    required: false,
    label: '容纳人数',
    max: 99999,
    placeholder: '请输入容纳人数'
  }
]
const floorFormData = [
  {
    value: 'siteName',
    initValue: '',
    type: 'input',
    label: '场地名称',
    placeholder: '请输入场地名称',
    disabled: true
  },
  {
    value: 'category',
    initValue: [],
    list: [
      {
        key: 100,
        val: '教室'
      },
      {
        key: 101,
        val: '宿舍'
      },
      {
        key: 102,
        val: '食堂'
      },
      {
        key: 103,
        val: '出入口'
      },
      {
        key: 104,
        val: '其它'
      }
    ],
    type: 'radio',
    label: '类型',
    placeholder: '请选择类型',
    disabled: true
  },
  {
    value: 'name',
    initValue: '',
    type: 'number',
    label: '楼层名称',
    show: false,
    max: 999,
    placeholder: '请输入楼层名称'
  },
  {
    value: 'number',
    initValue: '',
    type: 'number',
    label: '楼层数量',
    show: false,
    max: 999,
    placeholder: '请输入楼层数量'
  },
  {
    value: 'personCount',
    initValue: '',
    type: 'number',
    required: false,
    label: '容纳人数',
    max: 99999,
    placeholder: '请输入容纳人数'
  }]
const roomFormData = [
  {
    value: 'siteName',
    initValue: '',
    type: 'input',
    label: '场地名称',
    placeholder: '请输入场地名称',
    disabled: true
  },
  {
    value: 'category',
    initValue: [],
    list: [
      {
        key: 100,
        val: '教室'
      },
      {
        key: 101,
        val: '宿舍'
      },
      {
        key: 102,
        val: '食堂'
      },
      {
        key: 103,
        val: '出入口'
      },
      {
        key: 104,
        val: '其它'
      }
    ],
    type: 'radio',
    label: '类型',
    placeholder: '请选择类型',
    disabled: true
  },
  {
    value: 'floorName',
    initValue: '',
    type: 'number',
    label: '楼层',
    max: 99,
    placeholder: '请输入楼层',
    disabled: true
  },
  {
    value: 'name',
    initValue: '',
    type: 'number',
    label: '房间号',
    max: 9999,
    show: false,
    placeholder: '请输入房间号'
  },
  {
    value: 'number',
    initValue: '',
    type: 'number',
    label: '房间数量',
    max: 99,
    show: false,
    placeholder: '请输入房间数量'
  },
  {
    value: 'personCount',
    initValue: '',
    type: 'number',
    required: false,
    max: 99999,
    label: '容纳人数',
    placeholder: '请输入容纳人数'
  }
]

export default {
  name: 'Site',
  components: {
    NoData,
    SubForm
  },
  data () {
    return {
      siteImg,
      floorImg,
      roomImg,
      editImg,
      deleteImg,
      height: 500,
      title: '添加场地',
      choosedSite: null,
      choosedFloor: null,
      addFormStatus: false,
      editFormStatus: false,
      siteFormData,
      floorFormData,
      roomFormData,
      formData: [],
      siteList: [],
      floorList: [],
      roomList: [],
      type: 1,
      siteId: '',
      siteName: '',
      siteKey: '',
      floorName: '',
      siteCode: '',
      siteRecord: null,
      floorRecord: null
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async mounted () {
    this.height = document.body.clientHeight - 275
    await this.showList()
    this.clickSite(0, this.siteList[0])
  },
  methods: {
    ...mapActions('home', [
      'getSiteList', 'addSiteManage', 'getSiteById', 'getChildSite', 'editSiteManage', 'deleteSite'
    ]),
    async showList () {
      const req = {
        name: '',
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSiteList(req)
      this.siteList = res.data
    },
    addSite (type, record) {
      if (type === 0) {
        this.addFormStatus = true
        this.title = '添加场地'
        this.type = 1
        this.formData = siteFormData
        this.formData[2].show = true
      } else if (type === 1) {
        this.editFormStatus = true
        this.title = '编辑场地'
        this.type = 1
        this.siteId = record.id
        this.siteCode = record.code
        this.formData = this.$tools.fillForm(siteFormData, record)
        this.formData[2].show = true
      } else if (type === 2) {
        if (this.siteList.length === 0) {
          this.$message.info('请先添加场地')
          return
        }
        this.addFormStatus = true
        this.title = '添加楼层'
        this.type = 2
        this.formData = floorFormData
        this.formData[3].show = true
        this.formData[2].show = false
        this.formData[4].show = true
        this.formData[0].initValue = this.siteName
        this.formData[1].initValue = this.siteKey
      } else if (type === 3) {
        this.editFormStatus = true
        this.title = '编辑楼层'
        this.type = 2
        this.siteId = record.id
        this.siteCode = record.code
        this.formData = this.$tools.fillForm(floorFormData, record)
        this.formData[3].show = false
        this.formData[2].show = true
        this.formData[4].show = true
        this.formData[0].initValue = this.siteName
        this.formData[1].initValue = this.siteKey
      } else if (type === 4) {
        if (this.floorList.length === 0) {
          this.$message.info('请先添加楼层')
          return
        }
        this.addFormStatus = true
        this.title = '添加房间'
        this.type = 3
        this.formData = roomFormData
        this.formData[4].show = true
        this.formData[3].show = false
        this.formData[0].initValue = this.siteName
        this.formData[1].initValue = this.siteKey
        this.formData[2].initValue = this.floorName
      } else if (type === 5) {
        this.editFormStatus = true
        this.title = '编辑房间'
        this.type = 3
        this.siteId = record.id
        this.siteCode = record.code
        this.formData = this.$tools.fillForm(roomFormData, record)
        this.formData[4].show = false
        this.formData[3].show = true
        this.formData[0].initValue = this.siteName
        this.formData[1].initValue = this.siteKey
        this.formData[2].initValue = this.floorName
      }
    },
    deleteList (value) {
      this.$tools.delTip('确定删除吗?', () => {
        this.deleteSite(value).then(res => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this.showList()
            this.clickSite(0, this.siteRecord)
          })
        })
      })
    },
    async clickSite (type, record) {
      if (!record) {
        return
      }
      const req = {
        parentId: record.id,
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getChildSite(req)
      if (type === 0) {
        this.siteRecord = record
        this.choosedSite = record.id
        this.siteKey = record.category
        this.siteName = record.name
        if (res.data.list.length === 0) {
          this.floorList = []
          this.roomList = []
          return
        }
        this.floorList = res.data.list
        if (this.floorRecord && this.floorRecord.parentId === record.id) {
          this.clickSite(1, this.floorRecord)
        } else {
          this.clickSite(1, this.floorList[0])
        }
      } else if (type === 1) {
        this.floorRecord = record
        this.floorName = record.name
        this.choosedFloor = record.id
        this.roomList = res.data.list
      }
    },
    addSubmitForm (values) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        ...values,
        type: this.type,
        parentId: this.type === 1 ? null : this.type === 2 ? this.choosedSite : this.choosedFloor
      }

      this.addSiteManage(req).then(res => {
        this.$message.success('添加成功')
        this.$tools.goNext(() => {
          this.showList()
          this.clickSite(0, this.siteRecord)
          this.$refs.addForm.reset()
        })
      }).catch(() => {
        this.$refs.addForm.error()
      })
    },
    editSubmitForm (values) {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        ...values,
        type: this.type,
        code: this.siteCode,
        id: this.siteId,
        parentId: this.type === 1 ? null : this.type === 2 ? this.choosedSite : this.choosedFloor
      }
      this.editSiteManage(req).then(res => {
        this.$message.success('编辑成功')
        this.$tools.goNext(() => {
          this.showList()
          this.clickSite(0, this.siteRecord)
          this.$refs.editForm.reset()
        })
      }).catch(() => {
        this.$refs.editForm.error()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.site{
    .content{
      background: #fff;
      padding:20px;
      .mod{
        width: 33.33%;
        border:1px solid #eceff4;
        border-right: none;
        height: 100%;
        .top{
            background: #9698d6;
            padding: 20px 0;
            img{
               width: 36px;
               height: 36px;
            }
            span{
              font-size: 16px;
              margin:0 20px;
              color:#fff;
            }
        }
        .list{
          margin: 20px 0;
          padding: 0 40px;
          overflow: auto;
          ul{
            li{
              font-size: 14px;
              padding: 18px 0;
              margin: 5px 0;
              span{
                padding: 0 10px;
                width: 33%;
                text-align: right
              }
              span:nth-child(3){
                margin-right: 20px;
              }
              img{
                visibility: hidden;
                width: 20px;
                height: 20px;
                margin:0 10px;
              }
            }
            li:hover,li.active{
              background: #efeffd;
              span{
                color:@main-color;
              }
              img{
                visibility: inherit;
                cursor: pointer;
              }
            }
          }
        }
      }
      .mod:last-child{
        border-right:1px solid #efeffd;
      }
    }
    .mar-b20{
      margin-bottom: 20px;
    }
}
</style>
