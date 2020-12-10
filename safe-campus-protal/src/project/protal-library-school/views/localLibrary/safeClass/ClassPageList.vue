<template>
  <div class="danger-detail page-layout bg-fff qui-fx-ver">
    <div class="content pos-box">
      <a-form-model class="u-padd-b20" layout="inline" :form="form">
        <a-form-model-item label="适用学段" >
          <a-select
            allowClear
            @change="changeSections"
            style="width: 200px;"
            v-model="form.section"
            placeholder="请选择适用学段">
            <a-select-option :value="1">幼儿园</a-select-option>
            <a-select-option :value="2">小学低年级</a-select-option>
            <a-select-option :value="4">小学高年级</a-select-option>
            <a-select-option :value="8">初中</a-select-option>
            <a-select-option :value="16">高中</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资源类型" >
          <a-select
            allowClear
            @change="value => changeCategoryId(1,value)"
            style="width: 200px;"
            v-model="form.firstId"
            placeholder="请选择资源类型">
            <!-- <a-select-option value="">全部</a-select-option> -->
            <a-select-option
              v-for="(item,index) in firstData"
              :value="item.id"
              :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资源类别" >
          <a-select
            allowClear
            @change="value => changeCategoryId(2,value)"
            style="width: 200px;"
            v-model="form.secondId"
            placeholder="请选择资源类型">
            <a-select-option value="">全部</a-select-option>
            <a-select-option
              v-for="(item,index) in secondData"
              :value="item.id"
              :key="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="" >
          <!-- <a-button @click="reset" type="primary">重置</a-button> -->
          <a-button @click="cancel" type="primary">返回</a-button>
        </a-form-model-item>
      </a-form-model>
      <div class="detail-info u-fx-wp">
        <div
          class="u-mar-b10 u-mar-l10"
          v-for="(i,index) in detailInfo"
          :key="index">
          <a-card hoverable style="width: 300px;">
            <img
              style="height: 180px;"
              slot="cover"
              alt="example"
              :src="i.thumbnailUrl"
            />
            <a-card-meta :title="i.name">
              <template slot="description">
                <div class="u-font-01">
                  课程类型：{{ i.classType }}&nbsp;&nbsp;&nbsp;适用学段：{{ i.section }}
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div v-if="morePage" class="u-fx-ac-jc u-mar-t20">
        <a-button @click="seeMore" type="primary">查看更多</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'ClassPageList',
  components: {
  },
  data() {
    return {
      form: {
        section: undefined,
        firstId: undefined,
        secondId: undefined
      },
      options: [], // 资源树
      firstData: [],
      secondData: [],
      detailInfo: [],
      cardInfo: {
        taskType: '1',
        thumbnailUrl: []
      },
      pageList: {
        page: 1,
        size: 9
      },
      morePage: false
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  async created() {
    await this._firstCategory()
    this.form.section = this.$route.query.section ? Number(this.$route.query.section) : undefined
    this.form.firstId = this.$route.query.firstId ? Number(this.$route.query.firstId) : undefined
    if (this.firstId) {
      // 选择了一级firstId拿二级数据
      await this._secondCategory(this.firstId)
    } else {
      // 没有选择那所有的二级数据
      await this._treeView()
    }
    this.form.secondId = this.$route.query.secondId ? Number(this.$route.query.secondId) : undefined
    this.categoryId = this.form.secondId || this.form.firstId || ''
    this.showDetail()
  },
  async mounted() {
  },
  methods: {
    ...mapActions('home', ['treeView', 'claroomPublicList', 'secondCategory', 'firstCategory']),
    moment,
    // 资源类型获取一级分类
    async _firstCategory() {
      const res = await this.firstCategory()
      this.firstData = res.data
    },
    // 资源类型加载二级分类
    async _secondCategory(id) {
      const res = await this.secondCategory(id)
      this.secondData = res.data
    },
    // 获取资源树
    async _treeView() {
      const res = await this.treeView()
      this.secondData = res.data.map(v => v.children).flat().map(el => {
        return {
          ...el,
          name: el.categoryName
        }
      })
    },
    changeCategoryId(type, id) {
      // 改变一级分类联动二级
      if (type === 1) {
        if (id) {
          this._secondCategory(id)
        } else {
        // 一级分类为置空的时候,赋值所有的二级
          this._treeView()
        }
        this.form.secondId = undefined
        this.form.firstId = id
        this.categoryId = id
      } else {
        // 不选择一级，直接选择二级
        if (id) {
          this.categoryId = id
        } else {
          // 二级全部的时候
          this.categoryId = this.form.firstId
        }
      }
      this.showDetail()
    },
    changeSections(value) {
      this.section = value
      this.showDetail()
    },
    async showDetail(tag = false) {
      if (tag) {
        this.pageList.page += 1
      } else {
        this.pageList.page = 1
      }
      const req = {
        ...this.pageList,
        name: '',
        categoryId: this.categoryId,
        section: this.form.section
      }
      const res = await this.claroomPublicList(req)
      if (tag) {
        this.detailInfo = this.detailInfo.concat(res.data.records)
      } else {
        this.detailInfo = res.data.records
      }
      this.total = res.data.total
      this.morePage = res.data.pages > res.data.current
    },
    // 查看更多
    seeMore() {
      this.showDetail(true)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
.danger-detail {
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
       @{deep} .ant-card-body{
        padding: 15px;
      }
    }
  }
}
</style>
