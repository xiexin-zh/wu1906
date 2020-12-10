/* eslint-disable no-unreachable */
<template>
  <div class="reset-room">
    <div class="no-data" v-if="roomList.length === 0">
      暂无可调宿宿舍
    </div>
    <div class="room_list" v-for="(room, index) in roomList" :key="room.id" style="min-width: 220px; margin-left: 8px">
      <div class="room_list_title" style="height:35px;line-height:35px;">
        <div style="float: right; font-size: 18px; color: #999; font-weight: bold; margin-right: 10px;">
          {{ room.specifications }}
        </div>
        <div style="color: #6882da">
          <div
            @click="checkRoom(index)"
            :class="['room_check_icon', { room_check: currentIndex === index, room_nocheck: currentIndex !== index }]"
            style="top:8px"
          ></div>
          <span style="font-size: 18px; font-weight: bold;padding-left: 20px;">{{ room.roomName }}</span>
        </div>
      </div>
      <div class="room_list_person">
        <div
          class="room_person_button"
          style="margin-left: 12px"
          v-for="person in parseInt(room.specifications)"
          :key="person"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roomList: [],
      currentIndex: -1
    }
  },
  methods: {
    ...mapActions('roomManage', ['remainRoomSubmit']),
    checkRoom: function(index) {
      this.currentIndex = index
      this.$emit('input', this.roomList[index].roomCode)
    },
    showRoom: function(fId, bId) {
      this.currentIndex = -1
      var _this = this
      const params = {
        schoolCode: sessionStorage.getItem('schoolScheme'),
        buildingCode: bId,
        floorCode: fId
      }
      _this
        .remainRoomSubmit(params)
        .then(res => {
          _this.roomList = res.data
        })
        .catch(err => {
          _this.$message.error(err.message)
        })
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.no-data {
  padding: 20px;
  color: #333;
}
.room_list {
  width: 24%;
  float: left;
  padding-bottom: 10px;
  min-height: 220px;
  overflow-y: auto;
  background: #fff;
  border-radius: 5px;
  margin-right: 15px;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 10px 10px 15px #e8ecf3;
}

.room_list_title {
  color: #6882da;
  height: 52px;
  line-height: 52px;
  padding-left: 20px;
  border-bottom: 1px #e8e8e8 solid;
}

.room_person_button {
  cursor: pointer;
  color: #595959;
  font-size: 14px;
  width: 90px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  float: left;
  margin-left: 26px;
  background-color: #efefef;
  margin-top: 20px;
  border-radius: 3px;
}
.room_check_icon {
  cursor: pointer;
  width: 18px;
  height: 18px;
  position: absolute;
  left: 10px;
  top: 17px;
}

.room_check {
  background: url('../../assets/img/room_check.png') no-repeat;
  background-size: 18px 18px;
}

.room_nocheck {
  background: url('../../assets/img/room_nocheck.png') no-repeat;
  background-size: 18px 18px;
}
</style>
