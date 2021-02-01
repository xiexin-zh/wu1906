<template>
  <view>
		<no-data msg = '此功能班主任和宿管才能查看~' v-if="isShow"></no-data>
    <component :is="currentCom" :dept-code="deptCode" v-if="deptCode"></component>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import RealCheckS from './RealCheckS'
import RealCheckT from './RealCheckT'
import { store } from '../store/index.js';
export default {
  name: 'RealCheck',
  data () {
    return {
      currentCom: '',
      deptCode:'',
			isShow: false
    }
  },
  created () {
    // 优先展示宿管角色
    this.$tools.isDormMamage(store.userInfo).then(res => {
      if (res) {
        this.deptCode = res.buildingCode
        this.currentCom = RealCheckS
      } else {
        this.$tools.isBZR(store.userInfo).then(res => {
          if (res) {
            this.deptCode = res[0].classCode
            this.currentCom = RealCheckT
          } else {
            this.isShow = true
          }
        })
      }
    })
    // this.$tools.isBZR(store.userInfo, res => {
    //    console.log('res',res)
		// 	if (res) {
		// 	  this.deptCode = res[0].classCode
		// 	  this.currentCom = RealCheckT
		// 	} else {
		// 		this.$tools.isDormMamage(store.userInfo).then(res => {
		// 			if (res) {
		// 	      this.deptCode = res.buildingCode
		// 				this.currentCom = RealCheckS
		// 			} else {
		// 				this.isShow = true
		// 			}
		// 	  })
		// 	}
		// })
  }
}
</script>
