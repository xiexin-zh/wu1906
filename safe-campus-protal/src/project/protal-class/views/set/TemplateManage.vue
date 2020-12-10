<template>
  <div class="page-layout qui-fx-ver">
    <bind-template
      isCheck
      ref="bindTemplate"
      v-if="bindTag"
      v-model="bindTag"
      @submit="_bindTemplate"
      @userToAll="userToAll"
      title="应用到指定设备"
      :templateName="templateName"
      :templateRemark="templateRemark"
      :deviceList="deviceList"
    ></bind-template>
    <div class="qui-fx-f1">
      <div class="box-scroll u-auto" :style="{height: scrollH - 80+ 'px'}">
        <div class="qui-fx qui-fx-wp">
          <div class="notice-card notice qui-fx-ac-jc">
            <div class="float-add-btn" @click="add(0)"></div>
            <div>添加</div>
          </div>
          <div class="notice-card qui-fx" v-for="item in templateList" :key="item.id" style="position: relative;">
            <div class="qui-fx-f1 qui-fx-ver qui-fx-jsb" >
              <div class="qui-te">
                <span class="title">{{ item.title }}</span>
                <a-popover>
                  <template slot="content">
                    {{ item.content }}
                  </template>
                  <span class="content">{{ item.content }}</span>
                </a-popover>
              </div>
              <!-- <div class="notice-img qui-fx-ac-jc" :style="{'backgroundImage': 'url('+item.photoUrl+')'}"> -->
              <div class="notice-img qui-fx-ac-jc">
                <a-popover placement="left">
                  <template slot="content">
                    <img :src="item.photoUrl" style="max-width: 900px; max-height: 660px; display: block; " alt />
                  </template>
                  <img
                    :src="item.photoUrl"
                    :style="{ width: `280px`, height: item.isDefault === 1 ? `230px` : `200px`, display: 'block', backgroundColor: '#eee' }"
                    alt
                  />
                </a-popover>
              </div>
              <div class="qui-fx-jsb qui-fx-ac" v-if="item.isDefault !== 1">
                <div @click.stop="useTemplate(item)">
                  <div class="disable" v-if="item.count === 0">未启用</div>
                  <div class="useNum" v-else>{{ item.count }}台设备使用中</div>
                </div>
                <div class="notice-action">
                  <a-dropdown>
                    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                      更多 <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a @click.stop="add(1, item)">编辑模板</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click.stop="_delTemplate(item)">删除模板</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click.stop="useTemplate(item)">应用到指定设备</a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BindTemplate from '../../component/BindTemplate'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TemplateManage',
  components: {
    BindTemplate
  },
  data() {
    return {
      templateList: [],
      scrollH: 0,
      bindTag: false,
      deviceList: [],
      templateRemark: '',
      templateName: ''
    }
  },
  computed: {
    ...mapState('home', [
      'userInfo'
    ])
  },
  mounted() {
    this.scrollH = document.documentElement.offsetHeight
    this._getTemplateList()
  },
  methods: {
    ...mapActions('home', ['getTemplateList', 'delTemplate', 'bindTemplateDetail', 'bindTemplate', 'bindAllTemplate']),
    async _getTemplateList () {
      const res = await this.getTemplateList({
        schoolCode: this.userInfo.schoolCode
      })
      this.templateList = res.data.map(el => {
        return {
          title: el.name,
          content: el.description,
          id: el.id,
          photoUrl: el.photoUrl,
          count: el.count,
          isDefault: el.isDefault
        }
      })
    },
    add(type, item) {
      let path = ''
      if (type && parseInt(item.isDefault) === 1) {
        this.$message.warning('默认模板不可编辑')
        return
      }
      path = `/templateManage/template?type=${type}${type ? '&id=' + item.id : ''}`
      this.$router.push({ path })
    },
    async useTemplate(item) {
      this.templateName = item.title
      this.templateRemark = item.content
      this.id = item.id
      const res = await this.bindTemplateDetail({ query: item.id })
      this.deviceList = res.data
      this.bindTag = true
    },
    async _bindTemplate(value) {
      console.log(value)
      this.deviceList = value
      const req = {
        deviceList: value,
        templateId: this.id
      }
      await this.bindTemplate(req)
      this.$message.success('绑定成功')
      this.$tools.goNext(() => {
        this.$refs.bindTemplate.reset()
        this._getTemplateList()
      })
    },
    async userToAll() {
      await this.bindAllTemplate({
        schoolCode: this.userInfo.schoolCode,
        templateId: this.id
      })
      this.$message.success('绑定成功')
      this.$tools.goNext(() => {
        this.$refs.bindTemplate.reset()
        this._getTemplateList()
      })
    },
    _delTemplate (item) {
      if (parseInt(item.isDefault) === 1) {
        this.$message.warning('默认模板不可删除')
        return
      }
      if (parseInt(item.count) !== 0) {
        this.$message.warning('模板使用，不可删除')
        return
      }
      this.$tools.delTip('确认要删除该模板吗?', () => {
        this.delTemplate(item.id).then(() => {
          this.$message.success('删除成功')
          this.$tools.goNext(() => {
            this._getTemplateList()
          })
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.notice-card {
    border-radius: 4px;
    background-color:#f5f5f5;
    padding: 10px;
    float: left;
    width: 23.33%;
    overflow: hidden;
    margin: 20px 0px 0px 20px;
    min-height: 200px;
    min-width: 300px;
    .title{
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
    .content{
      color: #666;
    }
    .useNum{
      color: @main-color;
    }
    .disable{
      color: #ccc;
    }
  }
  .notice{
    height: 296px;
  }
  .notice-img {
    margin: 15px 15px 15px 0;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .float-add-btn {
    width: 100px;
    height: 100px;
    background: url('../../assets/img/add-btn.png') no-repeat;
    background-size: 100%;
  }
</style>
