<template>
	<view>
    <multiple-select
      v-model="show"
      :data="arealist"
      :default-selected="defaultSelected"
      @confirm="confirm"
    ></multiple-select>
    <u-picker v-model="dateShow" mode="time" :params="params" :start-year="startYear" @confirm="changeTime"></u-picker>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx-ac u-bd-b item-list">
				<view>任务类型：</view>
				<view class="u-fx-f1 u-fx-je">
					<u-subsection
            :disabled="!!code"
            class="subsection"
            :height='50' 
            :font-size='22'
            @change="changeType"
            active-color="#2979ff"
            :list="list" 
            mode="subsection"
					 :current="current"></u-subsection>
				</view>
			</view>
      <view class="u-fx-ac u-bd-b item-list" v-if="code">
				<view>任务类型：</view>
				<view class="u-fx-f1 u-fx-je">
					{{formData.taskType === '1' ? '一次性任务' : '周任务'}}
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>任务名称：</view>
				<view class="u-fx-f1 u-fx-je">
					<input class="item-input u-tx-r" :disabled="!!code" v-model="formData.name" placeholder="请输入任务名称" />
				</view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>作息分类：</view>
				<view class="u-fx-f1 u-fx-je ">
					<picker
            :disabled="!!code"
				    :value="formData.workSert" :range="restList" @change="changeData($event,'workSert')">
						{{restList[formData.workSert]}}
					</picker>
				</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>音频资源：</view>
				<view class="u-fx-f1 u-fx-je ">
					<picker :value="formData.audio" :range="radiolist"
					  @change="changeData($event,'audio')">
						{{radiolist[formData.audio]}}
					</picker>
				</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-ac u-bd-b item-list">
				<view>播放区域：</view>
        <view class="u-fx-f1 u-fx-je" @click="choose(0)">
          {{formData.selectItem||'请选择'}}
				</view> 
				<view class="rit-icon"></view>
			</view> 
			<view class="u-fx-ac u-bd-b item-list">
				<view>启动日期：</view>
				<view class="u-fx-f1 u-fx-je" @click="choose(1)">
          {{formData.startDate}}
				</view>
				<view class="rit-icon"></view>
			</view>
      <view class="u-fx-ac u-bd-b item-list">
				<view>启动时间：</view>
				<view class="u-fx-f1 u-fx-je" @click="choose(2)">
          {{formData.startTime}}
				</view>
				<view class="rit-icon"></view>
			</view>
			<view  class="u-fx-ac u-bd-b item-list">
				<view>任务终止时间：</view>
				<view class="u-fx-f1 u-fx-je" @click="choose(3)">
					{{formData.endDate}}
				</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-jc u-bd-b item-list" v-if="formData.taskType === 1 || (formData.taskType === '2' && !!code)">
				<view>任务时间：</view>
				<duty-list class="u-fx-f1" @change="getWeek" ref="duty" :code="!!code"></duty-list>
			</view>
		</scroll-view>
		<view class="footer-btn u-fx-ac u-bg-color">
			<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r u-type-primary-dark-bg" @click="submitForm">
				提交
			</u-button>
		</view>
	</view>
