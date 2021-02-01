<template>
	<view>
		<class-tree
			isCheck
			:isHighSchool="isHighSchool"
			v-show="classTag"
			:classTag="classTag"
			:schoolInfo="schoolInfo"
			@close="classClose"
			@confirm="classSelcet"
			:classChecked="formData.noWorkstu"
		></class-tree>
		<scroll-view scroll-y="true" class="scroll-h">
			<view class="u-fx item-list">
				<view class="tip">选择班级：</view>
				<view class="u-fx-f1 u-fx-je u-content-color u-font-01" @click="chooseClass">{{ noWorkstuLength }}</view>
				<view class="rit-icon"></view>
			</view>
			<view class="u-fx-wp u-bd-b u-bg-fff u-padd-20 u-padd-t0">
				<u-tag class="u-mar-10" size="mini" type="primary" :text="isHighSchool ? (item.gradeName + item.subjectName + item.className) : (item.gradeName + item.className)" :show="item.tag" v-for="(item, i) in formData.noWorkstu" :key="i" :index="i" />
			</view>
			<view class="u-fx item-list">
				<view class="tip">
					选择表扬语
					<text class="u-light-color">(最多选择3个标签,每个标签不超过5个字)</text>
				</view>
			</view>
			<view class="u-bd-b u-bg-fff u-padd-20">
				<u-tag
					class="tag u-mar-15"
					size="mini"
					:type="item.type"
					:mode="item.mode"
					:text="item.label"
					:show="item.tag"
					:closeable="item.del"
					v-for="(item, i) in recordList"
					:key="i"
					:index="i"
					@click="tagClick(item, i)"
					@close="tagDel(item, i)"
				/>
				<u-button type="info" size="mini" :hair-line="false" class="add_p" @click="open">
					<u-icon
						name="plus
"
					></u-icon>
					添加
				</u-button>
			</view>
		</scroll-view>
		<view class="common-btn" @click="submit">发布</view>
		<u-popup :maskCloseAble="true" ref="refuse" mode="center" length="80%" border-radius="14">
			<view class="u-bd-b">
				<view class="u-padd-40">
					<template>
						<u-input v-model="label" :type="type" :border="border" placeholder="输入表扬语" :maxlength="5" />
					</template>
				</view>
			</view>
			<view>
				<view class="u-fx u-fx-jsa u-padd-40">
					<view class="u-type-info u-font-1" @click="close()">取消</view>
					<view class="u-type-primary u-font-1" @click="addPraise()">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import eventBus from '@u/eventBus';
