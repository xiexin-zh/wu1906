<template>
  <div class="class-up page-layout u-fx-ver">
    <div class="top u-fx u-mar-b20 u-border-radius">
      <div class="tip u-mar-r10 u-fx-ac">
        <a-icon class="u-mar-r10 u-type-primary u-font-1" type="info-circle" />
        <h3>请注意</h3>
      </div>
      <div>
        <p>1. 该功能用于升学年后一键将上一学年所有班级升年级，每个学段最后一个年级升级后为“毕业”。</p>
        <p>2. 升级后，新班级的学生、班主任信息不变，仅年级加一。</p>
        <p>3. 如果目标学年已经存在同名班级，则升级不会成功。</p>
      </div>
    </div>
    <div class="u-fx-ver u-fx-f1 u-border-radius u-type-white-bg">
      <div class="content u-fx-jsa" :style="{ minHeight: minHeight + 'px' }">
        <div class="before u-shadow">
          <div class="banner u-mar-b20"></div>
          <div class="u-fx-jc u-mar-b20">
            <a-select v-model="beforeDefaultYear" @change="yearChange" class="select">
              <a-select-option v-for="item in beforeYearList" :key="item.code" :value="item.code">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="grade u-fx-jc">
            <div class="grade-list u-scroll-y" :style="{ maxHeight: maxHeight + 'px' }">
              <div
                class="u-fx-ac-jc u-mar-l10 u-mar-r10 u-padd-t10 u-padd-b10 u-bd-b"
                v-for="grade in gradeList"
                :key="grade.id"
              >
                {{ grade.gradeName }}
              </div>
            </div>
          </div>
        </div>
        <div class="after u-shadow">
          <div class="banner u-mar-b20"></div>
          <div class="u-fx-jc u-mar-b20">
            <a-select :value="afterDefaultYear" disabled class="select"> </a-select>
          </div>
          <div class="grade u-fx-jc">
            <div class="grade-list u-scroll-y" :style="{ maxHeight: maxHeight + 'px' }">
              <div
                class="u-fx-ac-jc u-mar-l10 u-mar-r10 u-padd-t10 u-padd-b10 u-bd-b"
                v-for="grade in afterGradeList"
                :key="grade.id"
              >
                {{ grade.gradeName }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sure u-fx-jc">
        <u-button type="primary" size="large" @click="sureUp">确认升级</u-button>
      </div>
    </div>
    <a-modal v-model="showTag" centered closable width="320px" footer="">
      <div class="info u-fx-ver u-fx-ac-jc">
        <img class="u-padd-t20" :src="upokImg" alt="" />
        <span class="u-font-1 u-mar-t20 u-type-primary">升级成功</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import baseData from '@u/libs/base-data'
import upokImg from '../../assets/img/upok.png'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ClassUp',
  components: {},
  data() {
    return {
      upokImg,
      showTag: false,
      minHeight: document.body.clientHeight - 330,
      maxHeight: document.body.clientHeight - 600,
      beforeDefaultYear: '',
      afterDefaultYear: '',
      beforeYearList: [],
      beforeYearCode: '',
      afterYearCode: '',
      schoolYearId: '',
      gradeList: [],
      afterGradeList: []
    }
  },
  watch: {
    beforeDefaultYear(val) {
      this.afterDefaultYear =
        Number(val.split('学年')[0].split('-')[0]) + 1 + '-' + (Number(val.split('学年')[0].split('-')[1]) + 1) + '学年'
    }
  },
  computed: {
    ...mapState('home', ['schoolYear', 'schoolCode'])
  },
  async created() {
    if (!this.schoolYear.code) {
      const schoolYear = await baseData.getUsingSchoolYear(this.schoolCode, () => {
        this.$router.push('/schoolYear')
      })
      if (!schoolYear) return
    }
    this._getOldSchoolYearList()
  },
  methods: {
    ...mapActions('home', ['getGradeClassList', 'getOldSchoolYearList', 'upgrade']),
    // 获取历史学年列表
    async _getOldSchoolYearList() {
      const res = await this.getOldSchoolYearList({ schoolCode: this.schoolCode })
      this.beforeYearList = res.data.list
      this.beforeDefaultYear = res.data.enableSchoolYear.name
      this.beforeYearCode = res.data.enableSchoolYear.code
      this._getGradeList(this.beforeYearCode)
    },
    // 获取学年年级列表
    async _getGradeList(schoolYearCode) {
      const res = await this.getGradeClassList({
        schoolCode: this.schoolCode,
        schoolYearCode
      })
      this.gradeList = res.data
      this.afterGradeList = res.data.map((item, index) => {
        if (index + 1 < res.data.length) {
          return { gradeName: res.data[index + 1].gradeName }
        } else {
          return { gradeName: '毕业' }
        }
      })
    },
    // 切换学年
    yearChange(value, selected) {
      console.log(value)
      this.beforeYearCode = value
      const index = this.beforeYearList.findIndex((list) => list.code === value)
      this.beforeDefaultYear = this.beforeYearList[index].name
      this._getGradeList(value)
    },
    // 升级
    async sureUp() {
      await this.upgrade({
        schoolCode: this.schoolCode,
        oldSchoolYearCode: this.beforeYearCode
      })
      this.$message.success(`升级成功`)
      this.$tools.goNext(() => {
        this.showTag = true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.class-up {
  .top {
    height: 120px;
    background: #fff url(../../assets/img/classup_bg.png) no-repeat;
    background-size: 100% 120px;
    padding: 20px 0 20px 50px;
    .tip,
    .tip h3 {
      height: 21px;
      line-height: 25px;
    }
  }
  .content {
    padding: 40px;
    .before,
    .after {
      width: 400px;
      .banner {
        height: 120px;
      }
      .grade-list {
        width: 100%;
      }
    }
    .before .banner {
      background: #fff url(../../assets/img/classup_before.png) no-repeat;
      background-size: 100% 120px;
    }
    .after .banner {
      background: #fff url(../../assets/img/classup_later.png) no-repeat;
      background-size: 100% 120px;
    }
    .select {
      width: calc(100% - 40px);
    }
  }
}
</style>
