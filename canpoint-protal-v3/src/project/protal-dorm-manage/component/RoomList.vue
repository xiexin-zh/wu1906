<template>
  <div class="room u-fx-ver u-fx-f1 u-type-white-bg">
    <u-space class="u-fx-ac u-padd-l10 u-mar-10" :size="10" v-if="canEdit">
      <a-checkbox :checked="checkAll" :indeterminate="indeterminate" @change="chooseAll">全选</a-checkbox>
      <a-icon class="u-font-1 u-type-primary" type="info-circle" />
      <span>已选择 {{ chooseList.length }} 个房间</span>
      <u-button @click="batchAction(1)" :disabled="chooseList.length === 0" type="danger" delete content="确定批量删除这些房间吗？">批量删除</u-button>
      <u-button @click="batchAction(2)" :disabled="chooseList.length === 0" type="light">批量分配</u-button>
      <u-button @click="batchAction(3)" :disabled="chooseList.length === 0" type="light" delete content="确定将选中人员批量退宿吗？">批量退宿</u-button>
      <u-button @click="batchAction(4)" :disabled="chooseList.length === 0" type="light">宿舍对调</u-button>
    </u-space>
    <a-checkbox-group @change="changeChoose" v-model="chooseList">
      <a-radio-group v-model="chooseRoom" @change="changeChoose">
        <div class="card u-fx u-fx-wp u-scroll-y u-padd-l10" :style="{ maxHeight: maxHeight + 'px' }">
          <div
            class="room-list u-bd-1px u-shadow u-border-radius u-mar-10"
            v-for="(room, index) in roomList"
            :key="room.id"
            @mousemove.stop="currentRoom = index"
            @mouseleave.stop="currentRoom = -1"
          >
            <div class="head u-padd-10 u-bd-b u-fx-jsb">
              <u-space class="u-fx-ac" :size="10">
                <a-checkbox :value="room.id" v-if="isCheck"></a-checkbox>
                <a-radio :value="room.id" v-else-if="isRadio"></a-radio>
                <img class="room-img" :src="roomImg" alt="" />
                <span class="u-type-primary u-font-2">{{ room.roomName }}</span>
              </u-space>
              <u-space :size="10" v-if="canEdit && currentRoom === index" class="u-font-2">
                <a-icon @click="roomAction(1, room)" type="edit" />
                <a-icon @click="roomAction(2, room)" type="delete" />
              </u-space>
            </div>
            <div class="name-list u-fx u-fx-wp u-scroll-y u-mar-l10 u-mar-t10 u-mar-b10">
              <u-tag
                pointer
                v-for="student in room.personList"
                :key="student.userCode"
                :class="[
                  { 'u-type-primary-light-bg u-type-primary': realCheckTag && student.state === 1 },
                  { 'u-type-error-light-bg u-type-error': realCheckTag && student.state === 0 },
                  'u-border-radius'
                ]"
              >
                <student-card
                  v-if="canEdit || realCheckTag"
                  :student="student"
                  :roomCode="room.roomCode"
                  ref="studentCard"
                  :canEdit="canEdit"
                  :realCheckTag="realCheckTag && student.state === 0"
                  @studentAction="studentAction">
                  <div slot="button">{{ student.userName }}</div>
                </student-card>
                <span v-else>{{ student.userName }}</span>
              </u-tag>
              <u-tag
                pointer
                v-for="empty in room.emptyNum"
                :key="empty"
                class="u-border-radius"
              >
              </u-tag>
            </div>
          </div>
          <div v-if="canEdit" class="room-list u-shadow u-border-radius u-mar-10">
            <div class="add u-bd-1px u-fx-ac-jc u-type-info" @click="roomAction(0)">+</div>
          </div>
        </div>
      </a-radio-group>
    </a-checkbox-group>
  </div>
</template>

<script>
import roomImg from '../assets/img/room.png'
import StudentCard from './StudentCard.vue'
export default {
  name: 'RoomList',
  components: { StudentCard },
  props: {
    // 是否可编辑
    canEdit: {
      type: Boolean,
      default: false
    },
    // 实时查寝补卡
    realCheckTag: {
      type: Boolean,
      default: false
    },
    // 房间列表
    roomList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否为单选
    isRadio: {
      type: Boolean,
      default: false
    },
    // 是否为多选
    isCheck: {
      type: Boolean,
      default: false
    },
    // 最大高度
    maxHeight: {
      type: Number,
      default: document.body.clientHeight - 210
    }
  },
  data() {
    return {
      roomImg,
      currentRoom: -1,
      chooseList: [],
      chooseRoom: '',
      checkAll: false,
      indeterminate: false
    }
  },
  methods: {
    // 全选
    chooseAll(e) {
      Object.assign(this, {
        chooseList: e.target.checked ? this.roomList.map(ele => ele.id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.$emit('chooseRoom', this.chooseList)
    },
    // 选中房间
    changeChoose(checkedList) {
      if (this.isCheck) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.roomList.length
        this.checkAll = checkedList.length === this.roomList.length
        this.$emit('chooseRoom', checkedList)
      } else if (this.isRadio) {
        const index = this.roomList.findIndex(item => item.id === this.chooseRoom)
        this.$emit('chooseRoom', this.roomList[index])
      }
    },
    /**
     * 房间操作
     * @param { type } Number 操作类型： 0.新增 1.编辑 2.删除
     * @param { item } Object 操作对象
     */
    roomAction(type, item) {
      this.$emit('roomAction', type, item)
    },
    /**
     * 房间批量操作
     * @param { type } Number 操作类型： 1.批量删除 2.批量分配 3.批量退宿 4.宿舍对调
     */
    batchAction(type) {
      this.$emit('batchAction', type, this.chooseList)
    },
    // 选中学生
    chooseStudent(name) {},
    /**
     * 学生操作
     * @param { type } Number 操作类型： 0.退宿 1.调宿 2.补卡
     * @param { item } Object 操作对象
     */
    studentAction(type, item) {
      this.$emit('studentAction', type, item)
    }
  }
}
</script>

<style lang="less" scoped>
.room {
  .room-list {
    width: calc(20% - 20px);
    min-width: 200px;
    height: 178px;
    position: relative;
    .head {
      width: 100%;
      .room-img{
        width:16px;
        height: 16px;
        margin-top: -3px;
      }
    }
    .name-list {
      max-height: 116px;
    }
    /deep/ .ant-tag {
      margin: 3px 5px 5px 5px;
      padding: 5px 10px;
      min-width: 50px;
      min-height: 30px;
    }
    .add {
      min-height: 120px;
      font-size: 64px;
      font-weight: 100;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      cursor: pointer;
    }
  }
}
  /**滚动条样式**/
/deep/ ::-webkit-scrollbar {
  width: 1px;
}

/*定义滑块 内阴影+圆角*/
/deep/ ::-webkit-scrollbar-thumb {
  background-color: #f5f5f5;
}
</style>
