<template>
  <div class="preview-class page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form class="u-padd-b20" layout="inline" :form="form" >
        <a-form-item label="适用学段" >
          <a-select
            @change="changeSections"
            style="width: 200px;"
            v-decorator="[
              'section',
            ]"
            placeholder="请选择适用学段">
            <a-select-option :value="1">幼儿园</a-select-option>
            <a-select-option :value="2">小学低年级</a-select-option>
            <a-select-option :value="4">小学高年级</a-select-option>
            <a-select-option :value="8">初中</a-select-option>
            <a-select-option :value="16">高中</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="资源类型" >
          <a-select
            @change="value => changeCategoryId(1,value)"
            style="width: 200px;"
            v-decorator="[
              'firstId',
              ,
            ]"
            placeholder="请选择资源类型">
            <a-select-option
              v-for="(item,index) in firstData"
              :value="item.id"
              :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="资源类别" >
          <a-select
            @change="value => changeCategoryId(2,value)"
            style="width: 200px;"
            v-decorator="[
              'secondId',
              ,
            ]"
            placeholder="请选择资源类型">
            <a-select-option
              v-for="(item,index) in secondData"
              :value="item.id"
              :key="index">{{ item.categoryName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="detail-info">
        <div class="img-box">
          <img :src="detailInfo.thumbnailUrl" alt="">
        </div>
        <div class="cont-box ">
          <div class="top">
            <div class="title u-font-2 u-main-color u-bold ">{{ detailInfo.name }}</div>
            <div class="cont">
              <div class="tip u-tips-color u-mar-t20">课程类型：{{ detailInfo.classType }}</div>
              <div class="tip u-tips-color u-mar-b20">适用学段：{{ detailInfo.section }}</div>
              <div class="des u-mar-b40">简介：{{ detailInfo.des }}</div>
            </div>
          </div>
          <div class="btn">
            <a-button type="primary" @click="activeKey='1'" >开始上课</a-button>
            <a-button class="u-mar-l20" @click="activeKey='2'">课后习题</a-button>
          </div>
        </div>
      </div>
      <div class="detail-deal">
        <div class="detail-title">
          <a-tabs v-model="activeKey" class="a-tab" >
            <a-tab-pane key="1" tab="安全课堂">
              <div class="cont-box u-mar-b20 u-padd-40" v-for="(item,index) in detailInfo.planList" :key="index" >
                <a-row :gutter="[50, 30]" type="flex" justify="center">
                  <a-col :span="15">
                    <a-carousel arrows>
                      <div slot="prevArrow" class="custom-slick-arrow" style="left: -50px;zIndex: 1">
                        <img src="../../assets/img/icon_left.png" alt="">
                      </div>
                      <div slot="nextArrow" class="custom-slick-arrow" style="right: -50px;zIndex: 10">
                        <img src="../../assets/img/icon_right.png" alt="">
                      </div>
                      <div v-for="(url, count) in item.pictures" :key="count">
                        <img style="" :src="url" alt="" />
                      </div>
                    </a-carousel>
                  </a-col>
                </a-row>
                <a-row :gutter="[50, 30]" type="flex" justify="center">
                  <a-col :span="20">
                    <div class="name  u-mar-b10">课程名称：{{ item.name }}</div>
                    <div class="cont" v-html="item.content"></div>
                  </a-col>
                </a-row>
                <a-divider />
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="课后习题" force-render>
              <div class="cont-box u-padd-40 u-padd-b20">
                <a-row
                  v-for="(item,index) in detailInfo.exercisesList"
                  :key="index"
                  :gutter="[10,10]"
                  type="flex"
                  justify="start" >
                  <a-col :span="10">
                    <div class="title">{{ index+1 }}、{{ item.content }}。【{{ item.topicType }}】({{ item.fraction }}分)</div>
                  </a-col>
                  <a-col :span="24" >
                    <div class="u-padd-l20 u-padd-b20">
                      <a-radio-group
                        @change="value => changeAnswer(value, item.answer)"
                        :disabled="false"
                        :options="item.answer"
                      />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="相关资源" force-render>
              <div class="resource-box  u-padd-40 u-padd-b20">
                <a-row
                  :gutter="[10,10]"
                  type="flex">
                  <a-col
                    v-for="(item,index) in detailInfo.resourceList"
                    :key="index"
                    :span="24">
                    <div class="comt u-bg-color u-padd-10 u-fx-jsb">
                      <div class="left u-padd-l10">
                        <div class="name u-main-color">{{ item.name }}</div>
                        <div class="size u-font-01 u-tips-color">{{ item.docSize | dosizeformat }}</div>
                      </div>
                      <div class="rigth u-fx u-padd-r10">
                        <div class="see_icon u-mar-r10 u-fx-ver">查看
                          <a-icon v-if="item.docType==='docx'||item.docType==='doc'||item.docType==='xlsx'||item.docType==='xls'||item.docType==='zip'" type="eye-invisible" />
                          <a-icon v-else type="eye" @click="down(0,item.resourceUrl)" />
                        </div>
                        <div class="down_icon u-fx-ver" @click="downloadFile(item.resourceUrl)">下载
                          <a-icon type="download" />
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Tools from '@u/tools'
import moment from 'moment'
export default {
  name: 'PreviewClass',
  components: {
  },
  data() {
    return {
      options: [], // 资源树
      firstData: [],
      secondData: [],
      activeKey: '1',
      form: this.$form.createForm(this, { name: 'horizontal_login' }),
      detailInfo: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    this._firstCategory()
    this._treeView()
    this.detailId = this.$route.query.id
    if (this.detailId) {
      this.showDetail()
    }
  },
  async  mounted() {
  },
  methods: {
    ...mapActions('home', ['treeView', 'classroomInfo', 'secondCategory', 'firstCategory']),
    moment,
    // 资源类型获取一级分类
    async _firstCategory() {
      const res = await this.firstCategory()
      this.firstData = res.data
    },
    // 资源类型加载二级分类
    // async _secondCategory(selectedOptions) {
    //   const res = await this.secondCategory()
    //   this.secondData = res.data
    // },
    // 获取资源树赋值二级分类
    async _treeView() {
      const res = await this.treeView()
      this.options = res.data
      this.secondData = res.data.map(v => v.children).flat()
    },
    changeSections(value) {
      this.$router.push({
        path: '/safeClassBout/classPageList',
        query: {
          section: value || ''
        }
      })
    },
    changeCategoryId(type, id) {
      const firstId = type === 1 ? id : this.secondData.find(v => v.id === id).parentId
      const secondId = type === 2 ? id : ''
      this.$router.push({
        path: '/safeClassBout/classPageList',
        query: {
          firstId: firstId,
          secondId: secondId
        }
      })
    },
    async showDetail() {
      const req = {
        id: this.detailId,
        schoolCode: this.userInfo.schoolCode,
        source: '3',
        userName: this.userInfo.userName
      }
      const res = await this.classroomInfo(req)
      this.detailInfo = res.data
      // answer每一项增加value  answer平级增加选中的选项value(index)
      this.detailInfo.exercisesList = this.detailInfo.exercisesList.map(el => {
        return {
          ...el,
          answer: el.answer.map((v, index) => {
            // if (v.selected) {
            //   el.chenck = index
            // }
            return {
              value: index,
              label: v.option,
              selected: v.selected
            }
          })
        }
      })
    },
    // 课后习题答题
    changeAnswer(value, item) {
      const checkValue = value.target.value
      if (item.find(v => v.value === checkValue).selected) {
        this.$message.success('答案正确')
      } else {
        this.$message.error('答案错误')
      }
    },
    downloadFile(url) {
      Tools.downloadFile(url)
    },
    // 下载查看
    down(type, url) {
      var a = document.createElement('a')
      a.id = 'expertFile'
      a.href = url
      document.body.append(a)
      a.click()
      document.getElementById('expertFile').remove()
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.preview-class {
  background-color: #f0f2f5;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .detail-info {
      margin-top: 10px;
      padding: 20px;
      min-height: 300px;
      overflow-y: scroll;
      background-color: #fff;
      display: flex;
      .ant-card{
      }
      .img-box{
        width: 500px;
        height: 300px;
        img{
          width:100%;
          height: 100%;
        }
      }
      .cont-box{
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        width: 100%;
        padding-left: 20px;
      }
    }

    .detail-deal {
      margin-top: 20px;
      padding: 20px 0;
      background-color: #fff;
      .resource-box{
        background-color: #fff;
      }
    }
  }
}
//轮播图样式
.ant-carousel{
    @{deep} .slick-track{
      display: flex!important;
      justify-content: center!important;
      align-items: center!important;

    }
    @{deep} .slick-slide {
      display: flex;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    img {
      max-width: 100%;
      height: auto;
    }
  }
  @{deep} .custom-slick-arrow {
    // width: 25px;
    // height: 25px;
    // font-size: 25px;
    // color: #fff;
    // background-color: rgba(31, 45, 61, 0.11);
    // opacity: 0.5;
  }
  @{deep} .custom-slick-arrow:before {
    display: none;
  }
  @{deep} .custom-slick-arrow:hover {
    opacity: 0.5;
  }
  @{deep} .slick-slide h3 {
    color: #fff;
  }
}
</style>
