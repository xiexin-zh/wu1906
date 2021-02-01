<template>
  <view>
    <component :is="currentCom"></component>
  </view>
</template>

<script>
import { store, actions } from '../store/index.js';
import AbnormalTotalP from './AbnormalTotalP'
import AbnormalTotalT from './AbnormalTotalT'
export default {
  name: 'AbnormalTotal',
  data () {
    return {
      currentCom: ''
    }
  },
  created () {
    if (store.userInfo.typeCode === '16') {
      this.currentCom = AbnormalTotalP
    } else if (store.userInfo.typeCode === '4') {
      this.currentCom = AbnormalTotalT
    } else {
      this.currentCom = AbnormalTotalT
    }
  }
}
</script>
