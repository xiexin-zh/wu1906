<template>
  <div class="class-up qui-fx-ver">
    <a-modal v-model="showTag" centered :closable="false" width="320px" footer="">
      <div class="info qui-fx-ver qui-fx-ac-jc" v-if="upSuccess">
        <img :src="upokImg" alt="">
        <span class="ok">升级成功</span>
        <a-button type="primary" style="width:80px" @click="upDone">完成</a-button>
      </div>
      <div class="info qui-fx-ver qui-fx-ac-jc" v-else>
        <img :src="errImg" alt="">
        <span class="ok">升级失败</span>
        <span class="err">请选择升级班级</span>
        <a-button type="primary" style="width:80px" @click="showTag=false">知道了</a-button>
      </div>
    </a-modal>
    <div class="qui-fx">
      <div class="left" :style="{ height: minHeight + 'px'}">
        <div class="content qui-fx-jsa" :style="{ minHeight: minHeight + 'px'}">
          <div class="before">
            <div class="top">
              <img :src="beforeImg" alt="">
            </div>
            <div class="grade qui-fx-ver">
              <div class="qui-fx-jc mar-b10">
                <span class="qui-fx-ac">学年:</span>
                <a-select v-model="beforeDefaultYear" style="width: 200px" @change="yearChange">
                  <a-select-option v-for="item in beforeYearList" :key="item.id" :value="item.schoolYear">
                    {{ item.schoolYear }}学年
                  </a-select-option>
                </a-select>
              </div>
              <div class="class qui-fx-jc">
                <div class="class-list" :style="{ maxHeight: maxHeight + 'px'}">
                  <a-directory-tree
                    multiple
                    :treeData="treeData"
                    :defaultExpandAll="true"
                  >
                  </a-directory-tree>
                </div>
              </div>
            </div>
          </div>
          <div class="go qui-fx-ac-jc">
            <img :src="goImg" alt="">
          </div>
          <div class="after">
            <div class="top">
              <img :src="afterImg" alt="">
            </div>
            <div class="grade qui-fx-ver">
              <div class="qui-fx-jc mar-b10">
                <span class="qui-fx-ac">学年:</span>
                <a-select :value="afterDefaultYear" style="width: 200px" disabled>
                </a-select>
              </div>
              <div class="class qui-fx-jc">
                <div class="class-list" :style="{ maxHeight: maxHeight + 'px'}">
                  <a-directory-tree
                    multiple
                    :treeData="afterTreeData"
                    :defaultExpandAll="defaultExpandAll"
                  >
                  </a-directory-tree>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sure qui-fx-jc">
          <a-button type="primary" size="large" @click="affirm">确认升级</a-button>
        </div>
      </div>
      <div class="right" :style="{ height: minHeight + 'px'}">
        <div class="tips" :style="{ height: (minHeight-20) + 'px'}">
          <div class="text">
            <p>
              1、该功能用于一键升级整个学年学生，如一年级升入二年级，其中会保留学生、班主任的基本信息。
            </p>
            <p>
              2、生成的新班级名称默认同名，用户后期也可以自行在班级管理模块中修改。
            </p>
            <p>
              3、如果目标学年已经存在同名班级，则升级不会成功，需要用户自行在班级管理模块中删除班级信息或者删除所有班级学生信息。
            </p>
            <p>
              4、本功能仅支持以学年为单位升级，不能用于班级单个升级。
            </p>
            <p>
              5、每个学段最后一个年级升级后为“毕业”。
            </p>
            <p class="sign">
              6、每个学年只能升级一次。
            </p>
            <p>
              7、升级后班级教室场地关联自动解绑。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import beforeImg from '../../assets/img/database/classUp/before.png'
