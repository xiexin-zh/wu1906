<template>
	<view class="">
		<choose-child v-if="userType === 3" @change="childInfo"></choose-child>
		<view class="dropdown u-bd-b">
			<ms-dropdown-menu v-if="userType !== 3 && showClass"><ms-dropdown-item v-model="value0" :list="classList" :title="defTitle"></ms-dropdown-item></ms-dropdown-menu>
		</view>
		<scroll-view scroll-y="true" :class="showClass ? 'scroll-h' : 'scroll'">
			<no-data v-if="dataList.length === 0" msg="暂无数据~"></no-data>
			<view class="u-auto">
				<u-swipe-action
					:show="item.show"
					:index="i"
					:options="options"
					@click="click"
					@open="open"
					class="approve-list u-mar-20 u-border-radius"
					v-for="(item, i) in dataList"
					:key="i"
					:disabled="item.disabled"
				>
					<view class="detail u-fx u-padd-20">
						<image class="u-border-radius-all u-mar-r20" :src="item.photoSrc || 'http://canpointtest.com/mobile-img/auto-teacher.png'" mode=""></image>
						<view :class="item.subjectName ? 'info' : 'info u-fx-ac'">
							<view class="name u-main-color u-fx-ac u-mar-b10">
								{{ item.teacherName }}
								<text class="u-tips-color u-mar-l20 u-font-02">({{ item.isBZR ? '班主任' : '任课老师' }})</text>
							</view>
							<u-tag v-if="item.subjectName" type="primary" :text="item.subjectName" size="mini" />
						</view>
					</view>
				</u-swipe-action>
			</view>
		</scroll-view>
		<view v-if="userType === 1" class="float-add-btn" @click="add()"></view>
	</view>
</template>

<script>
import chooseChild from '@/components/choose-child/choose-child.vue';
import eventBus from '@u/eventBus';
import noData from '@/components/no-data/no-data.vue';
import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue';
import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue';
import { store, actions } from './store/index.js';
export default {
	name: 'teacher-t',
	components: {
		msDropdownMenu,
		msDropdownItem,
		noData,
		chooseChild
	},
	data() {
		return {
			currentClass: uni.getStorageSync('currentClass') || 0,
			userType: 2, // 1.班主任，2.教职工，3.家长
			value0: '',
			classList: [],
			defTitle: '',
			pageList: {
				page: 1,
				size: 10
			},
			morePage: false,
			showClass: false,
			dataList: [],
			options: [
				{
					text: '移除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			]
		};
	},
	computed: {
		userInfo: () => store.userInfo,
		isBZR: () => store.isBZR,
		childList: () => store.childList
	},
	watch: {
		value0(val, oldval) {
			if (this.userType === 3) {
				return;
			}
			console.log(val)
			if (val !== oldval) {
				let choose = this.classList.filter(el => {
					return el.value === val;
				})[0];
				if ((store.isBZR && val === store.isBZR.classCode) || choose.isBZR) {
					this.userType = 1;
				} else {
					this.userType = 2;
				}
				this.defTitle = choose.text;
				this.classId = choose.classId;
				this.classCode = val;
				eventBus.$on('getList', () => {
					this.showList();
				});
				this.showList();
			}
		}
	},
	async created() {
		if (this.userInfo.typeCode === '4') {
			this.userType = 2;
			this.classList = JSON.parse(uni.getStorageSync('protal')).teachClassList;
			if (this.classList.length === 0) {
				this.$tools.toast('请绑定班级');
				return;
			}
			this.classCode = this.classList[this.currentClass].value;
			console.log(this.classList[this.currentClass].classId)
			this.classId = this.classList[this.currentClass].classId;
			this.showClass = true;
			this.defTitle = this.classList[this.currentClass].text;
			this.value0 = this.classList[this.currentClass].value;
		} else if (this.userInfo.typeCode === '16') {
			this.userType = 3;
			this.classCode = this.childList[0].classCode;
			this.classId = this.childList[0].classId;
			this.showList();
		}
	},
	methods: {
		childInfo(item) {
			if (item.userCode !== this.userCode) {
				this.classCode = item.classCode;
				this.classId = item.classId;
				this.showList();
			}
		},
		async showList() {
			this.dataList = []
			if(!this.classId){
				return
			}
			const req = {
				pageNum: 1,
				pageSize: 999,
				schoolCode: this.userInfo.schoolCode,
				classId: this.classId
			};
			console.log(this.classId)
			const classInfo = await actions.getClassInfo(this.classId);
			const res = await actions.getClassTeacherList(req);
			this.dataList = res.data.list.map(el => {
				return {
					id: el.id,
					teacherName: el.teacherName,
					isBZR: classInfo.data.teacherName === el.teacherName,
					subjectName: el.subjectName,
					teacherCode: el.teacherCode,
					photoSrc: el.photoSrc,
					disabled: this.userType !== 1,
					show:false
				}
			})
			if (this.dataList.every(el => !el.isBZR) && classInfo.data.teacherId) {
				this.dataList.unshift({
					photoSrc: classInfo.data.teacherPhoto,
					teacherName: classInfo.data.teacherName,
					teacherCode: classInfo.data.teacherCode,
					isBZR: true,
					subjectName: '',
					disabled: true,
					show:false
				});
			}
		},
		add() {
			this.$tools.navTo({
				url: `./add-teacher?classId=${this.classId}`
			});
		},
		click(index, index1) {
			if (index1 == 0) {
				console.log(this.dataList[index])
				let subjectName = this.dataList[index].subjectName.split(',')[0]
				this.$tools.delTip(`确定移除${subjectName}教师${this.dataList[index].teacherName}吗？`, () => {
					actions.deleteClassTeacher(this.dataList[index].id).then(() => {
						this.$tools.toast(`移除成功`, 'success');
						this.$tools.goNext(() => {
							this.showList();
						});
					});
				});
			}
		},
		open(index) {
			this.dataList[index].show = true;
			this.dataList.map((val, idx) => {
				if (index != idx) this.dataList[idx].show = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-h {
	height: calc(100vh - 80rpx);
}
.scroll {
	height: calc(100vh);
}
.dropdown {
	width: 100%;
}
.approve-list {
	.detail {
		image {
			width: 100rpx;
			height: 100rpx;
		}
	}
}
/deep/ .u-swipe-del{
	width: 140rpx;
}
</style>
