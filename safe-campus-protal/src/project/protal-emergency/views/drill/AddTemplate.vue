<template>
  <div class="task-add page-layout qui-fx-ver">
    <div class="content pos-box bg-fff">
      <div class="u-padd-10 u-padd-l20 u-padd-t20">
        <a-row type="flex" class="u-mar-t20" >
          <a-col :span="5" >
          </a-col>
          <a-col :span="16" >
            <div class="stepBar u-fx">
              <div
                v-for="(item,index) in steps"
                :key="index"
                class="u-fx-ac-jc"
                :class="[ item.count === '1' ? 'step-fist' : item.count === '5' ? 'step-end' : 'step', { 'active': item.active }]"
                @click="isActive(item.count)">{{ item.name }}
              </div>
            </div>
          </a-col>
        </a-row>
        <info v-if="stepsActive === '1'" :id="id" ref="info"></info>
        <radio v-if="stepsActive === '2'" :id="id" ref="adio"></radio>
        <surve-video v-if="stepsActive === '3'" :id="id" ref="surve" ></surve-video>
        <route v-if="stepsActive === '4'" :id="id" ref="route" ></route>
        <equip v-if="stepsActive === '5'" :id="id" ref="equip" ></equip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddTemplate',
  components: {
    info: () => import('../../component/addTemplate/Info'),
    surveVideo: () => import('../../component/addTemplate/SurveVideo'),
    radio: () => import('../../component/addTemplate/Radio'),
    route: () => import('../../component/addTemplate/Route'),
    equip: () => import('../../component/addTemplate/Equip')
  },
  data() {
    return {
      id: '',
      stepsActive: '1',
      steps: [
        {
          name: '基本信息',
          active: true,
          count: '1',
          title: 'info'
        },
        {
          name: '应急广播',
          active: false,
          count: '2',
          title: 'adio'
        },
        {
          name: '监控视频',
          active: false,
          count: '3',
          title: 'surve'
        },
        {
          name: '疏散路线图',
          active: false,
          count: '4',
          title: 'route'
        },
        {
          name: '应急器材',
          active: false,
          count: '5',
          title: 'equip'
        }
      ]
    }
  },
  async mounted() {
    this.id = this.$route.query.id
  },
  methods: {
    isActive(count, id) {
      const index = this.stepsActive
      if (this.$refs[this.steps[parseInt(index) - 1].title]) {
        if (index === '1') {
          this.$refs.info.show = false
          const a = this.$refs.info.submitOk()
          if (!a) return
          this.$refs.info.save()
        } else {
          this.$refs[this.steps[parseInt(index) - 1].title].submitOk()
        }
      }
      this.stepsActive = count
      this.steps.forEach(element => {
        if (element.count === count) {
          element.active = true
        } else {
          element.active = false
        }
      })
    },
    previous() {
      this.stepsActive++
    }
  }
}
</script>
<style lang="less" scoped>
.task-add {
  background-color: #f5f5fb;
  .content {
    height: calc(100% - 10px);
    overflow-y: scroll;
    .input {
      width: 90%;
      border: 1px dashed #cfcfcf;
    }
   }
   .stepBar{
      .step-fist{
        width: 169px;
        height: 38px;
        background: url('../../assets/img/Tab1_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../assets/img/Tab1_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
      .step{
        width: 169px;
        height: 38px;
        background: url('../../assets/img/Tab2_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../assets/img/Tab2_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
      .step-end{
        width: 169px;
        height: 38px;
        background: url('../../assets/img/Tab3_weixuan.png') no-repeat ;
        background-size: 169px, 50px;
        &.active{
          color: #fff;
          background: url('../../assets/img/Tab3_xuanzhong.png') no-repeat ;
          background-size: 169px, 50px;
        }
      }
      div {
        cursor: pointer;
      }
   }
}
</style>