import afterImg from '../../assets/img/database/classUp/after.png'
import errImg from '../../assets/img/database/classUp/err.png'
import goImg from '../../assets/img/database/classUp/go.png'
import upokImg from '../../assets/img/database/classUp/upok.png'
import TipsImg from '../../assets/img/database/classUp/tips.png'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ClassUp',
  components: {
  },
  data () {
    return {
      beforeImg,
      afterImg,
      errImg,
      goImg,
      upokImg,
      TipsImg,
      minHeight: 500,
      maxHeight: 400,
      showTag: false,
      beforeDefaultYear: '',
      afterDefaultYear: '',
      beforeYearList: [],
      beforeYearCode: '',
      afterYearCode: '',
      schoolYearId: '',
      treeData: [],
      afterTreeData: [],
      defaultExpandAll: false,
      upSuccess: null
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  created () {
    this.minHeight = document.body.clientHeight - 200
    this.maxHeight = document.body.clientHeight - 550
    this.getSchoolYearList()
  },
  async mounted () {

  },
  methods: {
    ...mapActions('home', [
      'getSchoolYear', 'getGradeList', 'getClassList', 'upClass'
    ]),
    async getSchoolYearList () {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getSchoolYear(req)
      if (res.data.list.length === 0) return
      this.beforeYearList = res.data.list.filter(item => {
        return item.semester === '下学期'
      })
      if (res.data.list[0].semester === '上学期') {
        this.beforeYearList.unshift({
          id: res.data.list[0].id,
          semester: res.data.list[0].semester,
          schoolYear: res.data.list[0].schoolYear
        })
      }
      console.log(this.beforeYearList)
      this.beforeDefaultYear = this.beforeYearList[0].schoolYear
      this.beforeYearCode = this.beforeDefaultYear
      this.afterYearCode = (Number(this.beforeYearCode.split('-')[0]) + 1) + '-' + (Number(this.beforeYearCode.split('-')[1]) + 1)
      this.schoolYearId = this.beforeYearList[0].id
      this.beforeDefaultYear = this.beforeYearCode + '学年'
      this.afterDefaultYear = this.afterYearCode + '学年'
      this.$nextTick(() => {
        this.getGrade(this.schoolYearId)
      })
    },
    async getGrade (schoolYearId) {
      const req = {
        schoolCode: this.userInfo.schoolCode
      }
      const res = await this.getGradeList(req)
      this.treeData = res.data.list
        .map(item => {
          return {
            key: item.code,
            title: item.name,
            children: []
          }
        })
      this.treeData.forEach(ele => {
        const req = {
          schoolCode: this.userInfo.schoolCode,
          schoolYearId,
          gradeCode: ele.key
        }
        this.getClassList(req).then(res => {
          ele.children = res.data.list.map(item => {
            return {
              title: item.className,
              key: item.classCode,
              isLeaf: true
            }
          })
        })
      })
      this.defaultExpandAll = true
      this.treeData = [...this.treeData]
      this.afterTreeData = this.treeData.map(o => Object.assign({}, o))
      this.afterTreeData.forEach((ele, index) => {
        if (index + 1 < this.afterTreeData.length) {
          this.afterTreeData[index].title = this.afterTreeData[index + 1].title
        } else {
          this.afterTreeData[index].title = '毕业'
        }
      })
      this.afterTreeData.forEach(ele => {
        if (ele.title === '毕业') {
          return
        }
        const req = {
          schoolCode: this.userInfo.schoolCode,
          schoolYearId,
          gradeCode: ele.key
        }
        this.getClassList(req).then(res => {
          ele.children = res.data.list.map(item => {
            return {
              title: item.className,
              key: item.classCode,
              isLeaf: true
            }
          })
        })
      })
      this.$nextTick(() => {
        this.afterTreeData = [...this.afterTreeData]
        console.log(this.treeData)
        console.log(this.afterTreeData)
      })
    },
    yearChange (value, selected) {
      this.beforeYearCode = value
      this.schoolYearId = selected.data.key
      this.afterYearCode = (Number(value.split('-')[0]) + 1) + '-' + (Number(value.split('-')[1]) + 1)
      this.afterDefaultYear = (Number(value.split('-')[0]) + 1) + '-' + (Number(value.split('-')[1]) + 1) + '学年'
      this.getGrade(this.schoolYearId)
      console.log(this.schoolYearId)
    },
    affirm () {
      const req = {
        schoolCode: this.userInfo.schoolCode,
        schoolId: this.userInfo.schoolId,
        oldSchoolYear: this.beforeYearCode,
        newSchoolYear: this.afterYearCode
      }
      this.upClass(req).then(res => {
        this.$tools.goNext(() => {
          this.upSuccess = true
          this.showTag = true
        })
      }).catch(() => {
        this.upSuccess = false
      })
    },
    upDone () {
      this.showTag = false
    }
  }
}
</script>
<style lang="less" scoped>
.class-up{
  .left{
    width: 70%;
    background: #fff;
  }
  .right{
    width: calc(30% - 20px);
    background: #fff;
    margin: 0 0 0 20px;
    padding: 0 20px;
    .tips{
      background: url('../../assets/img/database/classUp/tips.png') no-repeat;
      background-size: 100% 100%;
      .text{
        padding: 160px 30px 0 50px;
        .sign{
          color:@main-color;
        }
      }
    }
  }
  .content{
    padding:40px;
    .before,.after{
      width: 40%;
      max-width: 550px;
      min-width: 300px;
      border:1px solid #ddd;
      box-shadow: 1px 2px 6px 0px #e8e8e8;
    }
    .top{
      margin-bottom: 20px;
      img{
        width: 100%;
      }
    }
    .grade{
      span{
        margin-right: 20px;
      }
      .class{
        border-top:1px dashed #ddd;
        margin:20px 40px 10px 40px;
        padding: 20px;
        .class-list{
          width: 200px;
          overflow-x: auto;
          padding-right: 20px;
        }
      }
    }
  }
  .sure{
    margin-top: 20px;
  }
}
  .info{
    span{
      margin:20px 0;
      font-size: 18px;
      text-align: center;
    }
    span.ok{
      color:#6882da
    }
    span.err{
      font-size: 14px;
      margin-top:-10px;
      color:#e81515
    }
  }
  /deep/ .ant-tree.ant-tree-directory > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper:before,/deep/ .ant-tree.ant-tree-directory .ant-tree-child-tree > li.ant-tree-treenode-selected > span.ant-tree-node-content-wrapper:before{
    background: @main-color
  }
</style>
