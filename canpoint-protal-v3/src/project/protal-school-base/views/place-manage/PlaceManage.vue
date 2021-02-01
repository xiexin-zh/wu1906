<template>
  <div class="place-manage page-layout u-fx" @click="quitChoosed">
    <div class="left u-fx-ver u-mar-r20 u-type-white-bg">
      <u-space direction="vertical">
        <div class="layout-padd u-type-white-bg">
          <u-search-form :search-label="searchLabel" @search="search">
            <div slot="left">
              <u-button icon="plus" @click="placeAction(0)" type="primary">添加场地</u-button>
            </div>
          </u-search-form>
        </div>
      </u-space>
      <u-empty class="u-w100" v-if="noDataTag" style="padding-top: 100px" description="暂无场地信息~~">
        <u-button type="light" icon="plus" @click="placeAction(0)">添加场地</u-button>
      </u-empty>
      <div v-if="placeList.length > 0" class="u-fx u-fx-f1 u-scroll-y">
        <a-collapse class="u-w100" accordion v-model="activePlaceKey" @change="tabChange">
          <a-collapse-panel v-for="place in placeList" :key="place.placeCode">
            <template slot="header">
              <div class="u-fx-jsb">
                <div class="u-fx-ac">
                  <div class="header u-mar-r10 u-type-white u-font-1 u-fx-ac-jc">
                    <span>{{ getDataState('placeType', place.category) }}</span>
                  </div>
                  <span class="u-font-1 u-bold">{{ place.placeName }}</span>
                </div>
                <u-space>
                  <u-button type="link" @click="placeAction(1, place)">编辑</u-button>
                  <u-button type="link" @click="placeAction(2, null, place)">添加楼层</u-button>
                  <u-button type="link" delete @click="deletePlace(place)">删除</u-button>
                </u-space>
              </div>
            </template>
            <a-collapse
              class="u-w100 u-type-white-bg"
              accordion
              :bordered="false"
              v-model="activeFloorKey"
              @change="floorChange($event, place.children)"
            >
              <template #expandIcon="props">
                <a-icon
                  :style="{ fontSize: '14px', color: '#2889FC' }"
                  theme="filled"
                  :type="props.isActive ? 'minus-square' : 'plus-square'"
                />
              </template>
              <div class="no-data u-fx-ac-jc u-mar-20 u-w100" v-if="place.children.length === 0">
                <img :src="NoDataImg" alt="" />
                <span class="u-fx-01 u-type-primary-light">暂无下级场地，点击右上角添加按钮添加楼层、房间~</span>
              </div>
              <a-collapse-panel v-else v-for="floor in place.children" :key="floor.placeCode">
                <template slot="header">
                  <div class="u-fx-ac">
                    <div class="u-mar-r10 u-type-primary u-font-1 u-bold">
                      <span>{{ floor.placeName }}F</span>
                    </div>
                    <u-button
                      v-if="floor.active"
                      type="danger"
                      size="small"
                      delete
                      @click="deletePlace(floor)"
                    >删除</u-button
                    >
                  </div>
                </template>
                <div class="room-ul u-fx u-fx-wp u-mar-l30">
                  <div
                    class="room-list u-fx-ac-jc u-border-radius u-bd-1px u-mar-10 u-padd-10 u-type-info-light-bg u-shadow"
                    @click="placeAction(3, null, floor)"
                  >
                    <a-icon :style="{ fontSize: '16px' }" type="plus" />
                  </div>
                  <div
                    :class="[
                      room.active ? 'u-type-primary-light-bg' : 'u-type-white-bg',
                      'room-list u-fx-ac-jc u-border-radius u-shadow u-bd-1px u-mar-10 u-padd-10'
                    ]"
                    v-for="(room, index) in floor.children"
                    :key="room.placeCode"
                    @click.stop="roomAction(index, floor.children)"
                  >
                    <img :src="HouseImg" alt="" />
                    <span>{{ room.placeName }}</span>
                    <div
                      class="mosk u-type-white-bg u-shadow u-fx-ac-jc u-padd-l10 u-padd-r10 u-border-radius"
                      v-if="room.active"
                    >
                      <u-button type="link" size="small" icon="edit" @click="placeAction(4, room)">编辑</u-button>
                      <u-button
                        type="link"
                        size="small"
                        icon="delete"
                        delete
                        @click="delPlace(room.id, true)"
                      >删除</u-button
                      >
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <u-submit-form
        ref="form"
        :title="formTitle"
        :formData="subFormData"
        v-model="formStatus"
        v-if="formStatus"
        @submit="submit"
      />
    </div>
    <div class="right u-type-white-bg u-padd-20">
      <div class="tip u-mar-b20 u-fx-ac">
        <a-icon class="u-mar-r10 u-type-primary u-font-2" type="info-circle" />
        <span class="u-font-1 u-bold">小提示：</span>
      </div>
      <u-space direction="vertical">
        <p>1.支持添加场地类型包括教室、宿舍、食堂、出入口、会议室、其他；</p>
        <p>2.支持添加场地的层级包括一级（场地）、二级（场地+楼层）、三级（场地+楼层+房间）；</p>
        <p>3.点击右上角“添加场地”，场地添加后点击“添加楼层”“添加房间”逐级完善场地信息；</p>
        <p>
          4.场地添加后，可用于班级管理绑定教室、业务系统绑定场地等等应用场景，全平台需使用的场地信息在此处统一管理。
        </p>
      </u-space>
    </div>
  </div>
