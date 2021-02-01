<template>
	<view>
    <no-data v-if="!Object.keys(detailInfo).length"  class="u-mar-l20 u-mar-r20 u-mar-t20"  msg="暂无数据"></no-data>
		<scroll-view v-else scroll-y="true" class="scroll-h" >
      <view class="wentiList u-mar-b20 u-padd-l10 u-padd-r10 u-padd-t10 u-type-white-bg"  v-for="(list, i) in detailInfo" :key="i">
          <u-row class=" u-main-color  u-padd-t10">
            <u-col span="12" >
              {{i+1}}.{{ list.content }}
            </u-col>
          </u-row>
          <u-radio-group :disabled="true"  v-model="list.selected" class='u-wh'>
            <u-cell-group shape="circle" class='u-wh' :border='false'>
              <u-radio shape="circle"  class="u-padd-15 u-bd-b" 
              v-for="(element,index) in list.answer" :key='index'	 :name="element.option">
                {{element.option}}
              </u-radio>
            </u-cell-group>
          </u-radio-group>
			</view>
		</scroll-view>
  </view>
</template>
<script>
import eventBus from '@u/eventBus'
import { store, actions } from './store/index.js'
export default {
  components: {
  },
  data () {
    this.id = this.$tools.getQuery().get('id')
    return {
      detailInfo:{},
    }
  },
  async mounted () {
    this.showDetail()
  },
  methods: {
    async showDetail() {
       const req = {
        id: this.id,
        schoolCode: store.userInfo.schoolCode,
        source: '3',
        userName: store.userInfo.userName
      }
      const res = await actions.classroomInfo(req)
      this.detailInfo = res.data.exercisesList.map(el=>{
        return {
          ...el,
          selected:el.answer.find(v=>v.selected).option
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 0rpx);
  padding-top: 0px;
}
</style>
