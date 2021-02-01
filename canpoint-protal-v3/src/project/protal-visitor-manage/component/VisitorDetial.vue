<template>
  <div class="visitor-detail">
    <div>
      <span>访客姓名：</span>
      <span>{{ recordDetail.visitorName }}</span>
    </div>
    <div>
      <span>访客手机号：</span>
      <span>{{ recordDetail.visitorMobile }}</span>
    </div>
    <div>
      <span>来访事由：</span>
      <span>{{ recordDetail.causeName }}</span>
    </div>
    <div>
      <span>审批状态：</span>
      <span>{{ getDataState('approvalStatus', recordDetail.state) }}</span>
    </div>
    <div>
      <span>访问状态：</span>
      <span>{{ getDataState('visitState', recordDetail.visitState) }}</span>
    </div>
    <div>
      <span>预计到达时间：</span>
      <span>{{ $tools.getDate(recordDetail.accessStartTime) }}</span>
    </div>
    <div v-if="recordDetail.inTime != null">
      <span>进入时间：</span>
      <span>{{ $tools.getDate(recordDetail.inTime) }}</span>
    </div>
    <div v-else>
      <span>通行开始时间：</span>
      <span>{{ $tools.getDate(recordDetail.accessStartTime) }}</span>
    </div>
    <div v-if="recordDetail.outTime != null">
      <span>签离时间：</span>
      <span>{{ $tools.getDate(recordDetail.outTime) }}</span>
    </div>
    <div v-else>
      <span>通行结束时间：</span>
      <span>{{ $tools.getDate(recordDetail.accessEndTime) }}</span>
    </div>
    <div>
      <span>来访时长：</span>
      <span>{{ recordDetail.duration }}</span>
    </div>
    <div>
      <span>进入地点：</span>
      <span>{{ recordDetail.inPlace }}</span>
    </div>
    <div>
      <span>离开地点：</span>
      <span>{{ recordDetail.outPlace }}</span>
    </div>
    <div>
      <span>被访人姓名：</span>
      <span>{{ recordDetail.respondentName }}</span>
    </div>
    <div>
      <span>被访人类型：</span>
      <span>{{ recordDetail.respondentType == '1' ? '教职工' : '学生' }}</span>
    </div>
    <div>
      <span>组织(班级)：</span>
      <span>{{ recordDetail.orgName }}{{ recordDetail.gradeName }}{{ recordDetail.clazzName }}</span>
    </div>
  </div>
</template>
<script>
import { getDataState } from '@u/libs/data-state'
export default {
  name: 'VisitorDetail',
  props: {
    recordDetail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      getDataState
    }
  }
}
</script>
<style lang="less">
.visitor-detail {
  line-height: 32px;
  div span:last-child {
    color: @u-content-color;
  }
}
</style>