</template>      
<script>
  import multipleSelect from "./component/multipleSelect";
	import eventBus from '@u/eventBus'
	import validateForm from '@u/validate';
	import dutyList from './component/dutyList.vue'
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	import {
		store,
		actions
	} from './store/index.js'
	import hostEnv from '../../config/index.js';
	const yzForm = {
		name: '请输入任务名称'
	}
	export default {
		components: {
			anUploadImg,
      dutyList,
      multipleSelect
		},
		data() {
			return {
        list: [],
				restList: [],
				radiolist: [],
				arealist: [],
				taskWeek:[],
				//图片上传
				formData: {
          name: "",
          startTime: '',
          startDate: '',
          endDate: '', //选择时间区间
          workSert: 0,
          audio: 0,
          taskType: 0
        },
        show: false,
        defaultSelected: [],
        selectItem: '',
        dateShow: false,
        params: {},
        startYear: new Date().getFullYear(),
        type: 0,
        restInfo: [],
        radioInfo: [],
        current: 0,
        code: ''
			}
		},
	  async created() {
      this.code = this.$route.query.code
      this.list = this.code ? [{name: '启用'},{name: '禁用'}] : [{name: '一次任务'},{name: '周任务'}]
      this.formData.startDate = this.$tools.getDateTime(new Date(), 'date')
      this.formData.startTime = this.$tools.getDateTime(new Date(), 'second')
      this.formData.endDate = this.$tools.getDateTime(new Date(), 'date')
      this._getRestByCode()
      this._getRadioSource()
      this._getRadioArea()
      if(this.code) {
        this._getRadioTaskDetail()
      }
		},
		methods: {
      // 广播详情
      async _getRadioTaskDetail() {
        const res = await actions.getRadioTaskDetail(this.code)
        this.formData = res.data
        this.restInfo.forEach((el, index) => {
          if(el.code === this.formData.categoryCode) {
            this.formData.workSert = index
          }
        })
        this.radioInfo.forEach((el, index) => {
          if(el.code === this.formData.resourceList[0].code) {
            this.formData.audio = index
          }
        })
        this.radioInfo.forEach((el, index) => {
          if(el.code === this.formData.resourceList[0].code) {
            this.formData.audio = index
          }
        })
        const areaCodeList = res.data.areaCodeList
        const selectItem = []
        for (let i = 0; i < this.arealist.length; i++) {
          for (let j = 0; j < areaCodeList.length; j++) {
            if(areaCodeList[j] === this.arealist[i].code){
              selectItem.push(this.arealist[i].name)
            }
          }
        }
        if(res.data.weekList && res.data.weekList.length > 0){
          this.taskWeek = res.data.weekList
          setTimeout(() => {
            for (let i = 0; i < this.$refs.duty.weekDays.length; i++) {
              for (let j = 0; j < res.data.weekList.length; j++) {
                if(res.data.weekList[j] === this.$refs.duty.weekDays[i].key) {
                  this.$refs.duty.weekDays[i].active = true
                }
              }
            }
          })
        }
        this.chooseList = res.data.areaCodeList
        this.defaultSelected = res.data.areaCodeList
        this.formData.selectItem = selectItem.join(',')
        this.current = res.data.state === '1' ? 0 : 1
      },
      // 作息分类
      async _getRestByCode() {
        const res = await actions.getRestByCode(store.userInfo.schoolCode)
        this.restList = res.data.map(el=> el.name)
        this.restInfo = res.data
      },
      // 广播资源
      async _getRadioSource() {
        const req = {
          page: 1,
          size: 9999,
          schoolCode: store.userInfo.schoolCode
        }
        const res = await actions.getRadioSource(req)
        this.radiolist = res.data.records.map(el=>el.name)
        this.radioInfo = res.data.records
      },
      // 区域列表
      async _getRadioArea() {
        const res = await actions.getRadioArea(store.userInfo.schoolCode)
        this.arealist = res.data.map(el => {
          return {
            ...el,
            label: el.name,
            value: el.code
          }
        })
        this.formData.selectItem = this.arealist[0].label
        this.defaultSelected = !this.code ? [this.arealist[0].value] : []
        this.chooseList = [this.arealist[0].value]
      },
      // 区域选择
      confirm(e){ 
        this.formData.selectItem = e.map((el) => el.label).join(",")
        this.chooseList = e.map((el) => el.code)
      },
      // 任务类型
			changeType(val){
				this.formData.taskType = val
      },
			//获取负责人数据
			async getUserList() {
				const res = await actions.getGroupDetail({
					schoolCode: store.userInfo.schoolCode
				})
				this.causeNameList = res.data.leaders
      },
      // 作息分类选择
			changeData(e,checkItem) {
        this.formData[checkItem] = e.target.value
      },
      // 时间选择
      choose(type) {
        this.timeType = type
        if (type && !this.code) {
          if (type === 2) {
            this.params = {
              year: false,
              month: false,
              day: false,
              hour: true,
              minute: true,
              second: true
            }
          } else {
            this.params = {
              year: true,
              month: true,
              day: true,
              hour: false,
              minute: false,
              second: false
            }
          }
          this.dateShow = true
        } else if(type === 0) {
          this.show = true
        }
      },
       // 时间改变
      changeTime(item) {
        if (this.timeType === 1) {
          this.formData.startDate = `${item.year}-${item.month}-${item.day}`
        } else if (this.timeType === 2) {
          this.formData.startTime = `${item.hour}:${item.minute}:${item.second}`
        } else if (this.timeType === 3) {
          this.formData.endDate = `${item.year}-${item.month}-${item.day}`
        }
      },
      // 获取周任务时间
      getWeek(obj){
        this.taskWeek = obj.map(el => el.key)
      },
			submitForm() {
				validateForm(yzForm, this.formData, () => {
					this.$tools.confirm("确定提交作息广播吗？", () => {
            const req = {
              name: this.formData.name,
              startDate: this.formData.startDate,
              startTime: this.formData.startTime,
              endDate: this.formData.endDate,
              schoolCode: store.userInfo.schoolCode,
              categoryCode: this.restInfo[this.formData.workSert].code,
              categoryName: this.radioInfo[this.formData.audio].categoryName,
              resourceCodeList: [this.radioInfo[this.formData.audio].code],
              areaCodeList: this.chooseList,
              weekList: this.taskWeek,
              taskType: this.formData.taskType === 0 || this.formData.taskType === '1' ? '1' : '2'
            }
            if(req.taskType === '2' && this.taskWeek.length === 0){
              this.$tools.toast("请选择星期")
              return
            }
            if(this.code) {
              req.code = this.code
              actions.updateRadioTask(req).then(res => {
                this.$tools.toast("操作成功");
                this.$tools.goNext(() => {
                  eventBus.$emit('getList')
                  this.$tools.navTo({
                    url: `./index?state=1`
                  })
                })
              })
            } else {
              actions.addRadioTask(req).then(res => {
                this.$tools.toast("操作成功");
                this.$tools.goNext(() => {
                  eventBus.$emit('getList')
                  this.$tools.navTo({
                    url: `./index?state=1`
                  })
                })
              })
            }
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tip::before {
		position: absolute;
		content: '*';
		color: red;
		left: 10rpx;
		width: 10rpx;
		height: 10rpx;
	}
	.item-list {
		padding: 25rpx 10rpx 25rpx 30rpx;
		background: $uni-bg-color;
	}
	.item-input {
		width: 100%;
		font-size: 26rpx;
	}
	.log {
		background: $uni-bg-color;
		padding: 20rpx 0rpx;
		margin: 0rpx 0 30rpx 0;
		border-bottom: 1px solid $u-border-color;
	}
	.scroll-h {
		height: calc(100vh - 120rpx);
		.add-top {
			height: 200rpx;
		}
		/deep/ .u-item-first{
			border-top-left-radius: 13rpx;
    	border-bottom-left-radius: 13rpx;
		}
		.item-text-area {
			height: 120rpx;
			width: 100%;
			line-height: 40rpx;
			color: $u-content-color;
		}
	}
  .subsection {
    width: 280rpx;
  }
</style>
