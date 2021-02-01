<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-h ">
			<view class="u-bd-b u-padd-20 u-bg-fff">
				<view class="u-line2">在学校大门手机看附件四季风甲方is礼佛色日晚间是的冯绍峰发出沃特世test瑞安市突然从特务。</view>
				<view class="u-mar-t20 u-mar-b10">
					<image class="img u-mar-r20" v-for="(img,index) in detailInfo.photoUrls" :key="index" :src="img.img" mode=""></image>
				</view>
			</view>
			<view class="u-mar-t10">
				<view class="u-fx-ac u-bd-b item-list">
					<view>隐患地点：</view>
					<view class="u-fx-f1 u-fx-je ">校大门</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>负责人：</view>
					<view class="u-fx-f1 u-fx-je ">李文博</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>现隐患状态：</view>
					<view class="u-fx-f1 u-fx-je ">已指派</view>
				</view>

				<view class="u-fx-ac u-mar-t10 u-bd-b item-list">
					<view>隐患类别：</view>
					<view class="u-fx-f1 u-fx-je ">校舍/设施/设备</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>隐患严重等级：</view>
					<view class="u-fx-f1 u-fx-je ">一般风险</view>
				</view>
				<view class="u-fx-ac u-bd-b item-list">
					<view>隐患指派：</view>
					<view class="u-fx-f1 u-fx-je ">
						<picker class="" mode="selector"   :value="formData.cause" :range="dangerLevenList" @change="chooseCause">
							{{ causeNameList[formData.cause] || '朱迪' }}
						</picker>
					</view>
				</view>
        <view class="u-fx-ac u-bd-b item-list">
          <view >要求处理完成时间：</view>
          <view class="u-fx-f1 u-fx-je ">24&nbsp;小时</view>
        </view>
				<view class="u-fx-ver u-bd-b  item-list">
					<view>整改照片：</view>
					<view class="u-fx-f1 mar-r20">
            <an-upload-img v-model="taskResultList.photoUrls" total="9" style="margin: 20rpx"></an-upload-img>
          </view>
			  </view>
        <view class="u-fx-ver u-bd-b item-list">
					<view>整改备注：</view>
					<view class="u-fx-f1 mar-r20">
            <textarea :auto-height="true"  class="item-input u-light-color" maxlength="100" v-model="formData.content"
              style="text-align: right;height:180rpx" placeholder="请填写整改备注" />
          </view>
			  </view>
        <view class="u-padd u-mar-t10 u-bg-fff">
          <view class="u-mar-b10">
            处理流水：
          </view>
          <approval-step :data-list="dataList"></approval-step>
        </view>
      </view>
		</scroll-view>
    <view class="footer-btn u-fx-ac u-bg-color">
      <u-button
        type="primary"
        class="u-fx-f1 u-mar-l u-mar-r "
        @click="assignDanger"
      >
        处理隐患
      </u-button>
    </view>
  </view>
</template>

<script>
import eventBus from '@u/eventBus'
import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
import { store, actions } from './store/index.js'
export default {
  components: {
    anUploadImg
  },
  data () {
    return {
      itemStyle:{
        background:'#fff',
        paddingLeft:'20rpx',
        paddingRight:'20rpx',
        marginTop:'20rpx'
      },
      dangerCategoryList: ['【系统】地质灾害','【系统】食品卫生','【系统】人身安全','【系统】校舍、设施、设备','【系统】水，电'],
      dangerLevenList: ['重大风险','较大风险','一般风险','低风险'],
      // dangerLevenList: [
      //   {label:'重大风险',value:'1',color:'red'},
      //   {label:'较大风险',value:'2',color:'green'},
      //   {label:'一般风险',value:'3',color:'pink'},
      //   {label:'低风险',value:'4',color:'black'},
      // ],
      show:false,
      params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
      },
      dataList: [
        {
          photoUrl: '',
					dateTime: '',
					label: '审批人',
					labelName: '', // 如果是多个用逗号隔开
					statusName:  '', // 如果是多个用逗号隔开
					status: ''
        },
        // {
        //   photoUrl: '',
				// 	dateTime: '',
				// 	label: '审批人',
				// 	labelName: '', // 如果是多个用逗号隔开
				// 	statusName:  '', // 如果是多个用逗号隔开
				// 	status: ''
        // },
      ],
      detailInfo: {
      photoUrls:[
        {img:'/mobile-img/safe-rcywc.png'},
        {img:'/mobile-img/safe-rcdwc.png'},
        {img:'/mobile-img/safe-sbywc.png'},
        {img:'/mobile-img/safe-sbywc.png'},
      ]
      },
      schoolNameList: [],
      causeNameList: ['章丘','李曲','吴起'],
      startYear: new Date().getFullYear(),
			formData: {
        school: 0,
        visitorName: '',
        phone: '',
        cause: '',
        accessStartTime: this.$tools.getDateTime(new Date(), 'dateTimeWithOutSecond'),
        togetherNum: '',
        photoUrl: '',
        isSign: false,
      },
      checked: false,
      taskId: '',
      taskResultList: {}
    }
  },
  mounted () {
    // this.taskId = this.$tools.getQuery().get('taskId')
    // this.taskResultGet()
  },
  methods: {
    assignDanger(){
       this.$tools.confirm("确定指派报隐患吗？", () => {
        this.$tools.goNext(() => {
          eventBus.$emit('getList');
          this.$tools.goBack();
          this.$tools.goNext(() => {
            this.$tools.toast("指派成功", "success");
          });
        });
      });
    },
    async  taskResultGet () {
      const res = await actions.getTaskResult(this.taskId)
      this.taskResultList = res.data
    },
    chooseCause(e) {
			this.formData.cause = e.target.value;
		},
    dataFilter (data) {
      return data.map(el=>{
        return {
          ...el,
          state: el.checked ? '1' : '2',
          children: el.children && el.children.length > 0 ? this.dataFilter(el.children) : []
        }
      })
    },
    submitForm () {
      this.$tools.confirm("确定上报隐患吗？", () => {
        this.$tools.goNext(() => {
          eventBus.$emit('getList');
          this.$tools.goBack();
          this.$tools.goNext(() => {
            this.$tools.toast("上报成功", "success");
          });
        });
        // actions.ApplicationRecall({
        //   id: this.showOperationId
        // }).then((res) => {
        //   this.$tools.toast("上报成功", "success");
        //   // this.showList();
        // });
      });
      // this.$tools.navTo({
			// 		url: `./addDanger`,
			// 		title: ''
		  // })
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 88rpx);
  .img{
    height: 150rpx;
    width: 156rpx;
  }
}
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
	color: $u-tips-color;
}
.radio {
	padding-left: 25rpx;
}
.checkbox {
	padding: 30rpx 10px 10px 2px;
}
.log {
	background: $uni-bg-color;
	padding: 20rpx 0rpx;
	margin: 20rpx 0 30rpx 0;
	border-bottom: 1px solid $u-border-color;
}
.al-r {
	text-align: right;
}
.scroll-h {
  height: calc(100vh - 120rpx);
  .add-top {
    height: 200rpx;
  }
  .item-text-area {
		height: 120rpx;
		width: 100%;
		line-height: 40rpx;
		color: $u-content-color;
  }
}
</style>