</template>

<script>
import { getDataState } from '@u/libs/data-state'
import NoDataImg from '../../assets/img/place_nodata.png'
import HouseImg from '../../assets/img/place_house.png'
import searchLabel from '../../search-columns/place'
import formData from '../../submit-columns/place'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PlaceManage',
  components: {},
  computed: {
    ...mapState('home', ['schoolCode'])
  },
  data() {
    return {
      getDataState,
      NoDataImg,
      HouseImg,
      noDataTag: false,
      searchLabel,
      formData,
      formTitle: '',
      formStatus: false,
      subFormData: [],
      activePlaceKey: '',
      activeFloorKey: '',
      placeList: [],
      roomList: []
    }
  },
  mounted() {
    this._getPlaceList()
  },
  methods: {
    ...mapActions('home', ['getPlaceList', 'addPlace', 'addFloorOrRoom', 'editPlaceInfo', 'delPlaceApi']),
    // 按场地类型搜索场地列表
    search(value) {
      if (value.category) {
        this.placeList = this.allPlaceList.filter((item) => item.category === value.category)
      } else {
        this.placeList = this.allPlaceList
      }
      this.noDataTag = this.placeList.length === 0
      if (this.placeList.length === 0) return
      this.activePlaceKey = this.placeList[0].placeCode
      if (this.placeList[0].children.length > 0) this.activeFloorKey = this.placeList[0].children[0].placeCode
    },
    /**
     * 获取场地列表
     * @param { tag } Boolean 重置手风琴默认选中第一项数据，为true时不重置
     */
    async _getPlaceList(tag = false) {
      const res = await this.getPlaceList({ schoolCode: this.schoolCode })
      if (!res.data || res.data.length === 0) {
        this.noDataTag = true
        this.allPlaceList = []
        this.placeList = []
        return
      }
      this.noDataTag = false
      this.allPlaceList = res.data
      this.placeList = res.data
      if (tag) {
        if (this.isRoomTag) {
          this.$set(
            res.data[res.data.findIndex((ele) => ele.placeCode === this.activePlaceKey)].children.filter(
              (item) => item.placeCode === this.activeFloorKey
            )[0],
            'active',
            true
          )
        }
      } else {
        this.activePlaceKey = res.data[0].placeCode
        if (res.data[0].children.length > 0) {
          this.activeFloorKey = res.data[0].children[0].placeCode
          this.$set(res.data[0].children[0], 'active', true)
        }
      }
    },
    // 切换场地面板
    tabChange(value) {
      this.activePlaceKey = value
      const index = this.placeList.findIndex((item) => item.placeCode === value)
      if (index === -1) return
      if (this.placeList[index].children.length > 0) {
        this.activeFloorKey = this.placeList[index].children[0].placeCode
        this.$set(this.placeList[index].children[0], 'active', true)
      }
    },
    // 切换楼层面板
    floorChange(value, floorList) {
      this.activeFloorKey = value
      const index = floorList.findIndex((item) => item.placeCode === value)
      if (index === -1) return
      floorList.map((el) => {
        this.$set(el, 'active', false)
      })
      this.$set(floorList[index], 'active', true)
    },
    /**
     * 场地操作逻辑
     * @param { type } Number 操作类型：  0.添加场地  1.编辑场地   2.添加楼层  3.添加房间  4.编辑房间
     * @param { record } Object 操作场地信息
     * @param { pRecord } Object 操作场地父级菜单信息
     */
    placeAction(type, record, pRecord) {
      this.actionType = type
      if (type === 0) {
        // 添加场地
        this.formTitle = '添加场地'
        this.subFormData = formData.placeFormData
        this.actions = 'addPlace'
        this.recordId = ''
        this.parentCode = ''
      } else if (type === 1) {
        // 编辑场地
        this.formTitle = '编辑场地'
        this.subFormData = this.$tools.fillForm(formData.placeFormData, record)
        this.recordId = record.id
        this.parentCode = ''
        this.actions = 'editPlaceInfo'
      } else if (type === 2) {
        // 添加楼层
        console.log(pRecord)
        this.parentCode = pRecord.placeCode
        this.recordId = ''
        this.formTitle = '添加楼层'
        this.subFormData = formData.floorFormData
        this.actions = 'addFloorOrRoom'
      } else if (type === 3) {
        // 添加房间
        console.log(pRecord)
        this.parentCode = pRecord.placeCode
        this.recordId = ''
        this.formTitle = '添加房间'
        this.subFormData = formData.roomFormData
        this.actions = 'addFloorOrRoom'
        this.isRoomTag = true
      } else if (type === 4) {
        // 编辑房间
        this.formTitle = '编辑房间'
        this.subFormData = this.$tools.fillForm(formData.editRoomFormData, record)
        this.recordId = record.id
        this.parentCode = ''
        this.actions = 'editPlaceInfo'
        this.isRoomTag = true
      }
      this.formStatus = true
    },
    // 场地表单提交
    async submit(value) {
      const req = {
        ...value,
        schoolCode: this.schoolCode,
        type: this.actionType === 0 || this.actionType === 1 ? 1 : this.actionType === 2 ? 2 : 3
      }
      if (this.recordId) req.id = this.recordId
      if (this.parentCode) req.parentCode = this.parentCode
      try {
        await this[this.actions](req)
        this.$tools.message('success', `${this.actionType === 1 || this.actionType === 4 ? '编辑' : '添加'}成功`)
        this.$refs.form.reset()
        this.$tools.goNext(() => {
          this._getPlaceList(true)
        })
      } catch (err) {
        this.$refs.form.error()
      }
    },
    /**
     * 删除场地逻辑操作
     * 删除时先对场地有无下级场地进行判断提示，没有则直接删除
     * @param { record } Object 场地信息
     */
    deletePlace(record) {
      if (record.children && record.children.length > 0) {
        this.$confirm({
          content: '该场地存在下级场地，删除后下级场地一并删除，确定删除吗 ？',
          onOk: () => {
            this.delPlace(record.id)
          }
        })
      } else {
        this.delPlace(record.id)
      }
    },
    /**
     * 删除场地提交操作
     * @param { id } Number 场地id
     * @param { tag } Boolean 删除房间为true
     */
    async delPlace(id, tag = false) {
      this.isRoomTag = tag
      await this.delPlaceApi({ id })
      this.$tools.message('success', '删除成功')
      this.$tools.goNext(() => this._getPlaceList(true))
    },
    // 打开房间操作菜单
    roomAction(index, roomList) {
      this.roomList = roomList
      roomList.map((el) => {
        this.$set(el, 'active', false)
      })
      this.$set(roomList[index], 'active', true)
    },
    // 关闭房间操作菜单
    quitChoosed() {
      this.roomList.map((el) => {
        el.active = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.left {
  width: calc(100% - 420px);
  min-width: 500px;
}
.right {
  width: 400px;
  background: url(../../assets/img/place_bg.png) no-repeat center bottom;
  background-origin: content-box;
  background-size: 250px 230px;
  p {
    letter-spacing: 2px;
  }
}
.u-w100 {
  width: 100%;
}
.header {
  width: 65px;
  height: 33px;
  text-indent: 8px;
  background: url(../../assets/img/place_title.png) no-repeat;
  background-size: 65px 33px;
}
.no-data {
  img {
    width: 120px;
    height: 120px;
  }
}
.room-list {
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: relative;
  img {
    width: 16px;
    height: 16px;
    margin: 5px 0;
  }
  .mosk {
    position: absolute;
    left: 40px;
    top: 25px;
    z-index: 99;
  }
}
</style>
