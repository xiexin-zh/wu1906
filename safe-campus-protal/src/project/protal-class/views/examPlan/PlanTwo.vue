<template>
  <div class="plan-two qui-fx-ver qui-fx-f1">
    <choose-place @submit="submitPlace" v-if="placeTag" v-model="placeTag"></choose-place>
    <div class="top-btn-group mar-l10" style="text-align: left" v-if="!isDetail">
      <a-button icon="plus" class="add-btn" @click="placeTag = true">选择场地</a-button>
    </div>
    <div class="qui-fx-f1 place-list" style="margin: 0 15px">
      <ul class="table-title qui-fx-ac">
        <li class="qui-fx-f1">考试场地</li>
        <li class="qui-fx-f1">考场名称</li>
        <li class="qui-fx-f1">考号范围</li>
        <li style="width: 120px">操作</li>
      </ul>
      <div>
        <ul class="table-body qui-fx-ac" v-for="(place, index) in placeList" :key="place.index">
          <li class="qui-fx-f1">{{ place.placeName }}</li>
          <li class="qui-fx-f1">
            <a-input
              :readonly="isDetail"
              style="width: 60%"
              placeholder="请输入考场名称"
              v-model="place.testRoomName"
            />
          </li>
          <li class="qui-fx-f1">
            <a-input-number :disabled="isDetail" v-model="place.startNumber" />
            <span style="padding: 0 4px">~</span>
            <a-input-number :disabled="isDetail" v-model="place.endNumber" />
          </li>
          <li style="width: 120px">
            <a-tag color="red" @click="delPlace(index)">删除</a-tag>
          </li>
        </ul>
      </div>
      <div v-if="!isDetail && placeList.length !== 0" style="margin-top: 30px; text-align: right">
        <a-button @click="submitPlan" type="primary">保存并进行下一步</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ChoosePlace from '@c/ChoosePlace'
export default {
  name: 'PlanTwo',
  props: {
    isDetail: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    ChoosePlace
  },
  data() {
    return {
      placeTag: false,
      placeList: []
    }
  },
  computed: {
    ...mapState('home', ['userInfo'])
  },
  mounted() {
    if (this.id) {
      this.showDetail()
    }
  },
  methods: {
    ...mapActions('home', ['savePlace', 'getPlaceById']),
    submitPlace(list) {
      const arr = list.map((item, index) => {
        return {
          index: item.roomId,
          placeName: `${item.placeName}${item.floorName}${item.roomName}`,
          placeId: `${item.placeId},${item.floorId},${item.roomId}`,
          id: '',
          startNumber: '',
          endNumber: '',
          testRoomName: `第${index + 1}考场`
        }
      })
      this.placeList = this.placeList.concat(arr)
      this.placeTag = false
    },
    delPlace(index) {
      this.placeList.splice(index, 1)
    },
    async showDetail() {
      const res = await this.getPlaceById(this.id)
      this.placeList = res.data.map(item => {
        return {
          ...item,
          index: item.placeId.split(',').pop()
        }
      })
    },
    async submitPlan() {
      const tag = this.placeList.some(item => {
        return !item.testRoomName || !item.startNumber || !item.endNumber
      })
      if (tag) {
        this.$message.warning('请录入完整信息')
        return
      }
      try {
        await this.savePlace({
          planId: this.id,
          roomDtoList: this.placeList,
          schoolCode: this.userInfo.schoolCode
        })
        this.$message.success('保存成功')
        this.$tools.goNext(() => {
          this.$emit('goNext', 2, this.id)
        })
      } catch (err) {}
    }
  }
}
</script>

<style lang="less" scoped>
.plan-two {
  text-align: center;
  ul,
  li {
    margin: 0;
  }
  .place-tree {
    width: 200px;
    max-height: 600px;
  }
  .place-list {
    li {
      height: 45px;
      line-height: 45px;
      border: 1px #f5f5f5 solid;
    }
  }
  .table-title {
    background-color: #eee;
  }
}
</style>