import { store, actions } from '../store/index.js';
import ChooseStudents from '@/components/choose-students/choose-students.vue';
import classTree from "@/components/class-tree/class-tree";
export default {
	components: { ChooseStudents, classTree },
	data() {
		return {
			isHighSchool: false,
			classCode: '',
			schoolYearId: '',
			formData: {
				noWorkstu: []
			},
			noWorkstuLength: '请选择',
			recordList: [],
			initList: [],
			border: true,
			type: 'input',
			label: '',
			classTag: false,
			schoolInfo: {
				schoolYearId: 0,
				schoolCode: ''
			},
			dataList: []
		};
	},
	computed: {},
	created() {
		this.isHighSchool = store.userInfo.schoolType === '8' || store.userInfo.schoolType === '9'
		this.classCode = uni.getStorageSync('classInfo').classCode;
		this.schoolInfo.schoolCode = store.userInfo.schoolCode;
		this.schoolInfo.schoolYearId = store.schoolYear.schoolYearId;
	},
	async mounted() {
		this.showList();
	},
	methods: {
		open() {
			this.$refs.refuse.open();
		},
		close() {
			this.$refs.refuse.close();
		},

		classClose() {
			this.classTag = false;
		},
		chooseClass() {
			this.classTag = true;
		},
		classSelcet(value) {
			this.classTag = false;
			this.formData.noWorkstu = value.map(el => {
				return {
					tag: true,
					category: 1,
					classCode: el.classCode,
					className: el.className,
					subjectName: el.subjectName,
					subjectCode: el.subjectCode,
					gradeCode: el.gradeCode,
					gradeName: el.gradeName,
					createUsercode: store.userInfo.userCode,
					createUsername: store.userInfo.userName,
					schoolCode: store.userInfo.schoolCode,
					schoolYearId: this.schoolInfo.schoolYearId
				};
			});
			this.noWorkstuLength = `已选择${this.formData.noWorkstu.length}个班级`;
		},
		tagClose(i) {
			this.formData.noWorkstu[i].tag = false;
			this.formData.noWorkstu = this.formData.noWorkstu.filter(ele => ele.tag);
			this.noWorkstuLength = `已选择${this.formData.noWorkstu.length}个班级`;
		},
		async showList() {
			const req = {
				...this.pageList,
				schoolCode: store.userInfo.schoolCode
			};
			const res = await actions.praiseList(req);
			if (!res.data.list) {
				this.dataList = [];
				return;
			}
			this.dataList = res.data.list.map(el => {
				return {
					...el,
					mode: 'plain',
					del: false,
					tag: true,
					type: 'info'
				};
			});
			this.recordList = this.dataList.filter(item => item.category === 1);
		},
		tagClick(item, index) {
			if (item.mode === 'light' || item.type === 'primary') {
				item.mode = 'plain';
				item.type = 'info';
				this.initList = this.initList.filter(el => el !== item);
			} else if (item.mode === 'plain' || item.type === 'info') {
				if (this.initList.length > 2) {
					this.$tools.toast('最多选择3个标签!');
					return;
				}
				item.mode = 'light';
				item.type = 'primary';
				this.initList.push(item);
			}
		},
		addPraise() {
			console.log(this.label);
			this.recordList.push({
				label: this.label,
				mode: 'plain',
				del: true,
				tag: true,
				type: 'info'
			});
			this.label = '';
			this.$refs.refuse.close();
		},
		tagDel(item, i) {
			this.recordList[i].tag = false;
			this.initList = this.initList.filter(el => el !== item);
		},
		async submit() {
			if (this.formData.noWorkstu.length === 0) {
				this.$tools.toast('请选择要表扬的班级!');
				return false;
			}
			if (this.initList.length === 0) {
				this.$tools.toast('请选择表扬语!');
				return false;
			}
			let label = [];
			this.initList.forEach(ele => {
				label.push(ele.label);
			});
			const req = {
				labelList: label,
				praiseList: this.formData.noWorkstu
			};
			await actions.addsetPraise(req);
			this.$tools.toast('操作成功', 'success');
			this.$tools.goNext(() => {
				eventBus.$emit('getList');
				this.$tools.goBack();
			});
		}
	}
};
</script>

<style lang="scss">
.scroll-h {
	height: calc(100vh - 100rpx);
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
.al-r {
	text-align: right;
}
.input-area {
	height: 400rpx;
}
/deep/ .uni-textarea-textarea {
	border: 1rpx solid $u-border-color;
	padding: 20rpx;
	height: 350rpx;
	line-height: 50rpx;
	color: $u-content-color;
}
/deep/ .uni-textarea-placeholder {
	padding: 20rpx;
}
.add_p {
	height: 50rpx;
	margin: 5px 10px;
	color: #909399;
	width: 93px;
	text-align: center;
	border: 1px solid #909399;
	border-radius: 3px;
}

.u-mar-15 {
	margin: 5px 10px;
}
.u-mode-plain-info {
	width: 93px;
	height: 50rpx;
	line-height: 32rpx;
	text-align: center;
}
.u-mode-light-primary {
	width: 93px;
	height: 50rpx;
	line-height: 32rpx;
	text-align: center;
}
/deep/ .u-mode-light-primary{
	width: auto !important;
}
</style>
