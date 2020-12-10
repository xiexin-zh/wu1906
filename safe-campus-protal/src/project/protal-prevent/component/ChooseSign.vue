<template>
  <a-modal
    width="1250px"
    title="选择警示标识"
    v-model="status"
    @ok="submitOk"
    :maskClosable="false"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
  >
    <a-tabs default-active-key="0">
      <a-tab-pane :tab="tab.val" v-for="tab in tabList" :key="tab.key">
        <div class="qui-fx-wp" v-if="allSignList[tab.key]">
          <div class="img-box u-mar-r10 u-mar-b10" v-for="(list,index) in allSignList[tab.key].signList" :key="index" @click="choose(list)">
            <img :src="list.url" alt="">
            <div :class="['check-box', list.check ? 'check' : 'no-check']"></div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ChooseSign',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapState('home', ['schoolCode']),
    status: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  data() {
    return {
      confirmLoading: false,
      chooseList: [],
      pageList: {
        page: 1,
        size: 20
      },
      searchList: {},
      riskContent: '',
      total: 0,
      identifyList: [],
      totalList: [],
      categoryCode: '',
      searchText: {},
      plainOptions: {},
      tabList: [
        {
          val: '警告类',
          key: '0'
        },
        {
          val: '禁止类',
          key: '1'
        },
        {
          val: '指令类',
          key: '2'
        },
        {
          val: '提示类',
          key: '3'
        }
      ],
      checkedList: [],
      signList: [],
      allSignList: []
    }
  },
  async mounted() {
    this._riskAssessAsign()
  },
  methods: {
    ...mapActions('home', ['riskAssessAsign']),
    async _riskAssessAsign () {
      const res = await this.riskAssessAsign()
      // this.allSignList = res.data
      // this.signList = res.data[0].signList.map(el => {
      //   return {
      //     url: el,
      //     check: false
      //   }
      // })
      this.allSignList = res.data.map(el => {
        return {
          signList: el.signList.map(el => {
            return {
              url: el,
              check: false
            }
          })
        }
      })
    },
    choose(list) {
      list.check = !list.check
    },
    reset() {
      this.confirmLoading = false
      this.$emit('input', false)
    },
    submitOk() {
      const arr = []
      this.allSignList.forEach(el => {
        el.signList.forEach(item => {
          if (item.check) {
            arr.push(item)
          }
        })
      })
      console.log('arr', arr)
      if (arr.length === 0) {
        this.$message.warning('请选择警示标识')
        return
      }
      this.confirmLoading = true
      this.$emit('submit', arr)
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  position: relative;
  img {
    width: 110px;
    height: 130px;
  }
  .check-box {
    position: absolute;
    top: 1px;
    right: 3px;
    height: 18px;
    width: 18px;
  }
  .check{
    background: url(../assets/img/check.png);
  }
  .no-check{
    background: url(../assets/img/nocheck.png);
  }
}

</style>
