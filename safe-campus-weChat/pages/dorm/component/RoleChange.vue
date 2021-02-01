<template>
  <view class="role-change">
    <van-popup v-model="roleTag" style="border-radius: 8px; width: 70%">
      <view class="role-list">
        <view @click="chooseRole(role)" :class="[{'u-bd-b': index !== roleList.length - 1}, 'u-fx-ac']" v-for="(role, index) in roleList" :key="role.code">
          <view class="role-img">
            <img v-if="role.code === 'BZR'" :src="laoshi" alt>
            <img v-else-if="role.code === 'SG'" :src="suguan" alt>
            <img v-else-if="role.code === '4'" :src="jiazhang" alt>
            <img v-else :src="laoshi" alt>
          </view>
          <view>
            <p class="role-name"> {{ role.name }}</p>
          </view>
        </view>
      </view>
    </van-popup>
    <view class="u-fx u-fx-ac u-fx-jsb set-info div-shadow">
      <view class="set-name">当前角色：{{ userInfo.typeName }}</view>
      <view class="add-icon-btn" @click="changeRole" v-if="roleList.length !== 0">切换</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Dialog } from 'vant'
import laoshi from '../assets/img/laoshi_fang.png'
import jiazhang from '../assets/img/jiazhang_fang.png'
import suguan from '../assets/img/suguan_fang.png'
import hostEnv from '@config'
export default {
  name: 'RoleChange',
  data () {
    return {
      laoshi,
      jiazhang,
      suguan,
      roleTag: false,
      autoList: [],
      hostEnv
    }
  },
  computed: {
    ...mapState('home', [
      'openId',
      'roleInfo',
      'userInfo'
    ]),
    roleList () {
      return this.autoList.filter(item => {
        return item.code !== this.userInfo.typeCode
      })
    }
  },
  mounted () {
    this.getTypeList(this.userInfo.mobile).then(res => {
      this.autoList = res.data
    })
  },
  methods: {
    ...mapMutations('home', [
      'setData'
    ]),
    ...mapActions('bind', [
      'addLogInfo',
      'getTypeList',
      'judgeIsRegister'
    ]),
    // 切换角色
    changeRole () {
      this.roleTag = true
    },
    // 未绑定跳转
    toBind (msg, path) {
      Dialog.alert({
        title: '温馨提示',
        message: `您还未绑定任何${msg}, 请前往绑定`
      }).then(() => {
        this.$router.push(`/${path}`)
      })
    },
    // 选择角色
    chooseRole (item) {
      this.addLogInfo({
        openid: this.openId,
        statusCode: item.code,
        statusName: item.name,
        userCode: this.userInfo.userCode,
        userName: this.userInfo.userName
      }).then(() => {
        this.judgeIsRegister(this.openId).then(res => {
          // 存储用户信息
          let data = res.data
          let userInfo = {
            userName: data.userName,
            sex: data.gender || '',
            openId: data.openid,
            schoolName: data.schoolName,
            schoolScheme: data.schoolCode,
            typeCode: data.currentType.typeCode,
            typeName: data.currentType.typeName,
            photoSrc: data.photoUrl || '',
            userCode: data.userCode,
            mobile: data.mobile
          }
          // 存储角色绑定信息
          let deptType = ''
          if (data.currentType.typeCode === 'BZR') {
            deptType = 1
            if (!data.currentBindItem) {
              this.toBind('班级', 'set')
              return
            }
          } else if (data.currentType.typeCode === 'SG') {
            deptType = 2
            if (!data.currentBindItem) {
              this.toBind('宿舍', 'set')
              return
            }
          } else if (data.currentType.typeCode === '4') {
            deptType = 3
            if (!data.currentBindItem) {
              this.toBind('学生', 'parentBind')
              return
            }
          }
          let roleInfo = {
            deptType,
            deptCode: data.currentBindItem ? data.currentBindItem[0].itemCode : '',
            deptName: data.currentBindItem ? data.currentBindItem[0].itemName : '',
            schoolCode: data.schoolCode,
            schoolName: data.schoolName
          }
          this.setData({
            key: 'userInfo',
            data: userInfo
          })
          this.setData({
            key: 'roleInfo',
            data: roleInfo
          })
          if (data.currentType.typeCode === '4') {
            this.$router.replace('/parent')
          } else {
            this.$router.replace('/')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.set-name {
  color:#3d7eff;
  font-weight: bold
}
.role-list {
  border-radius: 10px;
  padding: 30px;
  .role-img {
    width: 120px;
    height: 120px;
    margin: 20px;
    img {
      width: 100%;
      height: 100%;
      display: block
    }
  }
  .role-name {
    font-size: 38px;
    margin-left: 20px;
    color:#666
  }
}
</style>
