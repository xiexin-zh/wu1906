<template>
	<view class="home">
		<scroll-view scroll-y="true" class="scroll-h u-fx-ver " @scrolltolower="loadMore">
			<view class="do-exe-cont u-type-white " >
				<view class="title u-font-2 u-bold-500 u-mar-b40">
					{{list.topicType==='1'?'单选题':'判断题'}}
				</view>
				<view class="exe u-font-02 u-content-color u-padd-l20">
					<view class="tab-title u-main-color u-bold-500">
						{{index+1}}、{{list.content}}。
					</view>
					<u-radio-group :wrap='true' v-model="list.checked" @change="radioGroupChange">
						<u-radio @change="radioChange" v-for="(item, index) in list.answer" :key="index" :name="item.option" :disabled="item.disabled">
							{{item.option}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
		</scroll-view>
		<view class="btn-box u-fx-f1 u-fx ">
			<u-button :disabled ='!index' class="u-fx-f1 u-mar-r u-mar-l u-bd-1px" @click="last">
				上一题
			</u-button>
			<u-button type="primary" class="u-fx-f1 u-mar-l u-mar-r" :disabled ='(index+1)===length'  @click="next">
				下一题
			</u-button>
		</view>
		<view class="footer u-fx-ac u-tips-color u-fx-jsb">
			<div class="left u-fx-ac">
				<u-icon size='40' name="/mobile-img/icon_yidati.png" class="u-mar-r20"></u-icon>
				已答题{{index+1}}/{{length}}
			</div>
			<div class="right u-type-white u-fx-ac-jc" @click="handPaper">
				交卷
			</div>
		</view>
	</view>
</template>
<script>
	import eventBus from "@u/eventBus";
	import {
		store,
		setStore,
		actions
	} from "../store/index.js";
	export default {
		components: {},
		data() {
			return {
				index:0,
				list: {}, //当前题目
				length:20, //总题数
			};
		},
		computed: {
			userInfo() {
				return store.userInfo;
			},
		},
		async created() {
			await this.setKey()
			await this.getTopic()
		},
		mounted() {
			eventBus.$on("getList", () => {
				// this.showList();
			});
		},
		methods: {
			//初始题目类型,题数,总题数
			setKey() {
				this.key = this.$tools.getQuery().get('type'); //做题类型 
				this.index =Number(this.$tools.getQuery().get('index')); //第几题
				this.paperId =Number(this.$tools.getQuery().get('paperId')); //专项做题试卷id
				this.length = store.randomDoEsc&&store.randomDoEsc.length 
			},
			//获取当前题目
			getTopic(){
				setTimeout(() => {
						this.list = store.randomDoEsc&&store.randomDoEsc[this.index]
				});
			},
			// vuex设置选中的答案
			radioChange(e) {
				let newData = JSON.parse(JSON.stringify(store.randomDoEsc))
				let isSelected = this.list.answer.find(el=>el.option===e).selected //选中的答案是否正确
				newData[this.index].checked = e
				newData[this.index].isSelected = isSelected
				//设置答题答案
				this._setStore('randomDoEsc',newData)
			},
			_setStore(key, data) {
				setStore({
					key: key,
					data: data
				})
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				// console.log(e);
			},
			//下一题
			next(){
				this.$tools.navTo({
					url: `./randomDoEsc?type=${this.key}&index=${this.index+1}`,
				});
			},
			//上一题
			last(){
				this.$tools.navTo({
					url: `./randomDoEsc?type=${this.key}&index=${this.index-1}`,
				});
			},
			//交卷
			handPaper() {
				let noNumber = store.randomDoEsc.filter(v=>!v.checked).length
				if(noNumber){
					this.$tools.confirm(`您还${noNumber}道题没有做完,确定提交试卷吗？ `, () => {
						this.submit()
					})
				}else{
					this.submit()
				}
				setStore({
						key: 'endTime',
						data: new Date().getTime()
					})
			},
			//提交数据
			async submit(){
				let req = {
					rightList:store.randomDoEsc.filter(v=>v.isSelected).map(v=>v.exercisesId),//答对题的习题id集合
					schoolCode: store.userInfo.schoolCode,
					userCode: store.userInfo.userCode,
					wrongList: store.randomDoEsc.filter(v=>!v.isSelected).map(v=>v.exercisesId) //答错题的习题id集合
				}
				let res = await actions.reportTest(req);
				this.$tools.toast('交卷成功')
				this.$tools.goNext(() => {
					this.$tools.navTo({
						url: `./result?type=${this.key}`,
					});
				})
			},
		},
	};
</script>
<style lang="scss" scoped>
	.home {
		.scroll-h {
			height: calc(100vh - 128rpx);
			background: url(/mobile-img/bg_header1.png) top no-repeat;
			background-size: 100% 234rpx;

			.do-exe-cont {
				padding: 47rpx 30rpx 0rpx 30rpx;

				.exe {
					padding: 60rpx 40rpx;
					top: 294rpx;
					left: 30rpx;
					width: 690rpx;
					background: #ffffff;
					box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(20, 7, 0, 0.1);
					border-radius: 15rpx;

					.tab-title {
						font-size: 30rpx;
					}

					.u-radio-group {
						padding-top: 30rpx;

						.u-radio {
							line-height: 80rpx
						}
					}
				}
			}

		}

		.btn-box {
			width: 100%;
			padding: 0rpx 50rpx;
			position: absolute;
			bottom: 200rpx;

			.item {
				// height: 104rpx;
				// background: #ffffff;
				// border: 1rpx solid #fafbfd;
				// box-shadow: 0rpx 10rpx 30rpx 0rpx rgba(9, 28, 62, 0.06);
				// border-radius: 8rpx;
				// padding: 0rpx 30rpx;
			}
		}

		.footer {
			padding: 0 30rpx;
			width: 100%;
			height: 128rpx;
			background: #FFFFFF;
			box-shadow: 0px -5px 19px 1px rgba(0, 0, 0, 0.06);

			.right {
				width: 388rpx;
				height: 72rpx;
				background: #0084FF;
				border-radius: 36rpx;
			}
		}
	}
</style>
