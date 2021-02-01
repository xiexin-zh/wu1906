<template>
	<view class="tab-list u-fx-jc">
    <view class="tab-title u-fx">
      <view v-for="tab in tabList" :key="tab.id" @click="tabChange(tab.id)" class="tab act">
        {{ tab.title }}
      </view>
    </view>
	</view>
</template>

<script>
	export default {
    props: {
      tabList: {
        type: Array,
        default: () => {
          return []
        }
      },
      value: {
        type: Number,
        default: 0
      }
    },
    computed: {
      currentType: {
        get () {
          return this.value
        },
        set (index) {
          this.$emit('input', index)
        }
      }
    },
		data() {
			return {
			}
		},
		methods: {
			tabChange (index) {
        this.currentType = index
      }
		}
	}
</script>

<style lang="scss" scoped>
  .tab-title {
    border: 1px @u-border-color solid;
    overflow: hidden;
    border-radius: 10rpx;
    .tab {
      line-height: 60rpx;
      height: 60rpx;
      padding: 0 44rpx;
      border-left: 1px @u-border-color solid;
      &:first-child {
        border-left: none;
      }
    }
    .act {
      background-color: $u-type-primary;
      color: #fff;
    }
  }
</style>
